import { Component, OnInit } from '@angular/core';
import { ShopStateService } from '../../../services/shop-state-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-ordering',
  imports: [ReactiveFormsModule],
  templateUrl: './shop-ordering.html',
  styleUrl: './shop-ordering.css'
})
export class ShopOrdering implements OnInit{
  form : FormGroup = new FormGroup({});

  constructor(
    private sss: ShopStateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const record = this.sss.getShop();

    if (record) {
      this.form = this.fb.group({
        enableOrderConfirm: [record.enableOrderConfirm, []],
        enableOrderDeliver: [record.enableOrderDeliver, []],
        enableOrderPayment: [record.enableOrderPayment, []],
      })
    } else {
      this.form = this.fb.group({
        enableOrderConfirm: ['', []],
        enableOrderDeliver: ['', []],
        enableOrderPayment: ['', []],
      })
    }
  }

}
