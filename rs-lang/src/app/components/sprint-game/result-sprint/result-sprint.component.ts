import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IWordData } from '../../../interfaces/interfaces';
import { BASE_URL, DEFAULT_VALUE } from '../../../constants/constants';

@Component({
  selector: 'app-result-sprint',
  templateUrl: './result-sprint.component.html',
  styleUrls: ['./result-sprint.component.scss'],
})
class ResultSprintComponent implements OnInit {
  @Input() correctWords: IWordData[] = [];

  @Input() wrongWords: IWordData[] = [];

  @Output() replay = new EventEmitter<boolean>();

  mistakesAmount: number = DEFAULT_VALUE;

  correctAnswersAmount: number = DEFAULT_VALUE;

  audio: HTMLAudioElement = new Audio();

  message: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.mistakesAmount = this.wrongWords.length;
    this.correctAnswersAmount = this.correctWords.length;
    this.setMessage();
  }

  playSound(url: string): void {
    this.audio.src = `${BASE_URL}${url}`;
    this.audio.currentTime = 0;
    this.audio.play();
  }

  playAgain(increased: boolean): void {
    this.replay.emit(increased);
  }

  goToMainPage(): void {
    this.router.navigate(['']);
  }

  setMessage(): void {
    const resultAnswers: number = (this.correctAnswersAmount / (this.correctAnswersAmount + this.mistakesAmount));
    if (resultAnswers === 1) {
      this.message = 'Отлично!';
    } else if (resultAnswers > 0.7) {
      this.message = 'Хороший результат!';
    } else if (resultAnswers > 0.4) {
      this.message = 'Хорошо, но ты можешь лучше!';
    } else {
      this.message = 'Как есть!';
    }
  }
}

export default ResultSprintComponent;
