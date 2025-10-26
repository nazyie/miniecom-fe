import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../common/services/toast-service';
import { ConfigurationService } from '../../service/configuration-service';
import { ResponseText } from '../../../common/constant/response';
import { RequestUser } from '../../model/configuration-model';

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css'
})
export class UpdateProfile {
  form: FormGroup = new FormGroup({});
  isOpen = false;


  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNo: ['', [Validators.required]]
    })

    this.configurationService.getProfile().subscribe({
      next: (res) => {
        this.form.get('firstName')?.setValue(res.firstName);
        this.form.get('email')?.setValue(res.email);
        this.form.get('phoneNo')?.setValue(res.phoneNo);
      }
    })

    this.form.get('email')?.disable();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  submit() {
    if (this.form.valid) {
      const payload = this.form.value as RequestUser;

      this.configurationService.updateProfile(payload).subscribe({
        next: () => {
          this.toastService.info(ResponseText.RECORD_SUCCESS_UPDATE);
        }
      })
    } else {
      console.log('Invalid form');
    }
  }
}
