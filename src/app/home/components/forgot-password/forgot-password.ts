import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  imports: [],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  @Output() cancel = new EventEmitter< 'sign-in' | 'sign-up' | 'forgot-password' >();

  cancelForm() {
    this.cancel.emit('sign-in');
  }

}
