import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { serverLink } from '../../constants/constants';
import { IAudiocallGameComponent } from '../../interfaces/interfaces';
import { randomNumberByInterval } from '../../utilities/utils';

@Component({
  selector: 'app-audiocall-game',
  templateUrl: './audiocall-game.component.html',
  styleUrls: ['./audiocall-game.component.scss'],
})
export default class AudiocallGameComponent implements IAudiocallGameComponent {
  fullscreenBackground: string = 'url(../../assets/svg/fullscreen.svg) center / contain no-repeat';

  @ViewChild('audiocallContainer', { static: false }) audiocallContainer!: ElementRef;

  @ViewChild('levelNumber', { static: false }) levelNumber!: ElementRef;

  @ViewChild('answersContainer', { static: false }) answersContainer!: ElementRef;

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

  red = false;

  trueAnswerImage = '';

  answerText = '';

  winsAudios: string[] = [];

  wordsWin: string[][] = [[], []];

  wordsLose: string[][] = [[], []];

  imgsOfTrueAnswers: string[] | undefined;

  nextOrKnow: string = 'Не знаю';

  visibleResult = false;

  buttonDisabled = false;

  switchFullscreen(): void {
    if (!this.fullscreenBackground.match('exit')) {
      this.fullscreenBackground = 'url(../../assets/svg/exitfullscreen.svg) center / contain no-repeat';
      this.audiocallContainer!.nativeElement.requestFullscreen();
    } else {
      this.fullscreenBackground = 'url(../../assets/svg/fullscreen.svg) center / contain no-repeat';
      document.exitFullscreen();
    }
  }

  async generaneAnswers(countAnswer: number): Promise<void> {
    this.visibleCardContainer = false;
    this.wordsRu = [];
    this.audios = [];
    this.wordsEng = [];
    this.imgsOfTrueAnswers = [];
    this.numberRaund++;
    if (this.raundCount === this.numberRaund) {
      this.showResult();
    }
    for (let i = 0; i < countAnswer; i++) {
      const page: number = randomNumberByInterval(0, 29);
      const wordNumber: number = randomNumberByInterval(0, 19);
      const rawResponse = await fetch(`${serverLink}words?page=${page}&group=${this.lvlNumber}`, {
        method: 'GET',
      });
      const words = await rawResponse.json();
      this.imgsOfTrueAnswers.push(words[wordNumber].image);
      this.wordsEng.push(words[wordNumber].word);
      this.wordsRu.push(words[wordNumber].wordTranslate);
      this.audios.push(words[wordNumber].audio);
    }
    this.checkIdenticalAnswers();
    this.generateAudio();
  }

  generateAudio(): void {
    this.trueAnswerNumber = randomNumberByInterval(0, 4);
    this.audio = new Audio(`${serverLink}${this.audios![this.trueAnswerNumber]}`);
    this.audio.play();
  }

  switchLevel(event: MouseEvent): void {
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
    this.buttonDisabled = true;
    let answerText: string | null | undefined;
    if (answerNumber) {
      answerText = (
        (this.answersContainer.nativeElement as Node).childNodes[+answerNumber! - 1] as HTMLElement
      ).textContent?.slice(1);
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
    this.trueAnswerImage = `url(${serverLink}${this.imgsOfTrueAnswers![this.trueAnswerNumber!]}) center`;
    this.answerText = `${this.wordsEng![this.trueAnswerNumber!]}`;
    this.visibleCardContainer = true;
  }

  showNextQuestion(): void {
    this.buttonDisabled = false;
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

  showResult(): void {
    this.visibleResult = true;
  }

  playAuidoInResult(event: MouseEvent): void {
    const audioAttr: string | null = (event.target as HTMLElement).getAttribute('data-number');
    const winOrLose = audioAttr!.split(' ').slice(1, 2).join('');
    const audioNumber: number = Number(audioAttr!.slice(0, 1));
    if (winOrLose === 'win') {
      const audio = new Audio(`${serverLink}${this.winsAudios![audioNumber]}`);
      audio.play();
    } else {
      const audio = new Audio(`${serverLink}${this.loseAudios![audioNumber]}`);
      audio.play();
    }
  }

  resetResult(): void {
    this.numberRaund = 0;
    this.visibleResult = false;
    this.visibleSwitchLevel = true;
    this.wordsWin = [[], []];
    this.wordsLose = [[], []];
    this.winsAudios = [];
  }

  checkIdenticalAnswers(): void {
    const similars = this.wordsRu!.filter((el: string, i: number, arr: string[]) => arr.indexOf(el) !== i).map((el) => [
      el,
      el,
    ]);
    if (similars.length) {
      this.generaneAnswers(5);
    }
  }
}
