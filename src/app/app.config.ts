import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
// 1. Import provideHttpClient and withInterceptors
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
// 2. Import your brand new functional interceptor function
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    
    // 3. Register the modern, reactive functional interceptor chain
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};