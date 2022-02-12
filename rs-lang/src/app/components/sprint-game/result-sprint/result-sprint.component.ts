import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { WordData } from '../../../interfaces/interfaces';
import { BASE_URL, DEFAULT_VALUE } from '../../../constants/constants';

@Component({
  selector: 'app-result-sprint',
  templateUrl: './result-sprint.component.html',
  styleUrls: ['./result-sprint.component.scss'],
})
class ResultSprintComponent implements OnInit {
  @Input() correctWords: WordData[] = [];

  @Input() wrongWords: WordData[] = [];

  @Output() replay = new EventEmitter<boolean>();

  playAgain(increased: boolean): void {
    this.replay.emit(increased);
  }

  mistake: number = DEFAULT_VALUE;

  knows: number = DEFAULT_VALUE;

  audio: HTMLAudioElement = new Audio();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.mistake = this.wrongWords.length;
    this.knows = this.correctWords.length;
  }

  playSound(url: string): void {
    this.audio.src = `${BASE_URL}${url}`;
    this.audio.currentTime = 0;
    this.audio.play();
  }

  moveMainPage(): void {
    this.router.navigate(['']);
  }
}

export default ResultSprintComponent;
