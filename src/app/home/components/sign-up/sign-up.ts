import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  imports: [],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  @Output() cancel = new EventEmitter< 'sign-in' | 'sign-up' | 'forgot-password' >();

  cancelForm() {
    this.cancel.emit('sign-in');
  }

}
