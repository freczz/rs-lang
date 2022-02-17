import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event as NavigationEvent } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MILLISECOND, TokenTimeLimit } from 'src/app/constants/constants';
import { INavLinks, IUserData } from 'src/app/interfaces/interfaces';
import { SetRefreshToken, SetToken, SetUserDate, SetUserId } from 'src/app/store/rsl.action';
import RSLState from 'src/app/store/rsl.state';
import HttpService from '../sprint-game/service/http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export default class HeaderComponent implements OnInit {
  isRegistered: boolean = false;

  isActive: boolean = false;

  links: INavLinks[] = [
    {
      url: '/',
      content: 'Учебник',
    },
    {
      url: '/sprint',
      content: 'Спринт',
    },
    {
      url: '/audiocall',
      content: 'Аудиовызов',
    },
    {
      url: '/statistic',
      content: 'Статистика',
    },
  ];

  userId: string;

  token: string;

  refreshToken: string;

  @Select(RSLState.userId) public userId$!: Observable<string>;

  @Select(RSLState.token) public token$!: Observable<string>;

  @Select(RSLState.refreshToken) public refreshToken$!: Observable<string>;

  constructor(private store: Store, router: Router, private httpService: HttpService) {
    this.userId = store.selectSnapshot(RSLState.userId);
    this.token = store.selectSnapshot(RSLState.token);
    this.refreshToken = store.selectSnapshot(RSLState.refreshToken);
    router.events.subscribe((event: NavigationEvent): void => {
      if (event instanceof NavigationStart) {
        this.checkTokenValid();
      }
    });
  }

  ngOnInit(): void {
    this.token$.subscribe((token: string): void => {
      if (token) {
        this.isRegistered = true;
      }
    });
  }

  logoutAccount(): void {
    this.store.dispatch(new SetUserId(''));
    this.store.dispatch(new SetToken(''));
    this.store.dispatch(new SetRefreshToken(''));
    this.store.dispatch(new SetUserDate(0));
    this.isRegistered = false;
  }

  toggleMenu(): void {
    this.isActive = !this.isActive;
  }

  checkTokenValid(): void {
    const userDate: Date = new Date(this.store.selectSnapshot(RSLState.userData));
    const time: number = (Date.now() - +userDate) / MILLISECOND;
    if (time > TokenTimeLimit.end) {
      this.logoutAccount();
    } else if (time > TokenTimeLimit.refresh) {
      this.httpService.getNewToken().subscribe((data: IUserData) => {
        this.store.dispatch(new SetToken(data.token));
        this.store.dispatch(new SetRefreshToken(data.refreshToken));
        this.store.dispatch(new SetUserDate(+Date.now()));
      });
    }
  }
}
