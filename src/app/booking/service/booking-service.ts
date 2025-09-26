import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseFacility, ResponseShopDetail } from '../model/booking-page.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiRoute = environment.apiUrl + '/booking';
  private slug: string = '';

  constructor(
    private http: HttpClient
  ) {
    const host = window.location.hostname;
    this.slug = host.split('.')[0];
  }

  getShopDetail(): Observable<ResponseShopDetail> {
    return this.http.get<ResponseShopDetail>(`${this.apiRoute}/${this.slug}/shop`);
  }

  getFacility() : Observable<ResponseFacility[]> {
    return this.http.get<ResponseFacility[]>(`${this.apiRoute}/${this.slug}/facility/all`);
  }

  get getShopSlugFromUrl(): string {
    return this.slug;
  }
  
}
