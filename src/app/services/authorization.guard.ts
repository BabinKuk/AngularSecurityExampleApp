import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { AuthService } from "./auth.service";
import * as _ from 'lodash';
import { Injectable } from "@angular/core";

/*
route interceptor
enable or disable certain routes (urls) depending on the user role
*/
@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private allowedRoles: string[],
              private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

      // compare user roles and allowed roles to enable/disable certain routes
      return this.authService.user$
        .map(user => _.intersection(this.allowedRoles, user.roles).length > 0)
        .first()
        .do(allowed => {
          if (!allowed) {
            console.log('route not allowed');
            this.router.navigateByUrl('/');
          } else {
            console.log('route allowed');
          }
        });
  }
}
