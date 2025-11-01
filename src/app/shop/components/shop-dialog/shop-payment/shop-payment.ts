import { Component, DestroyRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShopStateService } from '../../../services/shop-state-service';
import { debounceTime } from 'rxjs';
import { Shop } from '../../../model/shop.model';
import { ToastService } from '../../../../common/services/toast-service';
import { ShopService } from '../../../services/shop-service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-shop-payment',
  imports: [ReactiveFormsModule],
  templateUrl: './shop-payment.html',
  styleUrl: './shop-payment.css'
})
export class ShopPayment implements OnInit {
  form: FormGroup = new FormGroup({});

  selectedFile !: File | null;
  uploadProgress: number | null = null;

  @ViewChild('fileInput') fileInput !: ElementRef<HTMLInputElement>;

  constructor(
    private sss: ShopStateService,
    private fb: FormBuilder,
    private dr: DestroyRef,
    private toastService: ToastService,
    private ss: ShopService
  ) { }

  ngOnInit(): void {
    const record = this.sss.getShop();

    if (record) {
      this.form = this.fb.group({
        enableFpx: [record.enableFpx, []],
        enableCashOnArrival: [record.enableCashOnArrival, []],
        enableReceiptUpload: [record.enableReceiptUpload, []],
        bankDetailAttachmentPath: [record.bankDetailAttachmentPath, []],
        bankAccountNumber: [record.bankAccountNumber, []],
        bankAccountName: [record.bankAccountName, []],
        bankName: [record.bankName, []]
      })
    } else {
      this.form = this.fb.group({
        enableFpx: ['', []],
        enableCashOnArrival: ['', []],
        enableReceiptUpload: ['', []],
        bankDetailAttachmentPath: ['', []],
        bankAccountNumber: ['', []],
        bankAccountName: ['', []],
        bankName: ['', []],
      })
    }

    const formChanges = this.form.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const currData = this.sss.getShop(); const updatedData: Shop = { ...currData, ...value };
      this.sss.updateShop(updatedData);
    });

    this.dr.onDestroy(() => {
      formChanges.unsubscribe();
    });
  }

  get logoHyperlink(): string | null {
    const { bankDetailAttachmentPath } = this.sss.getShop();

    if (!bankDetailAttachmentPath)
      return null;

    return this.ss.getAttachmentAssetPath(bankDetailAttachmentPath);
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

    this.ss.uploadBankDetail(shop.id, formData).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.toastService.success('Maklumat bank berjaya dimuat naik!');
          this.uploadProgress = null;
          this.selectedFile = null;
          this.fileInput.nativeElement.value = ''; // reset input

          const filePath = event.body?.filePath;

          if (filePath) {
            const currData = this.sss.getShop();
            const updatedData: Shop = { ...currData, bankDetailAttachmentPath: filePath };
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
    this.ss.deleteBankDetail(id).subscribe({
      next: () => {
        this.toastService.info('Gambar berjaya dipadam');
        const currData = this.sss.getShop();
        const updatedData: Shop = { ...currData, bankDetailAttachmentPath: '' };
        this.sss.updateShop(updatedData);
      }
    });
  }

}
