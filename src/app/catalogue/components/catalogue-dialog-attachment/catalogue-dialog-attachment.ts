import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogueAttachment } from '../../model/catalogue-modal';
import { InventoryService } from '../../services/catalogue-service';
import { CataloguePageService } from '../../services/catalogue-page-service';
import { ToastService } from '../../../common/services/toast-service';

@Component({
  selector: 'app-catalogue-dialog-attachment',
  imports: [ReactiveFormsModule],
  templateUrl: './catalogue-dialog-attachment.html',
  styleUrl: './catalogue-dialog-attachment.css'
})
export class CatalogueDialogAttachment implements OnInit{
  form: FormGroup = new FormGroup({});
  selectedFile !: File;
  data: CatalogueAttachment[] = [];

  constructor(
    private cp: CataloguePageService,
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.form = this.fb.group({
      file: [null, Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Fail melebihi 2MB!');
        this.form.get('file')?.reset();
        return;
      }
      this.selectedFile = file;
      this.form.patchValue({ file });
      this.form.get('file')?.updateValueAndValidity();
    }
  }

  uploadImage(): void {
    if (!this.form.valid || !this.selectedFile) {
      this.toastService.error('Invalid file');
      return;
    }
  }

  loadData() {
    if (this.cp.catalogue) {
    this.inventoryService.getInventoryAttachment(this.cp.catalogue.id).subscribe({
      next: (res) => {
        this.data = res;
      }
    });
    }
  }

}
