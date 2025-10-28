import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CatalogueAttachment } from '../../../../catalogue/model/catalogue-modal';
import { BookingService } from '../../../service/booking-service';

@Component({
  selector: 'app-facility-attachment',
  imports: [],
  templateUrl: './facility-attachment.html',
  styleUrl: './facility-attachment.css'
})
export class FacilityAttachment implements OnInit {
  catalogueAttachment: CatalogueAttachment[] | null = null;
  selectionIndex: number = 0;

  @Input() catalogueId!: string;
  @Output() closeDialogEvent = new EventEmitter<boolean>();

  constructor(
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    if (this.catalogueId) {
      console.log('this is', this.catalogueId);
      this.loadCatalogueImageList();
    }
  }

  getAttachmentPath(path: string) {
    return this.bookingService.getAttachmentAssetPath(path);
  }

  loadCatalogueImageList() {
    this.bookingService.getFacilityAttachment(this.catalogueId).subscribe({
      next: (res) => {
        this.catalogueAttachment = res;
      }
    })
  }

  nextImage() {
    if (this.catalogueAttachment && this.catalogueAttachment.length > 0) {
      if (this.selectionIndex < this.catalogueAttachment.length - 1) {
        this.selectionIndex++;
      } else {
        this.selectionIndex = 0; // loop back to first
      }
    }
  }

  prevImage() {
    if (this.catalogueAttachment && this.catalogueAttachment.length > 0) {
      if (this.selectionIndex === 0) {
        this.selectionIndex = this.catalogueAttachment.length - 1; // loop to last
      } else {
        this.selectionIndex--;
      }
    }
  }

  closeDialog() {
    this.closeDialogEvent.emit(true);
  }


}
