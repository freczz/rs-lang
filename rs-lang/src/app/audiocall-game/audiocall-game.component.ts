import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-audiocall-game',
  templateUrl: './audiocall-game.component.html',
  styleUrls: ['./audiocall-game.component.scss'],
})
export class AudiocallGameComponent {
  fullscreenBackground: string = 'url(../../assets/svg/fullscreen.svg) center / contain no-repeat';

  @ViewChild('audiocallContainer', { static: false }) audiocallContainer!: ElementRef;

  @ViewChild('levelNumber', { static: false }) levelNumber!: ElementRef;

  @ViewChild('answersContainer', { static: false }) answersContainer!: ElementRef;

  key: string | undefined;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const { key } = event;
    if (key === ' ') {
      this.playAudio();
    } else if (key === 'Enter') {
      this.showNextQuestion();
    } else if (key === '1' || key === '2' || key === '3' || key === '4' || key === '5') {
      this.receiveAnswer(key);
    }
  }

  raundCount: number = 11;

  numberRaund: number = 0;

  trueAnswerCount = 0;

  loseWordsRu: string[] = [];

  loseWordsEng: string[] = [];

  loseAudios: string[] = [];

  wordsRu: string[] | undefined;

  wordsEng: string[] | undefined;

  audios: string[] | undefined;

  levels: string[] = ['0', '1', '2', '3', '4', '5'];

  visibleSwitchLevel: boolean = true;

  visibleAudiocallGame: boolean = false;

  visibleCardContainer: boolean = false;

  lvlNumber!: string;

  audio: HTMLAudioElement | undefined;

  trueAnswerNumber: number | undefined;

  answersColors = 'white';

  red = false;

  trueAnswerImage = '';

  answerText = '';

  winsAudios: string[] = [];

  wordsWin: string[][] = [[], []];

  wordsLose: string[][] = [[], []];

  imgs: string[] | undefined;

  nextOrKnow: string = 'Не знаю';

  visibleResult = false;

  switchFullscreen(): void {
    if (!this.fullscreenBackground.match('exit')) {
      this.fullscreenBackground = 'url(../../assets/svg/exitfullscreen.svg) center / contain no-repeat';
      this.audiocallContainer!.nativeElement.requestFullscreen();
    } else {
      this.fullscreenBackground = 'url(../../assets/svg/fullscreen.svg) center / contain no-repeat';
      document.exitFullscreen();
    }
  }

  async generaneAnswers(countAnswer: number) {
    this.visibleCardContainer = false;
    this.wordsRu = [];
    this.audios = [];
    this.wordsEng = [];
    this.imgs = [];
    this.numberRaund++;
    if (this.raundCount === this.numberRaund) {
      this.showResult();
    }
    for (let i = 0; i < countAnswer; i++) {
      const page: number = randomNumberByInterval(0, 29);
      const wordNumber: number = randomNumberByInterval(0, 19);
      const rawResponse = fetch(
        `https://react-learnwords-example.herokuapp.com/words?page=${page}&group=${this.lvlNumber}`,
        {
          method: 'GET',
        }
      );
      const words = await (await rawResponse).json();
      this.imgs.push(words[wordNumber].image);
      this.wordsEng.push(words[wordNumber].word);
      this.wordsRu.push(words[wordNumber].wordTranslate);
      this.audios.push(words[wordNumber].audio);
    }
    this.generateAudio();
  }

  generateAudio(): void {
    this.trueAnswerNumber = randomNumberByInterval(0, 4);
    this.audio = new Audio(`https://react-learnwords-example.herokuapp.com/${this.audios![this.trueAnswerNumber]}`);
    this.audio.play();
  }

  switchLevel(event: MouseEvent) {
    const countAnswer = 5;
    this.lvlNumber = `${(event.target as HTMLElement).textContent}`;
    if (this.visibleSwitchLevel) {
      this.visibleSwitchLevel = false;
      this.visibleAudiocallGame = true;
      this.generaneAnswers(countAnswer);
    } else {
      this.visibleSwitchLevel = true;
    }
  }

  playAudio(): void {
    this.audio!.play();
  }

  receiveAnswer(answerNumber: string, event?: MouseEvent): void {
    let answerText: string | null;
    if (answerNumber) {
      answerText = ((this.answersContainer.nativeElement as Node).childNodes[+answerNumber!] as HTMLElement)
        .textContent;
    } else {
      answerText = (event!.target as HTMLElement).textContent;
    }
    if (answerText === this.wordsRu![this.trueAnswerNumber!]) {
      this.red = true;
      (
        (this.answersContainer.nativeElement as Node).childNodes[this.trueAnswerNumber!] as HTMLElement
      ).style.backgroundColor = 'green';
      this.showTrueAnswer();
      this.wordsWin[0].push(this.wordsEng![this.trueAnswerNumber!]);
      this.wordsWin[1].push(this.wordsRu![this.trueAnswerNumber!]);
      this.winsAudios.push(this.audios![this.trueAnswerNumber!]);
    } else {
      this.red = true;
      this.showTrueAnswer();
      (
        (this.answersContainer.nativeElement as Node).childNodes[this.trueAnswerNumber!] as HTMLElement
      ).style.backgroundColor = 'green';
      this.wordsLose[0].push(this.wordsEng![this.trueAnswerNumber!]);
      this.wordsLose[1].push(this.wordsRu![this.trueAnswerNumber!]);
      this.loseAudios.push(this.audios![this.trueAnswerNumber!]);
    }
  }

  showTrueAnswer(): void {
    this.nextOrKnow = 'Далее';
    this.trueAnswerImage = `url(https://react-learnwords-example.herokuapp.com/${
      this.imgs![this.trueAnswerNumber!]
    }) center`;
    this.answerText = `${this.wordsEng![this.trueAnswerNumber!]}`;
    this.visibleCardContainer = true;
  }

  showNextQuestion(): void {
    if (this.nextOrKnow === 'Не знаю') {
      if (this.raundCount === this.numberRaund) {
        this.showResult();
      }
      (
        (this.answersContainer.nativeElement as Node).childNodes[this.trueAnswerNumber!] as HTMLElement
      ).style.backgroundColor = 'green';
      this.wordsLose[0].push(this.wordsEng![this.trueAnswerNumber!]);
      this.wordsLose[1].push(this.wordsRu![this.trueAnswerNumber!]);
      this.loseAudios.push(this.audios![this.trueAnswerNumber!]);
      this.showTrueAnswer();
      this.nextOrKnow = 'Далее';
      this.red = false;
    } else {
      this.generaneAnswers(5);
      this.nextOrKnow = 'Не знаю';
      this.red = false;
    }
  }

  showResult() {
    this.visibleResult = true;
  }

  playAuidoInResult(event: MouseEvent) {
    const audioAttr: string | null = (event.target as HTMLElement).getAttribute('data-number');
    const winOrLose = audioAttr!.split(' ').slice(1, 2).join('');
    const audioNumber: number = Number(audioAttr!.slice(0, 1));
    if (winOrLose === 'win') {
      const audio = new Audio(`https://react-learnwords-example.herokuapp.com/${this.winsAudios![audioNumber]}`);
      audio.play();
    } else {
      const audio = new Audio(`https://react-learnwords-example.herokuapp.com/${this.loseAudios![audioNumber]}`);
      audio.play();
    }
  }

  resetResult(): void {
    this.numberRaund;
    this.visibleResult = false;
    this.visibleSwitchLevel = true;
    this.wordsWin = [[], []];
    this.wordsLose = [[], []];
    this.winsAudios = [];
  }
}
function randomNumberByInterval(min: number, max: number): number {
  const rand: number = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
