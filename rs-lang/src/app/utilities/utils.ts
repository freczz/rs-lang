import { Store } from '@ngxs/store';
import {
  IGameResult,
  IWordSpecial,
  WordData,
  IUserSettings,
  IGameWords,
  IWordSetter,
  IOptionStats,
  IUserSettingsData,
} from '../interfaces/interfaces';
import { WordStatistic, Difficulty, StatesDefault, OptionSettings } from '../constants/constants';
import {
  getAllWordsSpecials,
  getUserSetting,
  setUserSetting,
  getUserWord,
  updateUserWord,
  createUserWord,
} from './server-requests';

function isRight(): boolean {
  return Math.random() < 0.5;
}

function getRandomNumber(count: number): number {
  return Math.floor(Math.random() * count);
}

function updateWordStats(wordData: IWordSpecial, answer: boolean): string {
  const wordSpecial: IWordSpecial = wordData;
  const wordStats: number[] = wordSpecial.optional.status.split('-').map((elem: string): number => +elem);
  if (answer) {
    wordStats[WordStatistic.wins]++;
    wordStats[WordStatistic.currentWins]++;
  } else {
    wordStats[WordStatistic.currentWins] = 0;
    wordStats[WordStatistic.lose]++;
    if (wordSpecial.difficulty === Difficulty.learned) {
      wordSpecial.difficulty = Difficulty.progress;
    }
  }
  if (
    wordStats[WordStatistic.currentWins] === WordStatistic.maxWinsLearned &&
    wordSpecial.difficulty === Difficulty.progress
  ) {
    wordSpecial.difficulty = Difficulty.learned;
  }
  if (
    wordStats[WordStatistic.currentWins] === WordStatistic.maxWinsHard &&
    wordSpecial.difficulty === Difficulty.hard
  ) {
    wordSpecial.difficulty = Difficulty.learned;
  }
  return wordStats.join('-');
}

function updateSettingData(option: string, newWords: number, percent: number, winLine: number): string {
  const settingData: number[] = option.split('-').map((elem: string): number => +elem);
  settingData[OptionSettings.newWords] += newWords;
  settingData[OptionSettings.percent] = settingData[OptionSettings.percent]
    ? Math.round((settingData[OptionSettings.percent] + percent) / 2)
    : percent;
  settingData[OptionSettings.winLine] =
    settingData[OptionSettings.winLine] > winLine ? settingData[OptionSettings.winLine] : winLine;
  return settingData.join('-');
}

async function updateGameSettings(gameStatistic: IGameResult, game: string, store: Store): Promise<void> {
  const answerRight: IGameWords[] = gameStatistic.words.filter((word: IGameWords): boolean => word.answer);
  const percentWins: number = Math.round((answerRight.length / gameStatistic.words.length) * 100);
  const settingsData: IUserSettings = await getUserSetting(store);
  let prevOptions: string;
  if (!settingsData.optional) {
    settingsData.optional = {
      sprint: StatesDefault.game,
      audio: StatesDefault.game,
    };
  }
  if (game === 'sprint') {
    prevOptions = settingsData.optional.sprint;
    const optionSprint: string = updateSettingData(
      prevOptions,
      gameStatistic.words.length,
      percentWins,
      gameStatistic.bestLine
    );
    settingsData.optional.sprint = optionSprint;
  } else {
    prevOptions = settingsData.optional.audio;
    const optionAudio: string = updateSettingData(
      prevOptions,
      gameStatistic.words.length,
      percentWins,
      gameStatistic.bestLine
    );
    settingsData.optional.audio = optionAudio;
  }
  settingsData.wordsPerDay += gameStatistic.words.length;
  const option: IUserSettingsData = { wordsPerDay: settingsData.wordsPerDay, optional: settingsData.optional };
  setUserSetting(store, option);
}

async function setGamesStatistic(gameStatistic: IGameResult, game: string, store: Store): Promise<void> {
  const specialWords: IWordSpecial[] = await getAllWordsSpecials(store);
  gameStatistic.words.forEach(async (word: IGameWords): Promise<void> => {
    if (specialWords.some((specialWord: IWordSpecial): boolean => specialWord.wordId === word.wordId)) {
      const wordData: IWordSpecial = await getUserWord(store, word.wordId);
      const optionalState: string = updateWordStats(wordData, word.answer);
      const optional: IOptionStats = { status: optionalState };
      const wordSetter: IWordSetter = { difficulty: wordData.difficulty, optional };
      updateUserWord(store, word.wordId, wordSetter);
    } else {
      const optionStatus: string = word.answer ? StatesDefault.win : StatesDefault.lose;
      const optional: IOptionStats = { status: optionStatus };
      const wordSetter: IWordSetter = { difficulty: Difficulty.progress, optional };
      createUserWord(store, word.wordId, wordSetter);
    }
  });
  updateGameSettings(gameStatistic, game, store);
}

function saveResult(statistics: IGameResult, currentWord: WordData, isAnswer: boolean): void {
  const gameStatistic: IGameResult = statistics;
  if (isAnswer) {
    gameStatistic.longLine++;
  } else {
    gameStatistic.bestLine =
      gameStatistic.bestLine < gameStatistic.longLine ? gameStatistic.longLine : gameStatistic.bestLine;
    gameStatistic.longLine = 0;
  }
  gameStatistic.words.push({ wordId: currentWord.id, answer: isAnswer });
}

function getWordsLearned(words: IWordSpecial[]): string[] {
  return words
    .filter((word: IWordSpecial) => word.difficulty === Difficulty.learned)
    .map((word: IWordSpecial) => word.wordId);
}

export { isRight, getRandomNumber, saveResult, getWordsLearned, setGamesStatistic };
