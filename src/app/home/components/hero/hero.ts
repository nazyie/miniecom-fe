import { Component } from '@angular/core';
import { SignIn } from '../sign-in/sign-in';
import { SignUp } from '../sign-up/sign-up';
import { ForgotPassword } from '../forgot-password/forgot-password';

@Component({
  selector: 'app-hero',
  imports: [SignIn, SignUp, ForgotPassword],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  mode: 'sign-up' | 'sign-in' | 'forgot-password' = 'sign-in';

  toggleFormMode(mode: 'sign-up' | 'sign-in' | 'forgot-password') {
    this.mode = mode;
  }

}
