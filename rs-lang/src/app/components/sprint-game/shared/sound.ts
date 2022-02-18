import { BASE_URL, SoundUrls } from 'src/app/constants/constants';

class Sound {
  audio: HTMLAudioElement = new Audio();

  playEndTour(isVolumeOff: boolean): void {
    if (isVolumeOff) {
      this.audio.src = SoundUrls.endGame;
      this.audio.play();
    }
  }

  playAnswer(isCorrect: boolean, isVolumeOff: boolean): void {
    if (isVolumeOff) {
      this.audio.src = isCorrect ? SoundUrls.correctAnswer : SoundUrls.wrongAnswer;
      this.audio.play();
    }
  }

  playSound(url: string, isVolumeOff: boolean): void {
    if (isVolumeOff) {
      this.audio.src = `${BASE_URL}${url}`;
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }
}

export default Sound;
