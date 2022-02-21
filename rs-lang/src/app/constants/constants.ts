import { ITeam, IUserSettingsData, IUserStatisticData, IGameStatistic } from '../interfaces/interfaces';

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

export const EMAIL_PATTERN: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

export const PASSWORD_MIN_LENGTH: number = 8;

export const HEIGHT_SCROLL = -80;

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

export const USER_SETTINGS: IUserSettingsData = {
  optional: {
    sprint: '0-0-0',
    audio: '0-0-0',
    period: '[]',
  },
  wordsPerDay: 0,
};

export const USER_STATISTIC: IUserStatisticData = {
  optional: {
    period: '[]',
  },
  learnedWords: 0,
};

export const enum ActionLearned {
  added,
  removed,
}

export const enum TokenTimeLimit {
  end = 269,
  refresh = 239,
}

export const MILLISECOND: number = 60000;

export const GAME_STATISTIC: IGameStatistic[] = [
  {
    class: 'learned',
    title: 'Изучено слов:',
    value: '0',
  },
  {
    class: 'ratio',
    title: 'Правильных ответов:',
    value: '0',
  },
  {
    class: 'bestLine',
    title: 'Самая длинная серия правлиьных ответов:',
    value: '0',
  }
]
