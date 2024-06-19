import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {
  HttpHandlerFn,
  type HttpRequest,
  provideHttpClient,
  withInterceptors,
  HttpEventType
} from '@angular/common/http';
import { tap } from 'rxjs';

function loggingIntercepter(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log('outgoing request', request);
  const req = request.clone({
    headers: request.headers.set('X-DEBUG', 'TESTING')
  });
  return next(request).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          console.log('Incoming response', event.status, event.body);
        }
      }
    })
  );
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([loggingIntercepter]))]
}).catch((err) => console.error(err));
