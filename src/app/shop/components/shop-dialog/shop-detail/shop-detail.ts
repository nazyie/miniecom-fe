import { Component, DestroyRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShopStateService } from '../../../services/shop-state-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopService } from '../../../services/shop-service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { Shop } from '../../../model/shop.model';
import { ToastService } from '../../../../common/services/toast-service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-shop-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './shop-detail.html',
  styleUrl: './shop-detail.css'
})
export class ShopDetail implements OnInit {
  form: FormGroup = new FormGroup({});

  isSubDomainAllowed: boolean | null = null;
  selectedFile !: File | null;
  uploadProgress: number | null = null;

  @ViewChild('fileInput') fileInput !: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private sss: ShopStateService,
    private ss: ShopService,
    private dr: DestroyRef,
    private toastService: ToastService
  ) { };

  ngOnInit(): void {
    const record = this.sss.getShop();

    if (record) {
      this.form = this.fb.group({
        id: [record.id, [Validators.required]],
        name: [record.name, [Validators.required]],
        slug: [record.slug, [Validators.required]],
        openShop: [record.openShop, []],
        shopType: [record.shopType, [Validators.required]],
        enableOrderConfirm: [record.enableOrderConfirm, []],
        enableOrderDeliver: [record.enableOrderDeliver, []],
      })

      this.checkSubdomainAvailability(record.slug);
    } else {
      this.form = this.fb.group({
        name: ['', [Validators.required]],
        slug: ['', [Validators.required]],
        openShop: ['', []],
        shopType: ['', [Validators.required]],
        enableOrderConfirm: ['', []],
        enableOrderDeliver: ['', []],
      })
    }

    if (record.id) {
      this.form.controls['shopType'].disable();
    }

    const listenShopNameChanges = this.form.get('name')?.valueChanges.subscribe((value) => {
      const slug = this.form.get('slug');
      slug?.setValue(this.toKebabCase(value));
    })

    const listenSubDomainChanges = this.form.get('slug')?.valueChanges.pipe(
      tap(() => this.isSubDomainAllowed = null),
      debounceTime(400),
      distinctUntilChanged(),
      filter(value => !!value?.trim())
    ).subscribe(value => {
      this.checkSubdomainAvailability(value);
    });

    const formChanges = this.form.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const currData = this.sss.getShop();
      const updatedData: Shop = { ...currData, ...value };
      this.sss.updateShop(updatedData);
    });

    this.dr.onDestroy(() => {
      formChanges.unsubscribe();
      listenShopNameChanges?.unsubscribe();
      listenSubDomainChanges?.unsubscribe();
    });
  }

  private checkSubdomainAvailability(slug: string): void {
    const { id } = this.sss.getShop();
    const idPayload = id === '' ? 'no-id' : id;

    if (slug) {
      this.ss.checkSlug(idPayload, slug).subscribe({
        next: (res) => {
          this.isSubDomainAllowed = !res;

        }
      });
    }
  }

  get logoHyperlink(): string | null {
    const { shopLogoPath } = this.sss.getShop();

    if (!shopLogoPath)
      return null;

    return this.ss.getAttachmentAssetPath(shopLogoPath);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.size > 2 * 1024 * 1024) {
        this.toastService.error('Fail melebihi 2MB!');
        input.value = '';
        return;
      }

      this.selectedFile = file;
    }
  }

  uploadLogo(): void {
    const shop = this.sss.getShop();

    if (!this.selectedFile) {
      this.toastService.error('Sila pilih fail terlebih dahulu.');
      return;
    }

    if (!shop?.id) {
      this.toastService.error('Sila lengkapkan maklumat lain terlebih dahulu dan tekan butang simpan');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.ss.uploadLogo(shop.id, formData).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.toastService.success('Logo berjaya dimuat naik!');
          this.uploadProgress = null;
          this.selectedFile = null;
          this.fileInput.nativeElement.value = ''; // reset input

          const filePath = event.body?.filePath;

          if (filePath) {
            const currData = this.sss.getShop();
            const updatedData: Shop = { ...currData, shopLogoPath: filePath };
            this.sss.updateShop(updatedData);
          }
        }
      },
      error: err => {
        console.error(err);
        this.toastService.error('Gagal memuat naik logo.');
        this.uploadProgress = null;
      }
    });
  }

  deleteLogo(): void {
    const { id } = this.sss.getShop();
    this.ss.deleteLogo(id).subscribe({
      next: () => {
        this.toastService.info('Gambar berjaya dipadam');
        const currData = this.sss.getShop();
        const updatedData: Shop = { ...currData, shopLogoPath: '' };
        this.sss.updateShop(updatedData);
      }
    });
  }


  get createHyperlink(): string {
    const baseLink = this.ss.getBaseUrl;
    const slug = this.form.get('slug')?.value;

    return `https://${slug}.${baseLink}`;
  }

  toKebabCase(input: string): string {
    return input
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // insert hyphen between camelCase or PascalCase
      .replace(/[\s_]+/g, "-")                // replace spaces or underscores with hyphen
      .toLowerCase();                         // make everything lowercase
  }
}
