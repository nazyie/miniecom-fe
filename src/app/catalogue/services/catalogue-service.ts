import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Catalogue, CatalogueAttachment, CatalogueVariant } from '../model/catalogue-modal';
import { PageResponse } from '../../common/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiRoute = environment.apiUrl + '/catalogue'

  constructor(
    private http: HttpClient,
  ) { }

  getInventory(page = 0, size = 20, shopId: string, search: string): Observable<PageResponse<Catalogue>> {
    return this.http.get<PageResponse<Catalogue>>(`${this.apiRoute}?shopId=${shopId}&page=${page}&size=${size}&search=${search}`);
  }

  createInventory(shopId: string, inventory: Catalogue): Observable<Catalogue> {
    return this.http.post<Catalogue>(`${this.apiRoute}?shopId=${shopId}`, inventory);
  }

  updateInventory(shopId: string, inventory: Catalogue): Observable<Catalogue> {
    return this.http.patch<Catalogue>(`${this.apiRoute}/${inventory.id}?shopId=${shopId}`, inventory);
  }

  deleteInventory(shopId: string, inventoryId: string): Observable<Catalogue> {
    return this.http.delete<Catalogue>(`${this.apiRoute}/${inventoryId}?shopId=${shopId}`);
  }

  getInventoryAttachment(inventoryId: string): Observable<CatalogueAttachment[]> {
    return this.http.get<CatalogueAttachment[]>(`${this.apiRoute}/${inventoryId}/attachment`);
  }

  uploadAttachment(inventoryId: string, formData: FormData): Observable<HttpEvent<void>> {
    return this.http.post<void>(
      `${this.apiRoute}/${inventoryId}/attachment`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }


  // get variant

  getVariant(inventoryId: string): Observable<CatalogueVariant[]> {
    return this.http.get<CatalogueVariant[]>(`${this.apiRoute}-variant/${inventoryId}`);
  }

  createVariant(inventoryId: string, stock: CatalogueVariant): Observable<void> {
    return this.http.post<void>(`${this.apiRoute}-variant/${inventoryId}`, stock);
  }

  updateVariant(inventoryId: string, stock: CatalogueVariant): Observable<CatalogueVariant> {
    return this.http.patch<CatalogueVariant>(`${this.apiRoute}-variant/${inventoryId}/${stock.id}`, stock);
  }

  deleteVariant(inventoryId: string, stockId: string): Observable<CatalogueVariant> {
    return this.http.delete<CatalogueVariant>(`${this.apiRoute}-variant/${inventoryId}/${stockId}`);
  }

}
