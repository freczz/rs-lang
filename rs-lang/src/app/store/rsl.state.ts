import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { IState } from './rsl.interface';
import { SetPrevVisitedPage, SetToken, SetTextbookPage } from './rsl.action';

const initialState: IState = {
  token: '',
  prevVisitedPage: '',
  textbookPage: '0',
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

  @Action(SetToken)
  setTextbookPage({ patchState }: StateContext<IState>, action: SetTextbookPage) {
    patchState({
      textbookPage: action.textbookPage,
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
  public static textbookPage(state: IState): string {
    return state.textbookPage;
  }
}

export default RSLState;
