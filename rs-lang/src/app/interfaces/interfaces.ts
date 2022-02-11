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

export interface IAudiocallGameComponent {
  raundCount: number;
  numberRaund: number;
  trueAnswerCount: number;
  loseAudios: string[];
  wordsRu: string[] | undefined;
  wordsEng: string[] | undefined;
  audios: string[] | undefined;
  levels: string[];
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
  generaneAnswers(countAnswer: number): Promise<void>;
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
