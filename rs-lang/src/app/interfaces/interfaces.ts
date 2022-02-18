export interface INavLinks {
  url: string;
  content: string;
}

export interface ITeam {
  imgLink: string;
  firstName: string;
  secondName: string;
  githubLink: string;
  status: string;
  tasks: string[];
}

export interface IWordData {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}

export interface ILevelGame {
  isStart: boolean;
  level: string;
}

export interface IGameWords {
  wordId: string;
  answer: boolean;
}

export interface IGameResult {
  words: IGameWords[];
  longLine: number;
  bestLine: number;
}

export interface ISprint {
  gameStatistic: IGameResult;
  score: number;
  timer: number;
  timerID: ReturnType<typeof setTimeout> | null;
  multiplier: number;
  words: IWordData[];
  tour: number;
  word: string;
  transcript: string;
  page: number;
  correctWords: IWordData[];
  unCorrectWords: IWordData[];
  correctAnswerCount: number;
  isAnswerOption: boolean;
  isLoading: boolean;
  isFinish: boolean;
  isEndTour: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  indicators: number[];
  setTimer(): void;
  setRound(): void;
  checkAnswer(isTrue: boolean): void;
  checkAnswerLimit(): void;
  resetAnswerLimit(): void;
  updateParameters(): void;
  resetGame(): void;
  replay(isClick: boolean): void;
}

export interface IOptionStats {
  status: string;
}
export interface IWordSetter {
  difficulty: string;
  optional: IOptionStats;
}

export interface IWordSpecial extends IWordSetter {
  userId: string;
  wordId: string;
}

export interface IGameSettings {
  sprint: string;
  audio: string;
}

export interface IUserSettingsData {
  optional: IGameSettings;
  wordsPerDay: number;
}

export interface IUserSettings extends IUserSettingsData {
  id: string;
}

export interface IAudiocallGame {
  numberRound: number;
  trueAnswerCount: number;
  loseAudios: string[];
  wordsRu: string[] | undefined;
  wordsEng: string[] | undefined;
  audios: string[] | undefined;
  visibleSwitchLevel: boolean;
  visibleAudiocallGame: boolean;
  visibleCardContainer: boolean;
  lvlNumber: string;
  audio: HTMLAudioElement | undefined;
  trueAnswerNumber: number | undefined;
  red: boolean;
  trueAnswerImage: string;
  answerText: string;
  winsAudios: string[];
  wordsWin: string[][];
  wordsLose: string[][];
  imgsOfTrueAnswers: string[] | undefined;
  nextOrKnow: string;
  visibleResult: boolean;
  switchFullscreen(): void;
  generateAnswers(countAnswer: number): Promise<void>;
  generateAudio(): void;
  switchLevel(event: MouseEvent): void;
  playAudio(): void;
  receiveAnswer(answerNumber: string, event?: MouseEvent): void;
  showTrueAnswer(): void;
  showNextQuestion(): void;
  showResult(): void;
  playAuidoInResult(event: MouseEvent): void;
  resetResult(): void;
  checkIdenticalAnswers(): void;
}

export interface IWords {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}

export type Words = IWords[];
