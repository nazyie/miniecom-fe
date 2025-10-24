import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, tap } from 'rxjs';
import { RequestAccessToken, RequestLogout, ResponseAccessToken, ResponseLogin } from '../model/security-model';
import { environment } from '../../../environments/environment';

import { RequestLogin } from '../../home/model/home-page.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private refreshToken = new BehaviorSubject<string>('');
  private accessToken = new BehaviorSubject<string>('');

  private readonly apiRoute = environment.apiUrl + "/security";

  // readonly accessToken$ = this.accessToken.asObservable();
  // readonly refreshToken$ = this.accessToken.asObservable();

  readonly isAuthenticated$ = combineLatest([
    this.accessToken,
    this.refreshToken
  ]).pipe(
    map(([access, refresh]) => !!access && !!refresh),
    distinctUntilChanged()
  );

  constructor(
    private httpClient: HttpClient,
  ) {
    this.loadToken();
  }

  getAccessToken(): string {
    return this.accessToken.getValue();
  }

  getRefreshToken(): string {
    return this.refreshToken.getValue();
  }

  hasAuthenticate(): boolean {
    if (this.refreshToken.getValue() === '')
      return false;

    if (this.accessToken.getValue() == '')
      return false;

    return true;
  }

  refreshAccessToken(): Observable<ResponseAccessToken> {
    const payload: RequestAccessToken = { refreshToken: this.refreshToken.getValue() }

    return this.httpClient.post<ResponseAccessToken>(this.apiRoute + '/refresh-token', payload).pipe(
      tap((res) => {
        this.saveToken(res.accessToken)
      })
    );
  }

  login(payload: RequestLogin): Observable<ResponseLogin> {
    return this.httpClient.post<ResponseLogin>(this.apiRoute + '/login', payload).pipe(
      tap((res: ResponseLogin) => this.saveToken(res.accessToken, res.refreshToken)),
    )
  }

  logout(): Observable<void> {
    const payload: RequestLogout = { refreshToken: this.refreshToken.getValue() };

    return this.httpClient.post<void>(this.apiRoute + '/logout', payload).pipe(
      tap((res) => {
        this.resetToken();
      })
    )
  }

  forceReset(): void {
    this.resetToken();
  }

  private saveToken(accessToken: string): void;
  private saveToken(accessToken: string, refreshToken: string): void;
  private saveToken(accessToken: string, refreshToken?: string): void {
    this.accessToken.next(accessToken)

    if (refreshToken)
      this.refreshToken.next(refreshToken);

    this.saveTokenToLocalStorage();
  }

  private saveTokenToLocalStorage(): void {
    localStorage.setItem('refreshToken', this.refreshToken.getValue());
    localStorage.setItem('accessToken', this.accessToken.getValue());
  }

  private resetToken() {
    this.refreshToken.next('');
    this.accessToken.next('');
    this.saveTokenToLocalStorage();
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
