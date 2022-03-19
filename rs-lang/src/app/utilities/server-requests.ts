import { Store } from '@ngxs/store';
import { BASE_URL, USER_SETTINGS, USER_STATISTIC } from '../constants/constants';
import {
  IUserSettingsData,
  IUserStatisticData,
  IWordSetter,
  IWordSpecial,
} from '../interfaces/interfaces';
import { SetUserSettings, SetUserStatistic } from '../store/rsl.action';
import RSLState from '../store/rsl.state';
import { updatePeriodSetting, updatePeriodStatistic } from './utils';

async function getAllWordsSpecials(store: Store): Promise<IWordSpecial[]> {
  const userId: string = store.selectSnapshot(RSLState.userId);
  const token: string = store.selectSnapshot(RSLState.token);
  const response: Response = await fetch(`${BASE_URL}users/${userId}/words`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data: IWordSpecial[] = await response.json();
  return data;
}

function getUserSetting(store: Store) {
  const userId: string = store.selectSnapshot(RSLState.userId);
  const token: string = store.selectSnapshot(RSLState.token);
  fetch(`${BASE_URL}users/${userId}/settings`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  }).then(response => {
    if (response.status === 200) {
      response.json().then((result: IUserSettingsData): void => {
        const options: IUserSettingsData = {
          optional: result.optional,
          wordsPerDay: result.wordsPerDay,
        }
        updatePeriodSetting(options);
        store.dispatch(new SetUserSettings(JSON.stringify(options)));
      });
    } else {
      store.dispatch(new SetUserSettings(JSON.stringify(USER_SETTINGS)));
    }
  }).catch((err: Response): Response => err)
}

async function setUserSetting(store: Store, option: IUserSettingsData): Promise<void> {
  const userId: string = store.selectSnapshot(RSLState.userId);
  const token: string = store.selectSnapshot(RSLState.token);
  await fetch(`${BASE_URL}users/${userId}/settings`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(option),
  });
}

async function getUserWord(store: Store, wordId: string): Promise<IWordSpecial> {
  const userId: string = store.selectSnapshot(RSLState.userId);
  const token: string = store.selectSnapshot(RSLState.token);
  const response: Response = await fetch(`${BASE_URL}users/${userId}/words/${wordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data: IWordSpecial = await response.json();
  return data;
}

async function updateUserWord(store: Store, wordId: string, word: IWordSetter): Promise<void> {
  const userId: string = store.selectSnapshot(RSLState.userId);
  const token: string = store.selectSnapshot(RSLState.token);
  await fetch(`${BASE_URL}users/${userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
}

async function createUserWord(store: Store, wordId: string, word: IWordSetter): Promise<void> {
  const userId: string = store.selectSnapshot(RSLState.userId);
  const token: string = store.selectSnapshot(RSLState.token);
  await fetch(`${BASE_URL}users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
}

async function setUserStatistic(store: Store, option: IUserStatisticData): Promise<void> {
  const userId: string = store.selectSnapshot(RSLState.userId);
  const token: string = store.selectSnapshot(RSLState.token);
  await fetch(`${BASE_URL}users/${userId}/statistics`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(option),
  });
}

function getUserStatistic(store: Store) {
  const userId: string = store.selectSnapshot(RSLState.userId);
  const token: string = store.selectSnapshot(RSLState.token);
  fetch(`${BASE_URL}users/${userId}/statistics`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  }).then(response => {
    if (response.status === 200) {
      response.json().then((result: IUserStatisticData): void => {
        const options: IUserStatisticData = {
          optional: result.optional,
          learnedWords: result.learnedWords,
        }
        updatePeriodStatistic(options);
        store.dispatch(new SetUserStatistic(JSON.stringify(options)));
      });
    } else {
      setUserStatistic(store, USER_STATISTIC);
      store.dispatch(new SetUserStatistic(JSON.stringify(USER_STATISTIC)));
    }
  }).catch((err: Response): Response => err)
}

export {
  getAllWordsSpecials,
  getUserSetting,
  setUserSetting,
  getUserWord,
  updateUserWord,
  createUserWord,
  setUserStatistic,
  getUserStatistic,
};
