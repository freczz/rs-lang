import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { INavLinks } from 'src/app/interfaces/interfaces';
import { SetRefreshToken, SetToken, SetUserId } from 'src/app/store/rsl.action';
import RSLState from 'src/app/store/rsl.state';

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
      url: '/',
      content: 'Статистика',
    },
  ];

  userId: string = JSON.parse(localStorage.getItem('userInfo') as string)?.userId || '';

  token: string = JSON.parse(localStorage.getItem('userInfo') as string)?.token || '';

  refreshToken: string = JSON.parse(localStorage.getItem('userInfo') as string)?.refreshToken || '';

  @Select(RSLState.userId) public userId$!: Observable<string>;

  @Select(RSLState.token) public token$!: Observable<string>;

  @Select(RSLState.refreshToken) public refreshToken$!: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new SetToken(this.token));
    this.token$.subscribe((token: string): void => {
      if (token) {
        this.isRegistered = true;
      }
    });
  }

  logoutAccount(): void {
    localStorage.removeItem('userInfo');
    this.store.dispatch(new SetUserId(''));
    this.store.dispatch(new SetToken(''));
    this.store.dispatch(new SetRefreshToken(''));
    this.isRegistered = false;
  }

  toggleMenu(): void {
    this.isActive = !this.isActive;
  }
}
