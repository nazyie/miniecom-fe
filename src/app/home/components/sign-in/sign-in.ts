import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RequestLogin } from '../../model/home-page.model';
import { SecurityService } from '../../../common/services/security-service';
import { ToastService } from '../../../common/services/toast-service';
import { ErrorResponse } from '../../../common/model/common-model';
import { Router } from '@angular/router';
import { ResponseText } from '../../../common/constant/response';
import { ShopNavigatorService } from '../../../common/services/shop-navigator-service';
import { ShopService } from '../../../shop/services/shop-service';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn implements OnInit{
  form: FormGroup = new FormGroup({});

  constructor (
    private securityService: SecurityService,
    private toastService: ToastService,
    private router: Router,
    private shopNavigatorService: ShopNavigatorService,
    private shopService: ShopService
  ) {
  }

  ngOnInit() {
    this.form = new FormBuilder().group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]

    });
  }

  submitForm() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const formRequest = this.form.value as RequestLogin;
      this.securityService.login(formRequest).subscribe({
        next: (res) => {
          this.toastService.success(ResponseText.SUCCESS_SIGN_IN);
          this.handleAutoShopSelection();
          this.router.navigate(['kedai']);
        },
      });
    }
  }

  private handleAutoShopSelection() {
    let items: any[] = [];

    this.shopService.getAllShop().subscribe({
      next: (result) => {
        items = result;
      },
      complete: () => {
        if (items.length > 0) {
          this.shopNavigatorService.loadCurrentShop(items[0]);
        }
      }
    })
  }

}
