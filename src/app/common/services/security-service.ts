import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseLogin } from '../model/security-model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private refreshToken = new BehaviorSubject<string>("");
  private accessToken = new BehaviorSubject<string>("");

  private httpClient = inject(HttpClient);
  private apiRoute = environment.apiUrl + "/security/";

  refreshAccessToken() {
  }

  saveAccessAndRefreshToken(responseLogin: ResponseLogin) {
    const { refreshToken, accessToken }  = responseLogin;

    this.refreshToken.next(refreshToken);
    this.accessToken.next(accessToken);

  }

}
