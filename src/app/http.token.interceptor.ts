import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { UserService} from './user.service';

import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AlertService} from "./alert.service";
import {JwtService} from "./jwt.service";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
      private jwtService: JwtService,
      private userService: UserService,
      private router: Router,
      private Alert: AlertService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const token = this.jwtService.token;

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    req = req.clone({setHeaders: headersConfig});
    return next.handle(req)
        .pipe(
            catchError((error: HttpErrorResponse) => {
              if (400 <= error.status && error.status<422 && 422 <error.status && error.status <= 526) {
                this.userService.logout();
                this.Alert.danger(`${error.error.data.email}`);
              }
              return throwError(error);
            })
        );

  }
}
