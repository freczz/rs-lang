import { Store } from '@ngxs/store';
import {
  IGameResult,
  IWordSpecial,
  IGameWords,
  IWordSetter,
  IOptionStats,
  IUserSettingsData,
  IUserStatisticData,
} from '../interfaces/interfaces';
import { WordStatistic, Difficulty, StatesDefault, OptionSettings, ActionLearned } from '../constants/constants';
import {
  getAllWordsSpecials,
  setUserSetting,
  getUserWord,
  updateUserWord,
  createUserWord,
  setStatistic,
} from './server-requests';
import RSLState from '../store/rsl.state';
import { SetUserSettings, SetUserStatistic } from '../store/rsl.action';

function isRight(): boolean {
  return Math.random() < 0.5;
}

function getRandomNumber(count: number): number {
  return Math.floor(Math.random() * count);
}

function updateWordToLeaned(store: Store, action: number): void {
  const userStatistic: string = store.selectSnapshot(RSLState.userStatistic);
  const resultData: IUserStatisticData = JSON.parse(userStatistic);
  switch (action) {
    case ActionLearned.added:
      resultData.learnedWords++;
      break;
    case ActionLearned.removed:
      resultData.learnedWords--;
      break;
    default:
      resultData.learnedWords = 0;
  }
  store.dispatch(new SetUserStatistic(JSON.stringify(resultData)));
}

function updateWordStats(wordData: IWordSpecial, answer: boolean, store: Store): string {
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
      updateWordToLeaned(store, ActionLearned.removed);
    }
  }
  if (
    wordStats[WordStatistic.currentWins] === WordStatistic.maxWinsLearned &&
    wordSpecial.difficulty === Difficulty.progress
  ) {
    wordSpecial.difficulty = Difficulty.learned;
    updateWordToLeaned(store, ActionLearned.added);
  }
  if (
    wordStats[WordStatistic.currentWins] === WordStatistic.maxWinsHard &&
    wordSpecial.difficulty === Difficulty.hard
  ) {
    wordSpecial.difficulty = Difficulty.learned;
    updateWordToLeaned(store, ActionLearned.added);
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

function setUserStatistics(store: Store): void {
  const userStatistic: IUserStatisticData = JSON.parse(store.selectSnapshot(RSLState.userStatistic));
  setStatistic(store, userStatistic);
}

async function updateGameSettings(
  gameStatistic: IGameResult,
  game: string,
  store: Store,
  newWords: number
): Promise<void> {
  const answerRight: IGameWords[] = gameStatistic.words.filter((word: IGameWords): boolean => word.answer);
  const percentWins: number = Math.round((answerRight.length / gameStatistic.words.length) * 100);
  const settingsData = JSON.parse(store.selectSnapshot(RSLState.userSettings));
  let prevOptions: string;
  if (game === 'sprint') {
    prevOptions = settingsData.optional.sprint;
    const optionSprint: string = updateSettingData(prevOptions, newWords, percentWins, gameStatistic.bestLine);
    settingsData.optional.sprint = optionSprint;
  } else {
    prevOptions = settingsData.optional.audio;
    const optionAudio: string = updateSettingData(prevOptions, newWords, percentWins, gameStatistic.bestLine);
    settingsData.optional.audio = optionAudio;
  }
  settingsData.wordsPerDay += newWords;
  const option: IUserSettingsData = { wordsPerDay: settingsData.wordsPerDay, optional: settingsData.optional };
  store.dispatch(new SetUserSettings(JSON.stringify(option)));
  setUserStatistics(store);
  setUserSetting(store, option);
}

async function setGamesStatistic(gameStatistic: IGameResult, game: string, store: Store): Promise<void> {
  const specialWords: IWordSpecial[] = await getAllWordsSpecials(store);
  let currentNewWords: number = 0;
  gameStatistic.words.forEach(async (word: IGameWords): Promise<void> => {
    if (specialWords.some((specialWord: IWordSpecial): boolean => specialWord.wordId === word.wordId)) {
      const wordData: IWordSpecial = await getUserWord(store, word.wordId);
      const optionalState: string = updateWordStats(wordData, word.answer, store);
      const optional: IOptionStats = { status: optionalState };
      const wordSetter: IWordSetter = { difficulty: wordData.difficulty, optional };
      updateUserWord(store, word.wordId, wordSetter);
    } else {
      const optionStatus: string = word.answer ? StatesDefault.win : StatesDefault.lose;
      const optional: IOptionStats = { status: optionStatus };
      const wordSetter: IWordSetter = { difficulty: Difficulty.progress, optional };
      createUserWord(store, word.wordId, wordSetter);
      currentNewWords++;
    }
  });
  if (currentNewWords) {
    updateGameSettings(gameStatistic, game, store, currentNewWords);
  }
}

function saveResult(statistics: IGameResult, currentWordId: string, isAnswer: boolean): void {
  const gameStatistic: IGameResult = statistics;
  if (isAnswer) {
    gameStatistic.longLine++;
  } else {
    gameStatistic.longLine = 0;
  }
  gameStatistic.bestLine =
    gameStatistic.bestLine < gameStatistic.longLine ? gameStatistic.longLine : gameStatistic.bestLine;
  if (gameStatistic.words.some((wordId: IGameWords): boolean => wordId.wordId === currentWordId)) return;
  gameStatistic.words.push({ wordId: currentWordId, answer: isAnswer });
}

function getWordsLearned(words: IWordSpecial[]): string[] {
  return words
    .filter((word: IWordSpecial) => word.difficulty === Difficulty.learned)
    .map((word: IWordSpecial) => word.wordId);
}

export default function randomNumberByInterval(min: number, max: number): number {
  const rand: number = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export { isRight, getRandomNumber, saveResult, getWordsLearned, setGamesStatistic };
