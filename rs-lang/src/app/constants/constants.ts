import { ITeam } from '../interfaces/interfaces';

export const team: ITeam[] = [
  {
    imgLink: 'alexey',
    firstName: 'Алексей',
    secondName: 'Виринский',
    githubLink: 'freczz',
    status: 'Team lead',
    tasks: ['Главная страница', '', ''],
  },
  {
    imgLink: 'dmitriy',
    firstName: 'Дмитрий',
    secondName: 'Петралай',
    githubLink: 'Dimas-worker',
    status: 'Developer',
    tasks: ['', '', ''],
  },
  {
    imgLink: 'vladislav',
    firstName: 'Владислав',
    secondName: 'Кочерга',
    githubLink: 'VladKocherga',
    status: 'Developer',
    tasks: ['', '', ''],
  },
];

export const BASE_URL: string = 'https://angular-rslang.herokuapp.com/';

export const LIST_LEVELS: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const DEFAULT_VALUE: number = 0;

export const PLAY_TIME: number = 30;

export const INDICATORS: number[] = [1, 2, 3];

export const PAGES_AMOUNT: number = 30;

export const WORDS_AMOUNT: number = 600;

export const SERVER_LINK: string = 'https://angular-rslang.herokuapp.com/';

export const ROUND_COUNT: number = 10;

export const COUNT_ANSWER: number = 5;

export const MAX_PAGE: number = 29;

export const MAX_WORD_NUMBER = 19;

export const GAME_LEVELS = ['0', '1', '2', '3', '4', '5'];

export const enum PointsData {
  limitAnswers = 3,
  coefficient = 10,
}

export const enum SoundUrls {
  endGame = './assets/audio/end-round.mp3',
  correctAnswer = './assets/audio/correct-answer.mp3',
  wrongAnswer = './assets/audio/wrong-answer.mp3',
}

export const enum Difficulty {
  learned = 'learned',
  progress = 'progress',
  hard = 'hard',
}

export const enum WordStatistic {
  wins = 0,
  lose = 1,
  currentWins = 2,
  maxWinsLearned = 3,
  maxWinsHard = 5,
}

export const enum OptionSettings {
  newWords,
  percent,
  winLine,
}

export const enum StatesDefault {
  game = '0-0-0',
  win = '1-0-1',
  lose = '0-1-0',
}

export const enum NextOrKnow {
  next = 'Далее',
  know = 'Не знаю',
}
