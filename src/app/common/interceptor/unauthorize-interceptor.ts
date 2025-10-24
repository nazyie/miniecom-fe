import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { SecurityService } from '../services/security-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast-service';
import { ResponseText } from '../constant/response';

export const unauthorizeInterceptor: HttpInterceptorFn = (req, next) => {
  const securityService = inject(SecurityService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        securityService.forceReset();
        toastService.warning(ResponseText.ERR_SESSION_EXPIRED);
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
};
