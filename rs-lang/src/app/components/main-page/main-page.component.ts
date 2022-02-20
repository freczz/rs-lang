import { Component } from '@angular/core';
import { HEIGHT_SCROLL, team } from 'src/app/constants/constants';
import { ITeam } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export default class MainPageComponent {
  team: ITeam[] = team;

  isVisibleArrow: boolean = false;

  trackScroll(): void {
    const scroll: number = window.pageYOffset;
    const coords: number = document.documentElement.clientHeight;

    if (scroll > coords) {
      this.isVisibleArrow = true;
    }
    if (scroll < coords) {
      this.isVisibleArrow = false;
    }
  }

  backToTop(): void {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, HEIGHT_SCROLL);
      setTimeout(() => {
        this.backToTop();
      }, 10);
    }
  }
}
