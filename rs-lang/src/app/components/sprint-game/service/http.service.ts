import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IWordData } from 'src/app/interfaces/interfaces';
import RSLState from 'src/app/store/rsl.state';
import { BASE_URL } from '../../../constants/constants';

@Injectable({
  providedIn: 'root',
})
class HttpService {
  token: string;

  userId: string;

  refreshToken: string;

  constructor(private http: HttpClient, private store: Store) {
    this.token = this.store.selectSnapshot(RSLState.token);
    this.userId = this.store.selectSnapshot(RSLState.userId);
    this.refreshToken = this.store.selectSnapshot(RSLState.refreshToken);
  }

  getWordsData(level: string, page: number): Observable<IWordData[]> {
    return this.http.get<IWordData[]>(`${BASE_URL}words?group=${level}&page=${page}`);
  }

  getNewToken() {
    return this.http.get(`${BASE_URL}users/${this.userId}/tokens`, {
      headers: {
        Authorization: `Bearer ${this.refreshToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  createUserWord(idWord: string, status: string, result: string) {
    return this.http.post(`${BASE_URL}users/${this.userId}/words/${idWord}`, {
      difficulty: `${status}`,
      optional: { result },
    });
  }

  updateUserWord(idWord: string, status: string, result: string) {
    return this.http.post(`${BASE_URL}users/${this.userId}/words/${idWord}`, {
      difficulty: `${status}`,
      optional: { result },
    });
  }

  deleteUserWord(idWord: string) {
    return this.http.delete(`${BASE_URL}users/${this.userId}/words/${idWord}`);
  }
}

export default HttpService;
