import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../common/services/toast-service';
import { HomePageService } from '../../services/home-page-service';
import { RequestRegister } from '../../model/home-page.model';
import { ResponseText } from '../../../common/constant/response';
import { ErrorResponse } from '../../../common/model/common-model';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp implements OnInit{
  form: FormGroup = new FormGroup({});

  @Output() cancel = new EventEmitter< 'sign-in' | 'sign-up' | 'forgot-password' >();

  constructor(private toastService: ToastService,
    private homePageService: HomePageService
  ) {
  }

  ngOnInit(): void {
    this.form = new FormBuilder().group({
      name: ['', [Validators.required]],
      phoneNo: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submitForm() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const payload = this.form.value as RequestRegister;
      payload.firstName = this.form.value.name;

      this.homePageService.register(payload).subscribe({
        next: (res) => {
          this.toastService.success(ResponseText.SUCCESS_REGISTER);
          this.cancel.emit('sign-in');
        },
        error: (err: ErrorResponse) => {
          this.toastService.error(err.error.message);
        }
      })
    }
  }

  cancelForm() {
    this.cancel.emit('sign-in');
  }

}
