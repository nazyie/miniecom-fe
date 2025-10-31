import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast-service';

export const exceptionInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 400 || error.status === 403 ) {
        toastService.error(error.error.message);
      } else if (error.status === 404) {
        toastService.error('Pautan tidak dapat dicapai');
      }

      return throwError(() => error);
    })
  );
};
