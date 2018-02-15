import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../common/forms.css']
})
export class SignupComponent implements OnInit {

    form: FormGroup;

    constructor(private fb: FormBuilder, private authService: AuthService) {

        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirm: ['', Validators.required]
        });


    }

    ngOnInit() {

    }

    signUp() {
      //console.log('signup');
      // json object with form values
      const val = this.form.value;

      // validate form and call service
      if (val.email && val.password && val.password === val.confirm) {
        this.authService.signUp(val.email, val.password)
          .subscribe(
            () => console.log('user subscribed successfully'), // then case
            console.error // catch error case
          );
      }
    }

    singIn() {
      console.log('signin');
    }

    logOut() {
      console.log('logout');
    }

}
