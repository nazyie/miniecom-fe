import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../../common/pagination.model';
import { ResponseShopDropdown, Shop } from '../model/shop.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private domain = environment.domain;
  private apiRoute = environment.apiUrl + '/shop'

  constructor(private http: HttpClient) { }

  getShop(page = 0, size = 20, search: string): Observable<PageResponse<Shop>> {
    return this.http.get<PageResponse<Shop>>(`${this.apiRoute}?page=${page}&size=${size}&search=${search}`);
  }

  getAllShop() {
    return this.http.get<ResponseShopDropdown[]>(`${this.apiRoute}/all`);
  }

  createShop(shop: Shop): Observable<Shop> {
    return this.http.post<Shop>(this.apiRoute, shop);
  }

  updateShop(shop: Shop): Observable<Shop> {
    return this.http.patch<Shop>(this.apiRoute + `/${shop.id}`, shop);
  }

  deleteShop(shopId: string): Observable<Shop> {
    return this.http.delete<Shop>(this.apiRoute + '/' + shopId);
  }

  get getBaseUrl(): string {
    return this.domain;
  }

  checkSlug(shopId: string, slug: string) : Observable<boolean> {
    return this.http.get<boolean>(`${this.apiRoute}/${shopId}/check/slug/${slug}`);
  }

}
