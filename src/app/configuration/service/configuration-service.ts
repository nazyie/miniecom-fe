import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RequestPassword, RequestUser } from '../model/configuration-model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiRoute = environment.apiUrl + '/profile'

  constructor(
    private http: HttpClient
  ) { }

  changePassword(requestPassword: RequestPassword): Observable<void> {
    return this.http.post<void>(`${this.apiRoute}/change-password`, requestPassword)
  }

  updateProfile(requestUser: RequestUser): Observable<void> {
    return this.http.post<void>(`${this.apiRoute}`, requestUser);
  }

  getProfile(): Observable<RequestUser> {
    return this.http.get<RequestUser>(`${this.apiRoute}`);
  }

}
