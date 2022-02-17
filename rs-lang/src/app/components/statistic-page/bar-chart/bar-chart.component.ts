import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {}
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    // DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'> = {
    labels: [ '2006'],
    datasets: [
      {
        data: [ 7 ],
        label: 'Спринт',
        backgroundColor: ['#575a89'],
        hoverBackgroundColor: '#2f2e41',
      },
      {
        data: [ 10 ],
         label: 'Аудиовызов',
        backgroundColor: ['#fff'],
        hoverBackgroundColor: '#e6e6e6',
     }
    ],
  };

  // events
  // public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  //   console.log(event, active);
  // }

  // public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  //   console.log(event, active);
  // }

  ngOnInit(): void {
    this.setLabels()
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40 ];

    this.chart?.update();
  }

  setLabels() {
    let d = new Date();
    const date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric'})
    this.barChartData.labels = [date]
  }

}
