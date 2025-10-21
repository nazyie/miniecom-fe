import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CataloguePageService } from '../../services/catalogue-page-service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-catalogue-dialog-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './catalogue-dialog-detail.html',
  styleUrl: './catalogue-dialog-detail.css'
})
export class CatalogueDialogDetail implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private cp: CataloguePageService,
    private dr: DestroyRef
  ) {
  }

  ngOnInit(): void {
    if (!this.cp.catalogue) {
      this.form = this.fb.group({
        id: [''],
        name: ['', [Validators.required]],
        itemDescription: [''],
        publish: [true],
      });
    } else {
      this.form = this.fb.group({
        id: [this.cp.catalogue.id, []],
        name: [this.cp.catalogue.name, [Validators.required]],
        itemDescription: [this.cp.catalogue.itemDescription, []],
        publish: [this.cp.catalogue.publish, []],
      })
    }

    const formChanges = this.form.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const currData = this.cp.catalogue;
      const updatedData = { ...currData, ...value };

      this.cp.updateCatalogue(updatedData);
    });

    this.dr.onDestroy(() => {
      formChanges.unsubscribe();
    })
  }
}
