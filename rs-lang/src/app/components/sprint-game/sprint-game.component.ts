import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { LevelGame } from '../../interfaces/interfaces';

@Component({
  selector: 'app-sprint-game',
  templateUrl: './sprint-game.component.html',
  styleUrls: ['./sprint-game.component.scss'],
})
class SprintGameComponent {
  condition: boolean = false;

  isVolume: boolean = true;

  level: string = '';

  @ViewChild('fullscreen', { static: false })
  fullscreen: ElementRef | undefined;

  @ViewChild('volume', { static: false })
  volumeIcon: ElementRef | undefined;

  @ViewChild('sprint', { static: false })
  sprintElement: ElementRef | undefined;

  @HostListener('document: fullscreenchange', ['$event'])
  fullScreen(): void {
    if (this.fullscreen) {
      this.fullscreen.nativeElement.lastChild.classList.toggle('active-full');
    }
  }

  checkLevel(gameData: LevelGame): void {
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
