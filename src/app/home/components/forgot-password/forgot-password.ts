import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastService } from '../../../common/services/toast-service';
import { HomePageService } from '../../services/home-page-service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit{
  form: FormGroup = new FormGroup({});

  @Output() cancel = new EventEmitter< 'sign-in' | 'sign-up' | 'forgot-password' >();

  constructor(private toastService: ToastService,
    private homePageService: HomePageService
  ) {

  }

  ngOnInit(): void {
    this.form = new FormBuilder().group({
      email: ['', [Validators.required]]
    });
  }

  submitForm() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      //
    }
  }

  cancelForm() {
    this.cancel.emit('sign-in');
  }

}
