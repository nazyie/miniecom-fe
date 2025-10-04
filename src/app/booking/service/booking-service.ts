import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestBookedFacility, RequestBookingFacility, RequestTemporaryBooking, ResponseBookedFacility, ResponseBookingFacility, ResponseFacility, ResponseShopDetail } from '../model/booking-page.model';
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

  getBookedFacility(payload: RequestBookedFacility) : Observable<ResponseBookedFacility[]> {
    return this.http.post<ResponseBookedFacility[]>(`${this.apiRoute}/${this.slug}/facility/booked`, payload);
  }

  createTemporaryBooking(payload: RequestTemporaryBooking) : Observable<void> {
    return this.http.post<void>(`${this.apiRoute}/${this.slug}`, payload);
  }

  cancelTemporaryBooking(sessionId: string) : Observable<void> {
    return this.http.delete<void>(`${this.apiRoute}/${this.slug}/${sessionId}`);
  }

  confirmBooking(payload: RequestBookingFacility) : Observable<ResponseBookingFacility> {
    return this.http.post<ResponseBookingFacility>(`${this.apiRoute}/${this.slug}/confirm`, payload);
  }

  get getShopSlugFromUrl(): string {
    return this.slug;
  }
  
}
