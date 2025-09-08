import { Injectable } from "@angular/core";
import { ResponseShopDropdown } from "../../shop/model/shop.model";

@Injectable({
  providedIn: 'root'
})
export class ShopNavigatorService {
    private currentShop : ResponseShopDropdown | null = null;

    constructor() {
        // TODO: implement the session storage information setup
    }

    loadCurrentShop(selectedShop: ResponseShopDropdown) {
        this.currentShop = selectedShop;
    }

    get shopName() : string {
        if (this.currentShop === null) {
            return 'Pilih Kedai'
        }
        return this.currentShop.name;
    }

    get shopId() : string | null {
        if (this.currentShop === null) {
            return null;
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