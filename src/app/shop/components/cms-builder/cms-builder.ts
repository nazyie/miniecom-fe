import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cms-builder',
  standalone: true,
  imports: [],
  templateUrl: './cms-builder.html',
  styleUrl: './cms-builder.css',
})
export class CmsBuilder {
  @Input() catalogueId!: string;

}
