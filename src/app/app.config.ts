import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authorizationInterceptor } from './common/interceptor/authorization-interceptor';
import { unauthorizeInterceptor } from './common/interceptor/unauthorize-interceptor';
import { exceptionInterceptor } from './common/interceptor/exception-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authorizationInterceptor,
        unauthorizeInterceptor,
        exceptionInterceptor
      ])
    ),
  ]
};
