import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RequestForgotPassword, RequestLogin, RequestRegister } from '../model/home-page.model';
import { ResponseLogin } from '../../common/model/security-model';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  private apiRoute = environment.apiUrl + '/security';

  constructor(private httpClient: HttpClient) { }

  login(payload: RequestLogin): Observable<ResponseLogin> {
    return this.httpClient.post<ResponseLogin>(this.apiRoute + '/login', payload);
  }

  register(payload: RequestRegister): Observable<string>{
    return this.httpClient.post<string>(this.apiRoute + '/register', payload);
  }

  forgotPassword(payload: RequestForgotPassword): Observable<any> {
    return this.httpClient.post<any>(this.apiRoute + '/forgot-password', payload);
  }

}
