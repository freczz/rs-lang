import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngxs/store';
import RSLState from 'src/app/store/rsl.state';
import { ILevelGame } from '../../interfaces/interfaces';

@Component({
  selector: 'app-sprint-game',
  templateUrl: './sprint-game.component.html',
  styleUrls: ['./sprint-game.component.scss'],
})
class SprintGameComponent {
  condition: boolean = false;

  isVolume: boolean = true;

  level: string = '';

  previousPath: string = '';

  @ViewChild('fullscreen')
  fullscreen: ElementRef = { nativeElement: '' };

  @ViewChild('volume')
  volumeIcon: ElementRef = { nativeElement: '' };

  @ViewChild('sprint')
  sprintElement: ElementRef = { nativeElement: '' };

  @HostListener('document: fullscreenchange', ['$event'])
  fullScreen(): void {
    if (this.fullscreen) {
      this.fullscreen.nativeElement.lastChild.classList.toggle('active-full');
    }
  }

  constructor(private store: Store) {
    this.previousPath = this.store.selectSnapshot(RSLState.prevVisitedPage);
  }

  setGameLevel(gameData: ILevelGame): void {
    this.condition = gameData.isStart;
    this.level = gameData.level;
  }

  switchVolume(): void {
    if (this.volumeIcon) {
      this.volumeIcon.nativeElement.lastChild.classList.toggle('active-volume');
    }
    this.isVolume = !this.isVolume;
  }

  switchFullscreen(): void {
    if (this.sprintElement) {
      if (!document.fullscreenElement) {
        this.sprintElement.nativeElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

export default SprintGameComponent;
