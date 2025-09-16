import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Inventory, InventoryStock } from '../model/inventory-modal';
import { PageResponse } from '../../common/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiRoute = environment.apiUrl + '/inventory'

  constructor(
    private http: HttpClient,
  ) { }

  getInventory(page = 0, size = 20, shopId: string, search: string): Observable<PageResponse<Inventory>> {
    return this.http.get<PageResponse<Inventory>>(`${this.apiRoute}?shopId=${shopId}&page=${page}&size=${size}&search=${search}`);
  }

  createInventory(shopId : string, inventory: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.apiRoute}?shopId=${shopId}`, inventory);
  }

  updateInventory(shopId: string, inventory: Inventory): Observable<Inventory> {
    return this.http.patch<Inventory>(`${this.apiRoute}/${inventory.id}?shopId=${shopId}`, inventory);
  }

  deleteInventory(shopId: string, inventoryId: string): Observable<Inventory> {
    return this.http.delete<Inventory>(`${this.apiRoute}/${inventoryId}?shopId=${shopId}`);
  }

  // get variant

  getVariant(inventoryId: string): Observable<InventoryStock[]> {
    return this.http.get<InventoryStock[]>(`${this.apiRoute}-stock/${inventoryId}`);
  }

  createVariant(inventoryId: string, stock: InventoryStock): Observable<void> {
    return this.http.post<void>(`${this.apiRoute}-stock/${inventoryId}`, stock);
  }

  updateVariant(inventoryId:string, stock: InventoryStock): Observable<InventoryStock> {
    return this.http.patch<InventoryStock>(`${this.apiRoute}-stock/${inventoryId}/${stock.id}`, stock);
  }

  deleteVariant(inventoryId:string, stockId: string): Observable<InventoryStock> {
    return this.http.delete<InventoryStock>(`${this.apiRoute}-stock/${inventoryId}/${stockId}`);
  }
}
