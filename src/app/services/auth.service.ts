import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {User} from "../model/user";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export const ANONYMOUS_USER: User = {
    id: undefined,
    email: ''
}


@Injectable()
export class AuthService {

    private subject = new BehaviorSubject<User>(undefined);

    // broadcast user data only if the user is defined (authenticated users)
    user$: Observable<User> = this.subject.asObservable().filter(user => !!user);

    isLoggedIn$: Observable<boolean> = this.user$.map(user => !!user.id);

    isLoggedOut$: Observable<boolean> = this.isLoggedIn$.map(isLoggedIn => !isLoggedIn);

    constructor(private http: HttpClient) {
      // load user data and propagate to the rest of application
      http.get<User>('/api/user')
        .subscribe(user => this.subject.next(user ? user : ANONYMOUS_USER));

    }

    signUp(email:string, password:string ) {
      console.log('signup service');
      return this.http.post<User>('/api/signup', {email, password})
          .shareReplay()
          .do(user => this.subject.next(user));
    }

    logout() {
      console.log('logout service');
      return this.http.post('/api/logout', null)
        .shareReplay()
        .do(user => this.subject.next(ANONYMOUS_USER));
    }

    login(email:string, password:string ) {
      console.log('login service');
      return this.http.post<User>('/api/login', {email, password})
            .shareReplay()
            .do(user => this.subject.next(user));
    }

}
