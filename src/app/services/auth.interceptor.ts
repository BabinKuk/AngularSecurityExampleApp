import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get token from localstorage
    const idToken = localStorage.getItem('id_token');

    // check if token is present
    if (idToken) {
      // clone http request object and modify it with additional data
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + idToken)
      });

      return next.handle(cloned);
    } else {
      // continue with middleware chain
      return next.handle(req);
    }
  }
}
