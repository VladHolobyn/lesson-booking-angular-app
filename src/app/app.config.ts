import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';

import { routes } from './app.routes';
import {InMemoryDataService} from './core/services/dev/in-memory-db.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(InMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
      passThruUnknownUrl: false
    }))
  ]
};
