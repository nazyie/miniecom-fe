import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  selectedFile !: File | null;
  data: CatalogueAttachment[] = [];

  @ViewChild('fileInput') fileInput !:ElementRef<HTMLInputElement>;

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


    if (this.cp.catalogue) {
      const formData = new FormData();
      formData.append('file', this.form.value.file);

      this.inventoryService.uploadAttachment(this.cp.catalogue?.id, formData).subscribe({
        next: () => {
        },
        complete: () => {
          this.toastService.info('File uploaded');
          this.loadData();
          this.form.get('file')?.setValue(null);
          this.fileInput.nativeElement.value = '';
        }
      })
    }
  }

  getImage(path: string) {
    let result = this.inventoryService.getAttachmentAssetPath(path);

    console.log(result);

    return result;
  }

  markImageAsPrimary(fileId: string) : void {
    if (this.cp.catalogue) {
      this.inventoryService.markAttachmentAsPrimary(this.cp.catalogue.id, fileId).subscribe({
        next: () => {
          this.loadData();
        }
      })
    }
  }

  deleteImage(fileId: string): void {
    if (this.cp.catalogue) {
      this.inventoryService.deleteAttachment(this.cp.catalogue.id, fileId).subscribe({
        next: () => {
          this.loadData();
        }
      })
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
