import { HttpInterceptorFn } from '@angular/common/http';
import { SecurityService } from '../services/security-service';
import { inject } from '@angular/core';

const AUTH_WHITELIST = [
  '/api/security'
]

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const securityService: SecurityService = inject(SecurityService);
  const accessToken = securityService.getAccessToken();

  const isAuthRequired = AUTH_WHITELIST.some(url => !req.url.includes(url));

  if (accessToken && isAuthRequired) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }

  return next(req);
};
