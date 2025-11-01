import { HttpClient, HttpEvent } from '@angular/common/http';
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
    return this.http.patch<Shop>(`${this.apiRoute}/${shop.id}`, shop);
  }

  deleteShop(shopId: string): Observable<Shop> {
    return this.http.delete<Shop>(this.apiRoute + '/' + shopId);
  }

  uploadLogo(shopId: string, formData: FormData): Observable<HttpEvent<{ filePath: string}>> {
    return this.http.post<{filePath: string}>(
      `${this.apiRoute}/${shopId}/upload/logo`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  getAttachmentAssetPath(path: string) {
    return `${environment.apiUrl}/image/${path}`;
  }

  deleteLogo(shopId: string) {
    return this.http.delete<Shop>(`${this.apiRoute}/${shopId}/upload/logo/delete`);
  }

  uploadBankDetail(shopId: string, formData: FormData): Observable<HttpEvent<{filePath: string}>> {
    return this.http.post<{filePath: string}>(
      `${this.apiRoute}/${shopId}/upload/bank`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  deleteBankDetail(shopId: string) {
    return this.http.delete<Shop>(`${this.apiRoute}/${shopId}/upload/bank/delete`);
  }

  get getBaseUrl(): string {
    return this.domain;
  }

  checkSlug(shopId: string, slug: string) : Observable<boolean> {
    return this.http.get<boolean>(`${this.apiRoute}/${shopId}/check/slug/${slug}`);
  }

}
