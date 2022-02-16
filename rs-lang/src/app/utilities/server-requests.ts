import { Store } from '@ngxs/store';
import { BASE_URL } from '../constants/constants';
import { IUserSettings, IUserSettingsData, IWordSetter, IWordSpecial } from '../interfaces/interfaces';
import RSLState from '../store/rsl.state';

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

async function getUserSetting(store: Store) {
  const userId: string = store.selectSnapshot(RSLState.userId);
  const token: string = store.selectSnapshot(RSLState.token);
  const response: Response = await fetch(`${BASE_URL}users/${userId}/settings`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data: IUserSettings = await response.json();
  return data;
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

export { getAllWordsSpecials, getUserSetting, setUserSetting, getUserWord, updateUserWord, createUserWord };
