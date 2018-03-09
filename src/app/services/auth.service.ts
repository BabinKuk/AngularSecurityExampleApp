import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {User} from "../model/user";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import * as auth0 from 'auth0-js';
import {Router} from "@angular/router";
import * as moment from 'moment';

export const ANONYMOUS_USER: User = {
    id: undefined,
    email: ''
};

// auth0 config
const AUTH_CONFIG = {
    clientID: 'ZSkh4xlWJ7fHgHR6UESKH3etQHdMp4G8',
    domain: "babinkuk.eu.auth0.com"
};


@Injectable()
export class AuthService {

    // init auth0
    auth0 = new auth0.WebAuth({
        clientID: AUTH_CONFIG.clientID,
        domain: AUTH_CONFIG.domain,
        responseType: 'token id_token',
        redirectUri: 'https://localhost:4200/lessons',
        scope: 'openid email' // request user for email
    });

    private userSubject = new BehaviorSubject<User>(undefined);
    // broadcast any user object except undefined
    user$: Observable<User> = this.userSubject.asObservable().filter(user => !!undefined);

    constructor(private http: HttpClient, private router: Router) {
      // fetch user preferences if user is logged in
      if (this.isLoggedIn()) {
        this.userInfo();
      }
    }

    login() {
      console.log('login authorize');
      // call auth0 login screen
      this.auth0.authorize({initialScreen: 'login'});
    }

    signUp() {
      console.log('signup authorize');
      // call auth0 signup screen
      this.auth0.authorize({initialScreen: 'signUp'});
    }

    retrieveAuthInfoFromUrl() {
      // call auth0
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          console.log('Could not parse hash', err);
          return;
        } else if (authResult && authResult.idToken) {
          // clear hash
          window.location.hash = '';
          console.log('Auth successfull, result: ', authResult);
          // set session params
          this.setSession(authResult);

          // send req to save user email
          this.userInfo();
        }
      });
    }

    userInfo() {
      // save user data in server memory
      // body is null because user email is already inside jwt
      this.http.put<User>('/api/userInfo', null)
        .shareReplay() // disable multiple put requests
        .do(user => this.userSubject.next(user)) // broadcast observable data
        .subscribe();
    }

    logout() {
      // remove items from local storage and navigate
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      this.router.navigate(['/lessons']);
    }

    public isLoggedIn() {
        // check token expiration time to see if user is logged in
        // compare current moment with expiration time
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
      // opposite to isLoggedIn
      return !this.isLoggedIn();
    }

    getExpiration() {
      // get expiration time from local storage
      const expiration = localStorage.getItem('expires_at');
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }

    private setSession(authResult): any {
      // set expiration moment (add expiresIn seconds to current moment)
      const expiresAt = moment().add(authResult.expiresIn, 'second');
      // save jwt and expiration time params in local storage
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

}
