import { Component } from '@angular/core';
import { BASE_URL, SoundUrls } from 'src/app/constants/constants';

@Component({
  selector: 'app-sound',
  templateUrl: './sound.component.html',
  styleUrls: ['./sound.component.scss'],
})
class SoundComponent {
  audio: HTMLAudioElement = new Audio();

  playEndTour(isVolumeOff: boolean): void {
    if (!isVolumeOff) return;
    this.audio.src = SoundUrls.endGame;
    this.audio.play();
  }

  playAnswer(isCorrect: boolean, isVolumeOff: boolean): void {
    if (!isVolumeOff) return;
    this.audio.src = isCorrect ? SoundUrls.correctAnswer : SoundUrls.wrongAnswer;
    this.audio.play();
  }

  playSound(url: string, isVolumeOff: boolean): void {
    if (!isVolumeOff) return;
    this.audio.src = `${BASE_URL}${url}`;
    this.audio.currentTime = 0;
    this.audio.play();
  }
}

export default SoundComponent;
