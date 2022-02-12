export class SetPrevVisitedPage {
  static readonly type = '[RSL] Set previous visited page';

  constructor(public prevVisitedPage: string) {}
}

export class SetToken {
  static readonly type = '[RSL] Set token';

  constructor(public token: string) {}
}

export class SetTextbookPage {
  static readonly type = '[RSL] Set textbook page';

  constructor(public textbookPage: string) {}
}
