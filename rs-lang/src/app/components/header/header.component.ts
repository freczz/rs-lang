import { Component } from '@angular/core';
import { INavLinks } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export default class HeaderComponent {
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

  toggleMenu(): void {
    this.isActive = !this.isActive;
  }
}
