import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../constants/constants';

@Injectable({
  providedIn: 'root',
})
class HttpService {
  constructor(private http: HttpClient) {}

  getWordsData(level: string, page: number): Observable<object> {
    return this.http.get(`${BASE_URL}words?group=${level}&page=${page}`);
  }
}

export default HttpService;
