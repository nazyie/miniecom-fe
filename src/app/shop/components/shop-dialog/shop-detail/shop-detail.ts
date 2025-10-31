import { Component, DestroyRef, OnInit } from '@angular/core';
import { ShopStateService } from '../../../services/shop-state-service';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../../../booking/service/booking-service';
import { ShopService } from '../../../services/shop-service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { Shop } from '../../../model/shop.model';

@Component({
  selector: 'app-shop-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './shop-detail.html',
  styleUrl: './shop-detail.css'
})
export class ShopDetail implements OnInit{
  form: FormGroup = new FormGroup({});

  isSubDomainAllowed: boolean | null = null;

  constructor(
    private fb: FormBuilder,
    private sss: ShopStateService,
    private ss: ShopService,
    private dr: DestroyRef
  ) {};

  ngOnInit(): void {
    const record = this.sss.getShop();

    if (record) {
      this.form = this.fb.group({
        id: [record.id, [Validators.required]],
        name: [record.name, [Validators.required]],
        tempSlug: [record.slug, [Validators.required]],
        openShop: [record.openShop, []],
        shopType: [record.shopType, [Validators.required]],
        enableOrderConfirm: [record.enableOrderConfirm, []],
        enableOrderDeliver: [record.enableOrderDeliver, []],
        enableOrderPayment: [record.enableOrderPayment, []],
      })

      this.form.controls['shopType'].disable();
      this.checkSubdomainAvailability(record.slug);
    } else {
      this.form = this.fb.group({
        name: ['', [Validators.required]],
        tempSlug: ['', [Validators.required]],
        openShop: ['', []],
        shopType: ['', [Validators.required]],
        enableOrderConfirm: ['', []],
        enableOrderDeliver: ['', []],
        enableOrderPayment: ['', []],
      })
    }

    const listenShopNameChanges = this.form.get('name')?.valueChanges.subscribe((value) => {
      const slug = this.form.get('tempSlug');
      slug?.setValue(this.toKebabCase(value));
    })

    const listenSubDomainChanges = this.form.get('tempSlug')?.valueChanges.pipe(
      tap(() => this.isSubDomainAllowed = null),
      debounceTime(400),
      distinctUntilChanged(),
      filter(value => !!value?.trim())
    ).subscribe(value => {
      this.checkSubdomainAvailability(value);
    });

    const formChanges = this.form.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const currData = this.sss.getShop();

      if (this.isSubDomainAllowed) {
        const slug = this.form.get('slug')?.value;

        const updatedData: Shop = { ...currData, ...value, slug };
        this.sss.updateShop(updatedData);
      } else {
        const updatedData: Shop = { ...currData, ...value };
        this.sss.updateShop(updatedData);
      }
    });

    this.dr.onDestroy(() => {
      formChanges.unsubscribe();
      listenShopNameChanges?.unsubscribe();
      listenSubDomainChanges?.unsubscribe();
    });
  }

  private checkSubdomainAvailability(slug: string): void {
    const { id } = this.sss.getShop();

    this.ss.checkSlug(id, slug).subscribe({
      next: (res) => {
        this.isSubDomainAllowed = !res;
      }
    });
  }

  get createHyperlink() : string {
    const baseLink = this.ss.getBaseUrl;
    const slug = this.form.get('tempSlug')?.value;

    return `https://${slug}.${baseLink}`;
  }

  toKebabCase(input: string): string {
    return input
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // insert hyphen between camelCase or PascalCase
      .replace(/[\s_]+/g, "-")                // replace spaces or underscores with hyphen
      .toLowerCase();                         // make everything lowercase
  }
}
