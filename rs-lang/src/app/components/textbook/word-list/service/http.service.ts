import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/app/constants/constants';
import { IListWord } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export default class HttpService {
  constructor(private http: HttpClient) {}

  getWordsOnPage(group: string, page: string): Observable<IListWord[]> {
    return this.http.get<IListWord[]>(`${BASE_URL}words?group=${group}&page=${page}`);
  }

  getWord(wordId: string, token: string): Observable<IListWord> {
    return this.http.get<IListWord>(`${BASE_URL}words/${wordId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }
}
