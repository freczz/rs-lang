import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IUserData, IWordData } from 'src/app/interfaces/interfaces';
import RSLState from 'src/app/store/rsl.state';
import { BASE_URL } from '../../../constants/constants';

@Injectable({
  providedIn: 'root',
})
class HttpService {
  token: string = '';

  userId: string = '';

  refreshToken: string = '';

  constructor(private http: HttpClient, private store: Store) {}

  getWordsData(level: string, page: number): Observable<IWordData[]> {
    return this.http.get<IWordData[]>(`${BASE_URL}words?group=${level}&page=${page}`);
  }

  getNewToken() {
    this.token = this.store.selectSnapshot(RSLState.token);
    this.userId = this.store.selectSnapshot(RSLState.userId);
    this.refreshToken = this.store.selectSnapshot(RSLState.refreshToken);
    return this.http.get<IUserData>(`${BASE_URL}users/${this.userId}/tokens`, {
      headers: {
        Authorization: `Bearer ${this.refreshToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
}

export default HttpService;
