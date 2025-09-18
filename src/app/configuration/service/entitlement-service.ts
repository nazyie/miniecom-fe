import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseEntitlementCard } from "../model/configuration-model";

@Injectable({
  providedIn: 'root'
})
export class EntitlementService {
  private apiRoute = environment.apiUrl + '/entitlement'

  constructor(
    private http: HttpClient
  ) { }

  getEntitlement(): Observable<ResponseEntitlementCard> {
    return this.http.get<ResponseEntitlementCard>(`${this.apiRoute}`);
  }

}
