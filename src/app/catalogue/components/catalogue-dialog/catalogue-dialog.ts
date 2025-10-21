import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Catalogue } from '../../model/catalogue-modal';
import { CataloguePageService } from '../../services/catalogue-page-service';
import { CatalogueDialogDetail } from "../catalogue-dialog-detail/catalogue-dialog-detail";
import { CatalogueDialogTime } from "../catalogue-dialog-time/catalogue-dialog-time";
import { CatalogueDialogAttachment } from "../catalogue-dialog-attachment/catalogue-dialog-attachment";

@Component({
  selector: 'app-catalogue-dialog',
  imports: [CatalogueDialogDetail, CatalogueDialogTime, CatalogueDialogAttachment],
  templateUrl: './catalogue-dialog.html',
  styleUrl: './catalogue-dialog.css'
})
export class CatalogueDialog implements OnInit {
  @Input() formTitle: string = 'Cipta Catalogue';
  @Input() submitLabel: string = 'Cipta';
  @Input() formMode: string = 'CREATE';
  @Input() record: Catalogue | undefined;

  @Output() formSubmitted = new EventEmitter<{ formMode: string, data: any }>();

  formNavigationCount: number = 0;

  constructor(
    private cataloguePageService: CataloguePageService
  ) {}

  ngOnInit(): void {
    this.cataloguePageService.constructCatalogueValue(this.record);
  }

  navigatePage(pageIndex: number) {
    this.formNavigationCount = pageIndex;
  }

  submit() {
    const payload = this.cataloguePageService.catalogue;

    console.log(payload);

    // perform the validation before submit

    // this.formSubmitted.emit({
    //   formMode: this.formMode,
    //   data: payload
    // });
  }

  delete() {
    this.formSubmitted.emit({
      formMode: 'DELETE',
      data: this.record?.id
    });
  }

  close() {
    this.formSubmitted.emit({
      formMode: 'CANCEL',
      data: null
    })
  }

}
