import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetPrevVisitedPage, SetRefreshToken, SetTextbookPage, SetToken, SetUserDate, SetUserId, SetUserSettings, SetUserStatistic, SetWordsLevel } from './store/rsl.action';
import RSLState from './store/rsl.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export default class AppComponent implements OnInit {
  @HostListener('window: unload', ['$event'])
  handleUnloadEvent(): void {
    window.localStorage.setItem('userId', this.store.selectSnapshot(RSLState.userId));
    window.localStorage.setItem('token', this.store.selectSnapshot(RSLState.token));
    window.localStorage.setItem('refreshToken', this.store.selectSnapshot(RSLState.refreshToken));
    window.localStorage.setItem('prevVisitedPage', this.store.selectSnapshot(RSLState.prevVisitedPage));
    window.localStorage.setItem('textbookPage', this.store.selectSnapshot(RSLState.textbookPage));
    window.localStorage.setItem('wordsLevel', this.store.selectSnapshot(RSLState.wordsLevel));
    window.localStorage.setItem('userSettings', this.store.selectSnapshot(RSLState.userSettings));
    window.localStorage.setItem('userStatistic', this.store.selectSnapshot(RSLState.userStatistic));
    window.localStorage.setItem('userData', this.store.selectSnapshot(RSLState.userData).toString());
  }

  constructor(private store: Store) {}

  ngOnInit() {
    const userId: string = window.localStorage.getItem('userId') ?? '';
    const token: string = window.localStorage.getItem('token') ?? '';
    const refreshToken: string = window.localStorage.getItem('refreshToken') ?? '';
    const prevVisitedPage: string = window.localStorage.getItem('prevVisitedPage') ?? '';
    const textbookPage: string = window.localStorage.getItem('textbookPage') ?? '0';
    const wordsLevel: string = window.localStorage.getItem('wordsLevel') ?? '0';
    const userSettings: string = window.localStorage.getItem('userSettings') ?? '';
    const userStatistic: string = window.localStorage.getItem('userStatistic') ?? '';
    const userData: string = window.localStorage.getItem('userData') ?? '0';
    window.localStorage.clear();
    this.store.dispatch(new SetUserId(userId));
    this.store.dispatch(new SetToken(token));
    this.store.dispatch(new SetRefreshToken(refreshToken));
    this.store.dispatch(new SetPrevVisitedPage(prevVisitedPage));
    this.store.dispatch(new SetTextbookPage(textbookPage));
    this.store.dispatch(new SetWordsLevel(wordsLevel));
    this.store.dispatch(new SetUserSettings(userSettings));
    this.store.dispatch(new SetUserStatistic(userStatistic));
    this.store.dispatch(new SetUserDate(+userData));
  }
}
