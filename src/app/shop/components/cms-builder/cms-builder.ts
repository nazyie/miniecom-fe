import { Component, Input } from '@angular/core';
import { CmsLayout } from './cms-layout/cms-layout';

@Component({
  selector: 'app-cms-builder',
  standalone: true,
  imports: [CmsLayout],
  templateUrl: './cms-builder.html',
  styleUrl: './cms-builder.css',
})
export class CmsBuilder {
  @Input() catalogueId!: string;

  formMode: 'LAYOUT' | 'WIDGET'  = 'LAYOUT';
}
