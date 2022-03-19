import { Component, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BubbleDataPoint, ChartConfiguration, ChartData, ChartDataset, ChartType, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IUserSettingsData, IUserStatisticData } from 'src/app/interfaces/interfaces';
import RSLState from 'src/app/store/rsl.state';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
class BarChartComponent implements OnInit {
  isBarChart: boolean = true;

  setting: IUserSettingsData;

  statistic: IUserStatisticData;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {},
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Новых слов',
        backgroundColor: ['#fff'],
        hoverBackgroundColor: '#e6e6e6',
      },
      {
        data: [],
        label: 'Изученые слова',
        backgroundColor: ['#9e3af3'],
        hoverBackgroundColor: '#772cb8',
      }
    ],
  };

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Новых слов',
        backgroundColor: 'rgba(255, 255, 255,0)',
        borderColor: 'rgba(255, 255, 255,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: 'rgba(255, 255, 255,1)',
        pointHoverBackgroundColor: 'rgba(255, 255, 255,1)',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Изученые слова',
        backgroundColor: 'rgba(119, 44, 184, 0)',
        borderColor: 'rgba(119, 44, 184, 0.9)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: 'rgba(255, 255, 255,1)',
        pointHoverBackgroundColor: 'rgba(255, 255, 255,1)',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  }

  constructor(private store: Store) {
    this.setting = JSON.parse(this.store.selectSnapshot(RSLState.userSettings));
    this.statistic = JSON.parse(this.store.selectSnapshot(RSLState.userStatistic));
  }

  ngOnInit(): void {
    const settingsValue: number[] = (JSON.parse(this.setting.optional.period)).map((data: string): number => +data.split('-')[0]);
    const statisticValue: number[] = (JSON.parse(this.statistic.optional.period)).map((data: string): number => +data.split('-')[0]);
    this.barChartData.datasets.forEach((el: ChartDataset<"bar", number[]>, i: number): void => {
      el.data = i ? [...statisticValue] : [...settingsValue];
    });
    this.lineChartData.datasets.forEach((el:ChartDataset<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[]>, i: number): void => {
      el.data = i ? [...statisticValue] : [...settingsValue];;
    });
    const periodSetting: string[] = JSON.parse(this.setting.optional.period);
    periodSetting.forEach((date: string): void => {
      this.barChartData.labels?.push(date.split('-')[1]);
      this.lineChartData.labels?.push(date.split('-')[1]);
    });
    this.createCurrentDate();
  }

  switchChart(): void {
    this.isBarChart = !this.isBarChart;
  }

  createCurrentDate(): void {
    const labelBar = this.barChartData.labels as string[];
    const currentDate: Date = new Date();
    const date: string = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (labelBar.length) {
      const lastDate: number = new Date(labelBar[labelBar.length - 1]).getDate();
      if (currentDate.getDate() - lastDate) {
        this.barChartData.labels?.push(date);
        this.lineChartData.labels?.push(date);
      }
    } else {
      this.barChartData.labels?.push(date);
      this.lineChartData.labels?.push(date);
    }
  }
}

export default BarChartComponent;
