import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../common/services/toast-service';
import { ConfigurationService } from '../../service/configuration-service';
import { RequestPassword } from '../../model/configuration-model';
import { ResponseText } from '../../../common/constant/response';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword implements OnInit{
  form: FormGroup = new FormGroup({});
  isOpen = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }

   toggle() {
    this.isOpen = !this.isOpen;
  }

  submit() {
    const isPasswordMatching = this.form.get('password')?.value === this.form.get('confirmPassword')?.value;

    if (!isPasswordMatching)
      this.toastService.error(ResponseText.ERR_MISMATCH_PASSWORD)

    if (this.form.valid && isPasswordMatching) {
      const payload = this.form.value as RequestPassword;

      this.configurationService.changePassword(payload).subscribe({
        next: () => {
          this.toastService.info(ResponseText.RECORD_SUCCESS_UPDATE);
        }
      })
    } else {
      console.log('Invalid form');
    }
  }

}
