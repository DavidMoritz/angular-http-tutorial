import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {
  HttpHandlerFn,
  type HttpRequest,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

function loggingIntercepter(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log('outgoing request', request);
  const req = request.clone({
    headers: request.headers.set('X-DEBUG', 'TESTING')
  });
  return next(request);
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([loggingIntercepter]))]
}).catch((err) => console.error(err));
