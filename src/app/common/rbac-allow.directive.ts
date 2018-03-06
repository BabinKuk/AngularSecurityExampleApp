import { Directive, TemplateRef, ViewContainerRef, Input, OnDestroy } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { User } from "../model/user";
import { Subscription } from "rxjs/Subscription";
import * as _ from 'lodash';

@Directive({
  selector: '[rbacAllow]'
})
export class RbacAllowDirective  implements OnDestroy{

  allowedRoles: string[];
  user: User;
  sub: Subscription;

  constructor(
    private templateRef: TemplateRef<any>, // element to which the directive is applied
    private viewContainer: ViewContainerRef,
    private authService: AuthService) {

    // receive user data
    this.sub = authService.user$.subscribe(
      user => {
        this.user = user;
        this.showIfUserAllowed();
      }
    );
  }

  // to prevent any memory leaks due to missing subscription
  ngOnDestroy(): void {
    // cancel subscription
    this.sub.unsubscribe();
  }

  // set is triggered whenever there is a new value in the template
  @Input()
  set rbacAllow(allowedRoles: string[]) {
    this.allowedRoles = allowedRoles;

    this.showIfUserAllowed();
  }

  // called in 2 situations: when user data is received and when allowed roles are received
  showIfUserAllowed() {
    console.log('check if allowed rbac');
    // check allowedRoles and user data
    if (!this.allowedRoles || this.allowedRoles.length === 0 || !this.user) {
      console.log('no data to allow rbac');
      // hide admin entry on the menu
      this.viewContainer.clear();
      return;
    }

    // calculate roles common both to user roles and to roles allowed to see element
    const isUserAllowed = _.intersection(this.allowedRoles, this.user.roles).length > 0;

    if (isUserAllowed) {
      console.log('allow rbac');
      // show admin entry on the menu
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      console.log('rbac not allowed');
      // hide admin entry on the menu
      this.viewContainer.clear();
    }
  }
}
