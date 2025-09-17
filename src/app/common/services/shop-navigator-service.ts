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
        const shopSelector = sessionStorage.getItem('shopSelector');

        if (shopSelector) {
            this.currentShop = JSON.parse(shopSelector);

            if (this.currentShop) {
                this.currentShop$.next(this.currentShop);
            }
        }
    }

    loadCurrentShop(selectedShop: ResponseShopDropdown) {
        this.currentShop = selectedShop;
        this.currentShop$.next(this.currentShop);
        this.saveToSessionStorage();
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

    get shopOpen() : boolean {
        if (this.currentShop === null) {
            return false;
        }
        return this.currentShop.openShop;
    }

    get shopType() : string | null {
        if (this.currentShop === null) {
            return null;
        }
        return this.currentShop.shopType;
    }

    saveToSessionStorage() {
        sessionStorage.setItem('shopSelector', JSON.stringify(this.currentShop));
    }
}