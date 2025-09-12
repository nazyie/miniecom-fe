import { Component, DestroyRef, OnInit } from '@angular/core';
import { AdminLayout } from "../../../common/components/admin-layout/admin-layout";
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-page',
  imports: [AdminLayout, FormsModule],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css'
})
export class ProductPage implements OnInit{
  titlePage: string = 'Produk';

  search: string = '';
  search$ = new Subject<string>();

  constructor(
    private destroyRef: DestroyRef
  ) {

  }
  
  ngOnInit(): void {
    const searchChanges = this.search$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => console.log('hello'));

    this.destroyRef.onDestroy(() => {
      searchChanges.unsubscribe();
    })
  }

  openAddProductModal() {

  }

}
