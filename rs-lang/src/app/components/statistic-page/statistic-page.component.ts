import { Component, OnInit } from '@angular/core';
import { IGameStatistic } from 'src/app/interfaces/interfaces';
import {GAME_STATISTIC} from '../../constants/constants';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.scss']
})
export class StatisticPageComponent implements OnInit {

  sprintStatistics: IGameStatistic[];

  audioStatistic: IGameStatistic[];

  constructor() {
    this.sprintStatistics = GAME_STATISTIC.map((elem: IGameStatistic) => {
      return {...elem}
    });
    this.audioStatistic = GAME_STATISTIC.map((elem:IGameStatistic) => {
      return {...elem}
    });
  }

  ngOnInit(): void {
  }
}
