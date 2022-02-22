import { Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { getAllWordsSpecials } from '../../utilities/server-requests';
import RSLState from '../../store/rsl.state';
import {
  COUNT_ANSWER,
  MAX_PAGE,
  MAX_WORD_NUMBER,
  SERVER_LINK,
  GAME_LEVELS,
  NextOrKnow,
  DEFAULT_VALUE,
} from '../../constants/constants';
import { IAudiocallGame, IGameResult, IWordSpecial, Words } from '../../interfaces/interfaces';
import randomNumberByInterval, { getWordsLearned, saveResult, setGamesStatistic } from '../../utilities/utils';

@Component({
  selector: 'app-audiocall-game',
  templateUrl: './audiocall-game.component.html',
  styleUrls: ['./audiocall-game.component.scss'],
})
export default class AudiocallGameComponent implements OnInit, IAudiocallGame {
  fullscreenBackground: string = 'url(../../../assets/svg/fullscreen.svg) center / contain no-repeat';

  @ViewChild('audiocallContainer', { static: false })
  audiocallContainer: ElementRef = { nativeElement: '' };

  @ViewChild('levelNumber', { static: false })
  levelNumber: ElementRef = { nativeElement: '' };

  @ViewChild('answersContainer', { static: false })
  answersContainer: ElementRef = { nativeElement: '' };

  learnedWords: string[] = [];

  isNext: boolean = true;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const { key } = event;
    switch (key) {
      case 'Enter':
        this.playAudio();
        break;
      case ' ':
        if (this.isNext) {
          this.showNextQuestion();
          this.isNext = false;
          setTimeout(() => {
            this.isNext = true;
          }, 1000);
        }
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        this.receiveAnswer(key);
        break;
      default:
        break;
    }
  }

  prevVisitedPage: string = '';

  page: string = '';

  numberRound: number = 0;

  roundCount: number = 11;

  trueAnswerCount: number = 0;

  loseAudios: string[] = [];

  wordsRu: string[] = [];

  wordsEng: string[] = [];

  audios: string[] = [];

  visibleSwitchLevel: boolean = true;

  visibleAudiocallGame: boolean = false;

  visibleCardContainer: boolean = false;

  lvlNumber: string = '';

  audio!: HTMLAudioElement;

  trueAnswerNumber!: number;

  red: boolean = false;

  trueAnswerImage: string = '';

  answerText: string = '';

  winsAudios: string[] = [];

  wordsWin: string[][] = [[], []];

  wordsLose: string[][] = [[], []];

  imgsOfTrueAnswers: string[] = [];

  nextOrKnow: string = '';

  visibleResult: boolean = false;

  buttonDisabled: boolean = false;

  levels: string[] = GAME_LEVELS;

  wordIds: string[] = [];

  curWordId: string = '';

  gameStatistic: IGameResult = { words: [], longLine: 0, bestLine: 0 };

  isRegistered: boolean;

  checkedStatus: boolean = false;

  heartCount: string[] = new Array(this.roundCount);

  visibleHeart: boolean = false;

  changeStatus: boolean = true;

  generateWordsStatus: boolean = false;

  @Select(RSLState.prevVisitedPage) public prevVisitedPage$!: Observable<string>;

  constructor(private store: Store, private router: Router) {
    this.isRegistered = !!this.store.selectSnapshot(RSLState.userId);
  }

  async ngOnInit(): Promise<void> {
    this.prevVisitedPage = this.store.selectSnapshot(RSLState.prevVisitedPage);
    if (this.prevVisitedPage === 'textbook') {
      this.visibleSwitchLevel = false;
      this.lvlNumber = this.store.selectSnapshot(RSLState.wordsLevel);
      this.page = this.store.selectSnapshot(RSLState.textbookPage);
      this.roundCount = 20;
      this.heartCount = new Array(this.roundCount);
      if (this.isRegistered) {
        this.learnedWords = await this.getSpecialsWords();
        if (this.learnedWords.length <= 3 && this.page !== '0') {
          this.page = String(Number(this.page) - 1);
        }
      }
      this.generateAnswers();
      this.visibleAudiocallGame = true;
    }
  }

  async getSpecialsWords(): Promise<string[]> {
    const special: IWordSpecial[] = await getAllWordsSpecials(this.store);
    return getWordsLearned(special);
  }

  setCheckboxStatus(e: MouseEvent): void {
    this.checkedStatus = (e.target as HTMLInputElement).checked;
    if (this.checkedStatus) {
      this.heartCount = new Array(4);
      this.visibleHeart = true;
    } else {
      this.heartCount = new Array(this.roundCount);
      this.visibleHeart = false;
    }
  }

  switchFullscreen(): void {
    if (this.fullscreenBackground.match('exit')) {
      this.fullscreenBackground = 'url(../../../assets/svg/fullscreen.svg) center / contain no-repeat';
      document.exitFullscreen();
    } else {
      this.fullscreenBackground = 'url(../../../assets/svg/exitfullscreen.svg) center / contain no-repeat';
      this.audiocallContainer.nativeElement.requestFullscreen();
    }
  }

  async generateAnswers(): Promise<void> {
    this.isNext = true;
    this.nextOrKnow = NextOrKnow.know;
    this.visibleCardContainer = false;
    this.wordsRu = [];
    this.audios = [];
    this.wordsEng = [];
    this.imgsOfTrueAnswers = [];
    const promises = [];
    if (this.page === '') {
      for (let i = 0; i < COUNT_ANSWER; i++) {
        promises.push(this.getWords());
      }
      const words: Words[] = await Promise.all(promises);
      for (let i = 0; i < COUNT_ANSWER; i++) {
        const wordNumber: number = randomNumberByInterval(DEFAULT_VALUE, MAX_WORD_NUMBER);
        this.imgsOfTrueAnswers.push(words[i][wordNumber].image);
        this.wordsEng.push(words[i][wordNumber].word);
        this.wordsRu.push(words[i][wordNumber].wordTranslate);
        this.audios.push(words[i][wordNumber].audio);
        this.wordIds.push(words[i][wordNumber].id);
      }
      this.trueAnswerNumber = randomNumberByInterval(DEFAULT_VALUE, 4);
      this.curWordId = this.wordIds[this.trueAnswerNumber];
    } else {
      promises.push(this.getWords());
      const words: Words[] = await Promise.all(promises);
      for (let i = 0; i < COUNT_ANSWER; i++) {
        const wordNumber: number = randomNumberByInterval(DEFAULT_VALUE, MAX_WORD_NUMBER);
        this.imgsOfTrueAnswers.push(words[0][wordNumber].image);
        this.wordsEng.push(words[0][wordNumber].word);
        this.wordsRu.push(words[0][wordNumber].wordTranslate);
        this.audios.push(words[0][wordNumber].audio);
        this.wordIds.push(words[0][wordNumber].id);
      }
      this.setTrueAnswerFromTextbook(words);
    }
    this.numberRound++;
    if (this.roundCount === this.numberRound || this.heartCount.length === DEFAULT_VALUE) {
      this.showResult();
      return;
    }
    this.checkIdenticalAnswers();
    this.generateAudio();
  }

  setTrueAnswerFromTextbook(words: Words[]): void {
    this.trueAnswerNumber = randomNumberByInterval(DEFAULT_VALUE, 4);
    if (this.learnedWords.includes(words[0][this.numberRound].id)) {
      this.numberRound++;
    }
    this.imgsOfTrueAnswers[this.trueAnswerNumber] = words[0][this.numberRound].image;
    this.wordsEng[this.trueAnswerNumber] = words[0][this.numberRound].word;
    this.wordsRu[this.trueAnswerNumber] = words[0][this.numberRound].wordTranslate;
    this.audios[this.trueAnswerNumber] = words[0][this.numberRound].audio;
    this.curWordId = this.wordIds[this.trueAnswerNumber];
  }

  generateAudio(): void {
    this.audio = new Audio(`${SERVER_LINK}${this.audios[this.trueAnswerNumber]}`);
    this.audio.play();
  }

  async getWords(): Promise<Words> {
    if (this.page === '') {
      const page: number = randomNumberByInterval(DEFAULT_VALUE, MAX_PAGE);
      return fetch(`${SERVER_LINK}words?page=${page}&group=${this.lvlNumber}`)
        .then((response: Response) => response.json())
        .then((data: Words) => data);
    }
    return fetch(`${SERVER_LINK}words?page=${this.page}&group=${this.lvlNumber}`)
      .then((response: Response) => response.json())
      .then((data: Words) => data);
  }

  switchLevel(event: MouseEvent): void {
    this.lvlNumber = `${(event.target as HTMLElement).textContent}`;
    if (this.visibleSwitchLevel) {
      this.visibleSwitchLevel = false;
      this.visibleAudiocallGame = true;
      this.generateAnswers();
    } else {
      this.visibleSwitchLevel = true;
    }
  }

  playAudio(): void {
    this.audio.play();
  }

  receiveAnswer(answerNumber: string, event?: MouseEvent): void {
    this.buttonDisabled = true;
    let answerText: string;
    if (!this.changeStatus) {
      return;
    }
    if (answerNumber) {
      answerText = (
        (this.answersContainer.nativeElement as Node).childNodes[+answerNumber - 1] as HTMLElement
      ).textContent?.slice(1)!;
    } else {
      answerText = (event!.target as HTMLElement).textContent!;
    }
    if (answerText === this.wordsRu[this.trueAnswerNumber]) {
      this.red = true;
      (
        (this.answersContainer.nativeElement as Node).childNodes[this.trueAnswerNumber] as HTMLElement
      ).style.backgroundColor = 'green';
      this.showTrueAnswer();
      this.wordsWin[0].push(this.wordsEng[this.trueAnswerNumber]);
      this.wordsWin[1].push(this.wordsRu[this.trueAnswerNumber]);
      this.winsAudios.push(this.audios[this.trueAnswerNumber]);
    } else {
      this.red = true;
      this.showTrueAnswer();
      (
        (this.answersContainer.nativeElement as Node).childNodes[this.trueAnswerNumber!] as HTMLElement
      ).style.backgroundColor = 'green';
      this.wordsLose[0].push(this.wordsEng[this.trueAnswerNumber]);
      this.wordsLose[1].push(this.wordsRu[this.trueAnswerNumber]);
      this.loseAudios.push(this.audios[this.trueAnswerNumber]);
      this.heartCount.splice(DEFAULT_VALUE, 1);
    }
    saveResult(this.gameStatistic, this.curWordId, answerText === this.wordsRu[this.trueAnswerNumber]);
    this.changeStatus = false;
  }

  showTrueAnswer(): void {
    this.nextOrKnow = NextOrKnow.next;
    this.trueAnswerImage = `url(${SERVER_LINK}${this.imgsOfTrueAnswers[this.trueAnswerNumber]}) center`;
    this.answerText = `${this.wordsEng![this.trueAnswerNumber]}`;
    this.visibleCardContainer = true;
  }

  showNextQuestion(): void {
    this.buttonDisabled = false;
    if (this.nextOrKnow === 'Не знаю') {
      this.isNext = true;
      this.heartCount.splice(DEFAULT_VALUE, 1);
      saveResult(this.gameStatistic, this.curWordId, false);
      if (this.roundCount === this.numberRound) {
        this.showResult();
      }
      (
        (this.answersContainer.nativeElement as Node).childNodes[this.trueAnswerNumber] as HTMLElement
      ).style.backgroundColor = 'green';
      this.wordsLose[0].push(this.wordsEng[this.trueAnswerNumber]);
      this.wordsLose[1].push(this.wordsRu[this.trueAnswerNumber]);
      this.loseAudios.push(this.audios[this.trueAnswerNumber]);
      this.showTrueAnswer();
      this.nextOrKnow = NextOrKnow.next;
      this.red = false;
    } else {
      this.isNext = true;
      this.generateAnswers();
      this.changeStatus = true;
      this.nextOrKnow = 'Не знаю';
      this.red = false;
    }
  }

  showResult(): void {
    this.isNext = false;
    this.visibleResult = true;
    this.visibleAudiocallGame = false;
    this.visibleHeart = false;
    this.heartCount = new Array(this.roundCount);
    if (this.isRegistered) {
      setGamesStatistic(this.gameStatistic, 'audio', this.store);
    }
  }

  playAuidoInResult(event: MouseEvent): void {
    const audioAttr: string | null = (event.target as HTMLElement).getAttribute('data-number');
    const winOrLose: string = audioAttr!.split(' ').slice(1, 2).join('');
    const audioNumber: number = Number(audioAttr!.slice(0, 1));
    if (winOrLose === 'win') {
      const audio: HTMLAudioElement = new Audio(`${SERVER_LINK}${this.winsAudios[audioNumber]}`);
      audio.play();
    } else {
      const audio: HTMLAudioElement = new Audio(`${SERVER_LINK}${this.loseAudios[audioNumber]}`);
      audio.play();
    }
  }

  resetResult(): void {
    this.numberRound = 0;
    this.visibleAudiocallGame = false;
    this.visibleResult = false;
    this.visibleSwitchLevel = true;
    this.wordsWin = [[], []];
    this.wordsLose = [[], []];
    this.winsAudios = [];
    this.wordIds = [];
  }

  checkIdenticalAnswers(): void {
    const similars: string[][] = this.wordsRu!.filter(
      (el: string, i: number, arr: string[]) => arr.indexOf(el) !== i
    ).map((el) => [el, el]);
    if (similars.length) {
      this.numberRound--;
      this.generateAnswers();
    }
  }

  goToMainPage(): void {
    this.router.navigate(['']);
  }
}
