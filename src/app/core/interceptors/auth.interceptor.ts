import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  console.log('Interceptor: Processing request for URL:', req.url);
  const token = localStorage.getItem('access_token'); 
  console.log('Interceptor: Token in localStorage:', token);

  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    console.log('Interceptor: Skipping auth endpoints');
    return next(req);
  }

  if (token) {
    console.log('Interceptor: Adding token to request:', token);
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  console.log('Interceptor: No token found, proceeding without Authorization header');
  return next(req);
};
