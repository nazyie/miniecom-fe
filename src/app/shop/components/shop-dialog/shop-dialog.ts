import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Shop } from '../../model/shop.model';
import { ShopService } from '../../services/shop-service';
import { CmsBuilder } from "../cms-builder/cms-builder";

export enum SHOP_STATUS {
  ACTIVE,
  DEACTIVE
}

@Component({
  selector: 'app-shop-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './shop-dialog.html',
  styleUrl: './shop-dialog.css'
})
export class ShopDialog implements OnChanges, OnInit {
  @Input() formTitle!: string;
  @Input() submitLabel!: string;
  @Input() formMode!: string;
  @Input() record: Shop | undefined | null;

  @Output() formSubmitted = new EventEmitter<{ formMode: string, data: any }>();

  form: FormGroup = new FormGroup({});

  tickEnableOrderConfirm: boolean = false;
  tickEnableOrderDeliver: boolean = false;

  slugLink: string = '';

  constructor(
    private destroyRef: DestroyRef,
    private fb: FormBuilder,
    private shopService: ShopService
  ) { }

  ngOnInit(): void {
    if (this.record) {
      this.slugLink = this.record.slug;

      this.form = this.fb.group({
        id: [this.record.id, [Validators.required]],
        name: [this.record.name, [Validators.required]],
        openShop: [this.record.openShop, []],
        shopType: [this.record.shopType, [Validators.required]],
        enableOrderConfirm: [this.record.enableOrderConfirm, []],
        enableOrderDeliver: [this.record.enableOrderDeliver, []],
        enableOrderPayment: [this.record.enableOrderPayment, []],
      })

      this.form.controls['shopType'].disable();

    } else {
      this.form = this.fb.group({
        name: ['', [Validators.required]],
        openShop: ['', []],
        shopType: ['', [Validators.required]],
        enableOrderConfirm: ['', []],
        enableOrderDeliver: ['', []],
        enableOrderPayment: ['', []],
      })
    }

    const listenShopName = this.form.get('name')?.valueChanges.subscribe((value) => {
      this.slugLink = this.toKebabCase(value);
    })

    this.destroyRef.onDestroy(() => {
      listenShopName?.unsubscribe();
    })
  }

  ngOnChanges() {
  }

  submit() {
    this.form.markAsTouched();

    if (this.form.valid) {
      const formRequest = this.form.value as Shop;

      this.formSubmitted.emit({
        formMode: this.formMode,
        data: formRequest
      });
    } else {
      console.log('Form not valid');
    }
  }

  delete() {
    this.formSubmitted.emit({
      formMode: 'DELETE',
      data: this.form.controls['id'].value
    });
  }

  close() {
    this.formSubmitted.emit({
      formMode: 'cancel',
      data: null
    })
  }

  toKebabCase(input: string): string {
    return input
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // insert hyphen between camelCase or PascalCase
      .replace(/[\s_]+/g, "-")                // replace spaces or underscores with hyphen
      .toLowerCase();                         // make everything lowercase
  }
}
