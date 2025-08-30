import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseLogin } from '../model/security-model';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast-service';
import { ResponseText } from '../constant/response';
import { ErrorResponse } from '../model/common-model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private refreshToken = new BehaviorSubject<string>('');
  private accessToken = new BehaviorSubject<string>('');

  private apiRoute = environment.apiUrl + "/security/";

  constructor(private httpClient: HttpClient,
    private toastService: ToastService
  ) {
    if (

    )
  }


  hasAuthenticate(): boolean {
    if (this.refreshToken.getValue() === '')
      return false;

    if (this.accessToken.getValue() == '')
      return false;

    return true;
  }

  refreshAccessToken() {
  }

  saveAccessAndRefreshToken(responseLogin: ResponseLogin) {
    const { refreshToken, accessToken }  = responseLogin;

    this.refreshToken.next(refreshToken);
    this.accessToken.next(accessToken);
    this.storeToken();
  }

  logout() {
    this.httpClient.post<any>(this.apiRoute + '/logout/' + this.refreshToken.getValue(), null).subscribe({
      next: ()=> {
        this.toastService.info(ResponseText.SUCCESS_LOGOUT);
        this.refreshToken.next('');
        this.accessToken.next('');
      },
      error: (err: ErrorResponse)=> {
        this.toastService.error(err.error.message);
      },
      complete: ()=> {
        this.storeToken();
      }
    })
  }

  private storeToken() {
    localStorage.setItem('refreshToken', this.refreshToken.getValue());
    localStorage.setItem('accessToken', this.accessToken.getValue());
  }

  private loadToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (refreshToken && refreshToken != '')
      this.refreshToken.next(refreshToken);

    if (accessToken && accessToken != '')
      this.accessToken.next(accessToken);
  }

}
