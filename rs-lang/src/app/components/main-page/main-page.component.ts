import { Component } from '@angular/core';
import { team } from 'src/app/constants/constants';
import { ITeam } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export default class MainPageComponent {
  team: ITeam[] = team;
}
