export class SetPrevVisitedPage {
  static readonly type = '[RSL] Set previous visited page';

  constructor(public prevVisitedPage: string) {}
}

export class SetToken {
  static readonly type = '[RSL] Set token';

  constructor(public token: string) {}
}

export class SetUserId {
  static readonly type = '[RSL] Set user ID';

  constructor(public userId: string) {}
}

export class SetRefreshToken {
  static readonly type = '[RSL] Set refreshToken';

  constructor(public refreshToken: string) {}
}

export class SetTextbookPage {
  static readonly type = '[RSL] Set textbook page';

  constructor(public textbookPage: string) {}
}

export class SetWordsLevel {
  static readonly type = '[RSL] Set words level';

  constructor(public wordsLevel: string) {}
}

export class SetUserSettings {
  static readonly type = '[RSL] Set user settings';

  constructor(public userSettings: string) {}
}

export class SetUserStatistic {
  static readonly type = '[RSL] Set user statistic';

  constructor(public userStatistic: string) {}
}

export class SetUserDate {
  static readonly type = '[RSL] Set user date';

  constructor(public userData: number) {}
}
