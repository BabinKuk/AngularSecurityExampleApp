import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// initial user - display if user is not yet logged in
export const ANONYMOUS_USER: User = {
  id: undefined,
  email: ''
};

@Injectable()
export class AuthService {

  // init data
  private subject = new BehaviorSubject<User>(ANONYMOUS_USER);
  user$: Observable<User> = this.subject.asObservable();
  // double bang !! returns value ie. coercers object to boolean
  isLoggedIn$: Observable<boolean> = this.user$.map(user => !!user.id);
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.map(isLoggedIn$ => !isLoggedIn$);

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    // post request with data body
    // return object is of User type
    return this.http.post<User>('/api/signup', {
      'email': email,
      'password': password
    })
    .shareReplay() // return object is cached, prevents callback multiple times
    .do(user => this.subject.next(user)); // broadcast response to all subscribers
  }

}
