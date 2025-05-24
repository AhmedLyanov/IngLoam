import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideHighlightOptions } from 'ngx-highlightjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), 
      languages: {
        javascript: () => import('highlight.js/lib/languages/javascript'),
        typescript: () => import('highlight.js/lib/languages/typescript'),
        python: () => import('highlight.js/lib/languages/python'),
        java: () => import('highlight.js/lib/languages/java'),
        cpp: () => import('highlight.js/lib/languages/cpp'),
      },
      themePath: 'node_modules/highlight.js/styles/github.css', 
    }),
  ],
};