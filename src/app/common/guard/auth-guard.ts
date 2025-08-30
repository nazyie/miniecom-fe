import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../services/security-service';

export const authGuard: CanActivateFn = (route, state) => {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (!securityService.hasAuthenticate())
    return router.parseUrl('/');

  return true;
};
