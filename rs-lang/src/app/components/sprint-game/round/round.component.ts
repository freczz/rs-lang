import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

import HttpService from '../service/http.service';
import { WordData, SprintStatistic } from '../../../interfaces/interfaces';
import {
  BASE_URL,
  DEFAULT_VALUE,
  PLAY_TIME,
  INDICATORS,
  PAGES_AMOUNT,
  WORDS_AMOUNT,
  PointsData,
  SoundUrls,
} from '../../../constants/constants';
import RSLState from '../../../store/rsl.state';
import { isRight, getRandomNumber, getSprintStatistic, setSprintStatistic } from '../../../utilities/utils';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss'],
})
class RoundComponent implements OnInit, OnDestroy {
  gameStatistic: SprintStatistic[];

  score: number = DEFAULT_VALUE;

  timer: number = PLAY_TIME;

  timerID: ReturnType<typeof setTimeout> | null = null;

  multiplier: number = 1;

  words: WordData[] = [];

  tour: number = DEFAULT_VALUE;

  word: string = '';

  transcript: string = '';

  page: number;

  correctWords: WordData[] = [];

  unCorrectWords: WordData[] = [];

  correctAnswerCount: number = DEFAULT_VALUE;

  isAnswerOption: boolean = isRight();

  isLoading: boolean = true;

  isFinish: boolean = false; // false

  isEndTour: boolean = false;

  isRight: boolean = false;

  isWrong: boolean = false;

  indicators: number[] = INDICATORS;

  audio: HTMLAudioElement = new Audio();

  @Input() wordsLevel: string = '0';

  @Input() isVolumeOn: boolean = true;

  @HostListener('document: keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.repeat) return;
    if (event.code === 'ArrowRight') {
      this.checkAnswer(true);
    } else if (event.code === 'ArrowLeft') {
      this.checkAnswer(false);
    }
  }

  @Select(RSLState.prevVisitedPage) public prevVisitedPage$!: Observable<string>;

  @Select(RSLState.textbookPage) public textbookPage$!: Observable<string>;

  //  eslint-disable-next-line @typescript-eslint/no-shadow
  constructor(private store: Store, router: Router, private HttpService: HttpService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.timerID) clearTimeout(this.timerID);
      }
    });
    this.page = +this.store.selectSnapshot(RSLState.textbookPage);
    this.gameStatistic = getSprintStatistic();
  }

  ngOnInit(): void {
    const prevVisitedPage: string = this.store.selectSnapshot(RSLState.prevVisitedPage);
    if (prevVisitedPage === 'textbook') {
      for (let i = this.page; i >= 0; i--) {
        this.HttpService.getWordsData(this.wordsLevel, i).subscribe((data): void => {
          const nextPage = data as WordData[];
          this.words = this.words.concat(nextPage);
          if (!i) {
            this.setRound();
            this.isLoading = false;
            this.setTimer();
          }
        });
      }
    } else {
      for (let i = 0; i < PAGES_AMOUNT; i++) {
        this.HttpService.getWordsData(this.wordsLevel, i).subscribe((data): void => {
          const nextPage = data as WordData[];
          this.words = this.words.concat(nextPage);
          if (this.words.length === WORDS_AMOUNT) {
            this.setRound();
            this.isLoading = false;
            this.setTimer();
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    setSprintStatistic(this.gameStatistic);
  }

  setTimer(): void {
    this.timerID = setTimeout((): void => {
      this.timer--;
      if (!this.timer) {
        this.isFinish = true;
        if (this.timerID) clearTimeout(this.timerID);
        this.playSignal(true);
      } else {
        this.setTimer();
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
      this.playSignal(true);
      this.score += PointsData.coefficient * this.multiplier;
      this.isRight = true;
      if (this.correctAnswerCount === PointsData.limitAnswers) {
        this.multiplier++;
        this.correctAnswerCount = 0;
      } else {
        this.correctAnswerCount++;
      }
      this.correctWords.push(this.words[this.tour]);
    } else {
      this.playSignal(false);
      this.unCorrectWords.push(this.words[this.tour]);
      this.isWrong = true;
      this.multiplier = 1;
      this.correctAnswerCount = 0;
    }
    this.saveResult(this.words[this.tour].word, isTrue === this.isAnswerOption);
    setTimeout((): void => {
      this.isRight = false;
      this.isWrong = false;
      this.tour++;
      if (this.tour === this.words.length) {
        this.isFinish = true;
        if (this.timerID) clearTimeout(this.timerID);
        this.playSignal(true);
        return;
      }
      this.isAnswerOption = isRight();
      this.setRound();
      this.isEndTour = false;
    }, 500);
  }

  playSignal(isCorrect: boolean): void {
    if (!this.isVolumeOn) return;
    if (this.isFinish) {
      this.audio.src = SoundUrls.endGame;
    } else {
      this.audio.src = isCorrect ? SoundUrls.correctAnswer : SoundUrls.wrongAnswer;
    }
    this.audio.play();
  }

  playSound(url: string): void {
    if (!this.isVolumeOn) return;
    this.audio.src = `${BASE_URL}${url}`;
    this.audio.currentTime = 0;
    this.audio.play();
  }

  playExample(): void {
    this.playSound(this.words[this.tour].audioExample);
  }

  playWord(): void {
    this.playSound(this.words[this.tour].audio);
  }

  replay(isClick: boolean): void {
    this.isFinish = isClick;
    this.resetGame();
  }

  resetGame(): void {
    this.score = DEFAULT_VALUE;
    this.timer = PLAY_TIME;
    this.multiplier = 1;
    this.tour = DEFAULT_VALUE;
    this.isAnswerOption = isRight();
    this.correctWords = [];
    this.unCorrectWords = [];
    this.correctAnswerCount = DEFAULT_VALUE;
    this.isRight = false;
    this.isWrong = false;
    this.setRound();
    this.setTimer();
  }

  saveResult(currentWord: string, isAnswer: boolean): void {
    if (this.gameStatistic.some((el: SprintStatistic): boolean => el.word === currentWord)) {
      this.gameStatistic.forEach((wordData: SprintStatistic): void => {
        const data: SprintStatistic = wordData;
        if (data.word === currentWord) {
          if (isAnswer) {
            data.correct++;
          } else {
            data.wrong--;
          }
        }
      });
    } else {
      const wordData: SprintStatistic = { word: currentWord, correct: 0, wrong: 0 };
      if (isAnswer) {
        wordData.correct++;
      } else {
        wordData.wrong--;
      }
      this.gameStatistic.push(wordData);
    }
  }
}

export default RoundComponent;
