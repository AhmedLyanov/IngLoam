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
        xml: () => import('highlight.js/lib/languages/xml'),
        css: () => import('highlight.js/lib/languages/css'),
        c: () => import('highlight.js/lib/languages/c'),
        csharp: () => import('highlight.js/lib/languages/csharp'),
        php: () => import('highlight.js/lib/languages/php'),
        ruby: () => import('highlight.js/lib/languages/ruby'),
        go: () => import('highlight.js/lib/languages/go'),
        swift: () => import('highlight.js/lib/languages/swift'),
        kotlin: () => import('highlight.js/lib/languages/kotlin'),
        rust: () => import('highlight.js/lib/languages/rust'),
        sql: () => import('highlight.js/lib/languages/sql'),
        bash: () => import('highlight.js/lib/languages/bash'),
        json: () => import('highlight.js/lib/languages/json'),
        markdown: () => import('highlight.js/lib/languages/markdown'),
      },
      themePath: 'node_modules/highlight.js/styles/github.css',
    }),
  ],
};