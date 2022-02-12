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

export interface WordData {
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

export interface LevelGame {
  isStart: boolean;
  level: string;
}

export interface SprintStatistic {
  word: string;
  correct: number;
  wrong: number;
}
