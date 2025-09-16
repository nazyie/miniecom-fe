import { Injectable } from "@angular/core";
import { ResponseShopDropdown } from "../../shop/model/shop.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShopNavigatorService {
    private currentShop : ResponseShopDropdown | null = null;
    currentShop$ = new Subject<ResponseShopDropdown>();

    constructor() {
        // TODO: implement the session storage information setup
    }

    loadCurrentShop(selectedShop: ResponseShopDropdown) {
        this.currentShop = selectedShop;
        this.currentShop$.next(this.currentShop);
    }

    get shopName() : string {
        if (this.currentShop === null) {
            return 'Pilih Kedai'
        }
        return this.currentShop.name;
    }

    get shopId() : string {
        if (this.currentShop === null) {
            return 'not-selected-shop';
        }
        return this.currentShop.id;
    }

    get shopObject() : ResponseShopDropdown | null{
        if (this.currentShop === null) {
            return null;
        }
        return this.currentShop;
    }
}