import { Component, DestroyRef, OnInit } from '@angular/core';
import { ShopStateService } from '../../../services/shop-state-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Shop } from '../../../model/shop.model';

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
    private fb: FormBuilder,
    private dr: DestroyRef
  ) {}

  ngOnInit(): void {
    const record = this.sss.getShop();

    if (record) {
      this.form = this.fb.group({
        enableOrderConfirm: [record.enableOrderConfirm, []],
        enableOrderDeliver: [record.enableOrderDeliver, []],
      })
    } else {
      this.form = this.fb.group({
        enableOrderConfirm: ['', []],
        enableOrderDeliver: ['', []],
      })
    }

    const formChanges = this.form.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const currData = this.sss.getShop();
      const updatedData: Shop = { ...currData, ...value };
      this.sss.updateShop(updatedData);
    });

    this.dr.onDestroy(() => {
      formChanges.unsubscribe();
    });
  }

}
