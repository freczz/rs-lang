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

  mistakes: number = DEFAULT_VALUE;

  truths: number = DEFAULT_VALUE;

  audio: HTMLAudioElement = new Audio();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.mistakes = this.wrongWords.length;
    this.truths = this.correctWords.length;
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
}

export default ResultSprintComponent;
