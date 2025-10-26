import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseEntitlementCard, TransactionHistoryModel } from "../model/configuration-model";
import { PageResponse } from "../../common/pagination.model";

@Injectable({
  providedIn: 'root'
})
export class EntitlementService {
  private apiRoute = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getEntitlement(): Observable<ResponseEntitlementCard> {
    return this.http.get<ResponseEntitlementCard>(`${this.apiRoute}/entitlement`);
  }

  getTransactionHistory(): Observable<PageResponse<TransactionHistoryModel>> {
    return this.http.get<PageResponse<TransactionHistoryModel>>(`${this.apiRoute}/transaction/history?page=0&size=10`);
  }

}
