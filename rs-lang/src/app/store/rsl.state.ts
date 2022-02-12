import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { IState } from './rsl.interface';
import { SetPrevVisitedPage, SetToken } from './rsl.action';

const initialState: IState = {
  token: '',
  prevVisitedPage: '',
};

@State<IState>({
  name: 'RSLState',
  defaults: initialState,
})
@Injectable()
export class RSLState {
  constructor() {}

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

  @Selector()
  public static prevVisitedPage(state: IState): string {
    return state.prevVisitedPage;
  }

  @Selector()
  public static token(state: IState): string {
    return state.token;
  }
}
