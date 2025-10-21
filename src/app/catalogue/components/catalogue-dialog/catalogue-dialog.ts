import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalogue-dialog',
  imports: [],
  templateUrl: './catalogue-dialog.html',
  styleUrl: './catalogue-dialog.css'
})
export class CatalogueDialog {
  @Input() formTitle: string = 'Cipta Catalogue';

}
