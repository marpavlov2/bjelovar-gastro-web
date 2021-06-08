import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(public auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /* if (!req.headers.has('Content-Type')) {
            req = req.clone({
                headers: req.headers.set('Content-Type', 'application/json; charset=utf-8')
            });
        } */

        if (this.auth.authUser && this.auth.authUser.accessToken) {
            req = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${this.auth.authUser.accessToken}`
                }
            });
        }

        return next.handle(req);
    }
}