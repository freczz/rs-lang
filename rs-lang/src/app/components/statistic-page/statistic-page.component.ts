import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { IGameStatistic, IUserSettingsData, IUserStatisticData, IWordSpecial } from 'src/app/interfaces/interfaces';
import { SetUserStatistic } from 'src/app/store/rsl.action';
import RSLState from 'src/app/store/rsl.state';
import { getAllWordsSpecials } from 'src/app/utilities/server-requests';
import { getWordsLearned } from 'src/app/utilities/utils';
import { GAME_STATISTIC } from '../../constants/constants';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.scss']
})
class StatisticPageComponent implements OnInit {
  wordPerDay: number = 0;

  wordsLearned: number = 0;

  percentAnswers: number = 0;

  isRegistered: boolean;

  sprintStatistics: IGameStatistic[] = [];

  audioStatistic: IGameStatistic[] = [];

  constructor(private store: Store) {
    this.isRegistered = !!this.store.selectSnapshot(RSLState.userId);
  }

  async ngOnInit(): Promise<void> {
    if (this.isRegistered) {
      const setting: IUserSettingsData = JSON.parse(this.store.selectSnapshot(RSLState.userSettings));
      const statistic: IUserStatisticData = JSON.parse(this.store.selectSnapshot(RSLState.userStatistic));
      await this.getAllWordsLearned(statistic);
      this.store.dispatch(new SetUserStatistic(JSON.stringify(statistic)));
      this.wordPerDay = setting.wordsPerDay;
      this.wordsLearned = statistic.learnedWords;
      const sprintData: string[] = setting.optional.sprint.split('-');
      const audioData: string[] = setting.optional.audio.split('-');
      this.setPercentState(sprintData, audioData);
      this.sprintStatistics = [...GAME_STATISTIC].map((elem: IGameStatistic, i: number) => {
        const resultElem = { ...elem };
        resultElem.value = sprintData[i];
        return resultElem;
      });
      this.audioStatistic = [...GAME_STATISTIC].map((elem: IGameStatistic, i: number) => {
        const resultElem = { ...elem };
        resultElem.value = audioData[i];
        return resultElem;
      });
    }
  }

  async getAllWordsLearned(statistic: IUserStatisticData) {
    const statisticData: IUserStatisticData = statistic;
    const specialWords: IWordSpecial[] = await getAllWordsSpecials(this.store);
    const wordsLearned: string[] = getWordsLearned(specialWords);
    const period: string[] = JSON.parse(statisticData.optional.period);
    if (period.length) {
      const lastLearnedW: number = period
        .map((el: string): number => +el.split('-')[0])
        .reduce((acc: number, cur: number, i: number): number => {
          return (i !== (period.length - 1)) ? acc + cur : acc;
        }, 0);
      if (wordsLearned.length !== (+lastLearnedW + statisticData.learnedWords)) {
        statisticData.learnedWords = wordsLearned.length - +lastLearnedW;
      }
      period[period.length - 1] = `${statisticData.learnedWords.toString()}-${period[period.length - 1].split('-')[1]}`;
      statisticData.optional.period = JSON.stringify(period);
    } else {
      statisticData.learnedWords = wordsLearned.length > statisticData.learnedWords ? wordsLearned.length : statisticData.learnedWords;
    }

  }

  setPercentState(sprintData: string[], audioData: string[]): void {
    if (sprintData[2] === '0') {
      this.percentAnswers = +audioData[1];
    } else if (audioData[2] === '0') {
      this.percentAnswers = +sprintData[1];
    } else {
      this.percentAnswers = +((+sprintData[1] + +audioData[1]) / 2).toFixed();
    }
  }
}

export default StatisticPageComponent;
