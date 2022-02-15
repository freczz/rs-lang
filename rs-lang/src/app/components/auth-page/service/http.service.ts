import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/app/constants/constants';
import { IFormData, IUserData } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export default class HttpService {
  errorStatus: string = '';

  constructor(private http: HttpClient) {}

  registerUser(formData: IFormData): Observable<IUserData> {
    return this.http.post<IUserData>(`${SERVER_URL}/users`, formData, {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    });
  }

  signInUser(formData: IFormData): Observable<IUserData> {
    return this.http.post<IUserData>(`${SERVER_URL}/signin`, formData, {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    });
  }
}
