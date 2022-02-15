import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { INavLinks } from 'src/app/interfaces/interfaces';
import { SetToken } from 'src/app/store/rsl.action';
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
      url: '/a',
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
      url: '/d',
      content: 'Статистика',
    },
  ];

  token: string = JSON.parse(localStorage.getItem('userInfo') as string)?.token || '';

  @Select(RSLState.token) public token$!: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new SetToken(this.token));
    this.token$.subscribe((token: any): any => {
      if (token) {
        this.isRegistered = true;
      }
    });
  }

  logoutAccount(): void {
    localStorage.removeItem('userInfo');
    this.isRegistered = false;
  }

  toggleMenu(): void {
    this.isActive = !this.isActive;
  }
}
