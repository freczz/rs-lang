import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { IState } from './rsl.interface';
import { SetPrevVisitedPage, SetToken, SetTextbookPage, SetUserId, SetRefreshToken, SetWordsLevel, SetUserSettings, SetUserStatistic, SetUserDate } from './rsl.action';
import { USER_SETTINGS, USER_STATISTIC } from '../constants/constants';

const initialState: IState = {
  userId: '',
  token: '',
  refreshToken: '',
  prevVisitedPage: '',
  textbookPage: '0',
  wordsLevel: '0',
  userSettings : JSON.stringify(USER_SETTINGS),
  userStatistic: JSON.stringify(USER_STATISTIC),
  userData: 0,
};

@State<IState>({
  name: 'RSLState',
  defaults: initialState,
})
@Injectable()
class RSLState {
  @Action(SetPrevVisitedPage)
  setPrevVisitedPage({ patchState }: StateContext<IState>, action: SetPrevVisitedPage) {
    patchState({
      prevVisitedPage: action.prevVisitedPage,
    });
  }

  @Action(SetToken)
  setToken({ patchState }: StateContext<IState>, action: SetToken) {
    patchState({
      token: action.token,
    });
  }

  @Action(SetRefreshToken)
  setRefreshToken({ patchState }: StateContext<IState>, action: SetRefreshToken) {
    patchState({
      refreshToken: action.refreshToken,
    });
  }

  @Action(SetUserId)
  setUserId({ patchState }: StateContext<IState>, action: SetUserId) {
    patchState({
      userId: action.userId,
    });
  }

  @Action(SetTextbookPage)
  setTextbookPage({ patchState }: StateContext<IState>, action: SetTextbookPage) {
    patchState({
      textbookPage: action.textbookPage,
    });
  }

  @Action(SetWordsLevel)
  setWordsLevel({ patchState }: StateContext<IState>, action: SetWordsLevel) {
    patchState({
      wordsLevel: action.wordsLevel,
    });
  }

  @Action(SetUserSettings)
  setUserSettings({ patchState }: StateContext<IState>, action: SetUserSettings) {
    patchState({
      userSettings: action.userSettings,
    });
  }

  @Action(SetUserStatistic)
  setUserStatistic({ patchState }: StateContext<IState>, action: SetUserStatistic) {
    patchState({
      userStatistic: action.userStatistic,
    });
  }

  @Action(SetUserDate)
  setDate({ patchState }: StateContext<IState>, action: SetUserDate) {
    patchState({
      userData: action.userData,
    });
  }

  @Selector()
  public static prevVisitedPage(state: IState): string {
    return state.prevVisitedPage;
  }

  @Selector()
  public static token(state: IState): string {
    return state.token;
  }

  @Selector()
  public static refreshToken(state: IState): string {
    return state.refreshToken;
  }

  @Selector()
  public static userId(state: IState): string {
    return state.userId;
  }

  @Selector()
  public static textbookPage(state: IState): string {
    return state.textbookPage;
  }

  @Selector()
  public static wordsLevel(state: IState): string {
    return state.wordsLevel;
  }

  @Selector()
  public static userSettings(state: IState): string {
    return state.userSettings;
  }

  @Selector()
  public static userStatistic(state: IState): string {
    return state.userStatistic;
  }

  @Selector()
  public static userData(state: IState): number {
    return state.userData;
  }
}

export default RSLState;
