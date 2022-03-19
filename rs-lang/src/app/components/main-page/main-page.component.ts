import { Component, OnInit } from '@angular/core';
import { HEIGHT_SCROLL, team } from 'src/app/constants/constants';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ITeam } from 'src/app/interfaces/interfaces';
import { SetPrevVisitedPage } from 'src/app/store/rsl.action';
import RSLState from 'src/app/store/rsl.state';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export default class MainPageComponent implements OnInit {
  team: ITeam[] = team;

  isVisibleArrow: boolean = false;

  @Select(RSLState.refreshToken) public refreshToken$!: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new SetPrevVisitedPage(''));
  }

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
