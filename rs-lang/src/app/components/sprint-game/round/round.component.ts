import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavigationStart, Router, Event as NavigationEvent } from '@angular/router';

import HttpService from '../service/http.service';
import RSLState from '../../../store/rsl.state';
import Sound from '../shared/sound';
import { IWordData, IGameResult, ISprint, IWordSpecial } from '../../../interfaces/interfaces';
import {
  DEFAULT_VALUE,
  PLAY_TIME,
  INDICATORS,
  PAGES_AMOUNT,
  WORDS_AMOUNT,
  PointsData,
} from '../../../constants/constants';
import { isRight, getRandomNumber, saveResult, getWordsLearned, setGamesStatistic } from '../../../utilities/utils';
import { getAllWordsSpecials } from '../../../utilities/server-requests';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss'],
})
class RoundComponent implements OnInit, ISprint {
  gameStatistic: IGameResult = { words: [], longLine: 0, bestLine: 0 };

  isRegistered: boolean;

  score: number = DEFAULT_VALUE;

  timer: number = PLAY_TIME;

  timerID: ReturnType<typeof setTimeout> | null = null;

  multiplier: number = 1;

  words: IWordData[] = [];

  tour: number = DEFAULT_VALUE;

  word: string = '';

  transcript: string = '';

  page: number;

  correctWords: IWordData[] = [];

  unCorrectWords: IWordData[] = [];

  correctAnswerCount: number = DEFAULT_VALUE;

  isAnswerOption: boolean = isRight();

  isLoading: boolean = true;

  isFinish: boolean = false;

  isEndTour: boolean = false;

  isCorrect: boolean = false;

  isWrong: boolean = false;

  indicators: number[] = INDICATORS;

  sound: Sound = new Sound();

  @Input() wordsLevel: string = '0';

  @Input() isVolumeOn: boolean = true;

  @Select(RSLState.prevVisitedPage) public prevVisitedPage$!: Observable<string>;

  @Select(RSLState.textbookPage) public textbookPage$!: Observable<string>;

  @HostListener('document: keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.repeat) return;
    if (event.code === 'ArrowRight') {
      this.checkAnswer(true);
    } else if (event.code === 'ArrowLeft') {
      this.checkAnswer(false);
    }
  }

  constructor(private store: Store, router: Router, private httpService: HttpService) {
    router.events.subscribe((event: NavigationEvent): void => {
      if (event instanceof NavigationStart && this.timerID) {
        clearTimeout(this.timerID);
      }
    });
    this.page = +this.store.selectSnapshot(RSLState.textbookPage);
    this.isRegistered = !!this.store.selectSnapshot(RSLState.userId);
  }

  async ngOnInit(): Promise<void> {
    const prevVisitedPage: string = this.store.selectSnapshot(RSLState.prevVisitedPage);
    if (prevVisitedPage === 'textbook') {
      this.wordsLevel = this.store.selectSnapshot(RSLState.wordsLevel);
      const learnedWords: string[] = await this.getSpecialWords();
      for (let i = this.page; i >= 0; i--) {
        this.httpService.getWordsData(this.wordsLevel, i).subscribe((data: IWordData[]): void => {
          const nextPage: IWordData[] = data;
          this.words = this.words.concat(nextPage);
          this.words = this.words.filter((word: IWordData): boolean => !learnedWords.includes(word.id));
          if (!i) {
            this.startGame();
          }
        });
      }
    } else {
      for (let i = 0; i < PAGES_AMOUNT; i++) {
        this.httpService.getWordsData(this.wordsLevel, i).subscribe((data: IWordData[]): void => {
          const nextPage: IWordData[] = data;
          this.words = this.words.concat(nextPage);
          if (this.words.length === WORDS_AMOUNT) {
            this.startGame();
          }
        });
      }
    }
  }

  async getSpecialWords(): Promise<string[]> {
    if (this.isRegistered) {
      const special: IWordSpecial[] = await getAllWordsSpecials(this.store);
      return getWordsLearned(special);
    }
    return [];
  }

  startGame(): void {
    this.setRound();
    this.isLoading = false;
    this.setTimer();
  }

  setTimer(): void {
    this.timerID = setTimeout((): void => {
      this.timer--;
      if (this.timer) {
        this.setTimer();
      } else {
        this.finishTour();
      }
    }, 1000);
  }

  setRound(): void {
    this.word = this.words[this.tour].word;
    if (this.isAnswerOption) {
      this.transcript = this.words[this.tour].wordTranslate;
    } else {
      let randomNumber: number = getRandomNumber(this.words.length);
      while (this.tour === randomNumber) {
        randomNumber = getRandomNumber(this.words.length);
      }
      this.transcript = this.words[randomNumber].wordTranslate;
    }
  }

  checkAnswer(isTrue: boolean): void {
    if (this.isFinish || this.isEndTour) return;
    this.isEndTour = true;
    if (isTrue === this.isAnswerOption) {
      this.sound.playAnswer(true, this.isVolumeOn);
      this.score += PointsData.coefficient * this.multiplier;
      this.isCorrect = true;
      this.checkAnswerLimit();
      this.correctWords.push(this.words[this.tour]);
    } else {
      this.sound.playAnswer(false, this.isVolumeOn);
      this.isWrong = true;
      this.unCorrectWords.push(this.words[this.tour]);
      this.resetAnswerLimit();
    }
    saveResult(this.gameStatistic, this.words[this.tour].id, isTrue === this.isAnswerOption);
    setTimeout((): void => {
      this.updateParameters();
      this.setRound();
      this.isEndTour = false;
    }, 500);
  }

  checkAnswerLimit(): void {
    if (this.correctAnswerCount === PointsData.limitAnswers) {
      this.multiplier++;
      this.correctAnswerCount = 0;
    } else {
      this.correctAnswerCount++;
    }
  }

  resetAnswerLimit(): void {
    this.multiplier = 1;
    this.correctAnswerCount = 0;
  }

  updateParameters(): void {
    this.isCorrect = false;
    this.isWrong = false;
    this.tour++;
    if (this.tour === this.words.length) {
      this.finishTour();
      return;
    }
    this.isAnswerOption = isRight();
  }

  playExample(): void {
    this.sound.playSound(this.words[this.tour].audioExample, this.isVolumeOn);
  }

  playWord(): void {
    this.sound.playSound(this.words[this.tour].audio, this.isVolumeOn);
  }

  replay(isClick: boolean): void {
    this.isFinish = isClick;
    this.resetGame();
  }

  finishTour(): void {
    this.isFinish = true;
    if (this.timerID) clearTimeout(this.timerID);
    this.sound.playEndTour(this.isVolumeOn);
    if (this.isRegistered) {
      setGamesStatistic(this.gameStatistic, 'sprint', this.store);
    }
  }

  resetGame(): void {
    this.score = DEFAULT_VALUE;
    this.timer = PLAY_TIME;
    this.multiplier = 1;
    this.isAnswerOption = isRight();
    this.correctWords = [];
    this.unCorrectWords = [];
    this.correctAnswerCount = DEFAULT_VALUE;
    this.isCorrect = false;
    this.isWrong = false;
    this.setRound();
    this.setTimer();
  }
}

export default RoundComponent;
