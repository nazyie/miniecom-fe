import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogueAttachment } from '../../model/catalogue-modal';
import { InventoryService } from '../../services/catalogue-service';

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

  @Input()
  inventoryId: string | undefined = '';

  @Output()
  outputDialogAction = new EventEmitter<boolean>();

  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder
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
      alert('Sila pilih fail terlebih dahulu.');
      return;
    }
  }

  loadData() {
    if (this.inventoryId) {
      this.inventoryService.getInventoryAttachment(this.inventoryId).subscribe({
        next: (res) => {
          this.data = res;
        }
      });
    }
  }

  close() {
    this.outputDialogAction.emit(false);
  }

}
