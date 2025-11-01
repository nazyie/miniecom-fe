import { Injectable } from "@angular/core";
import { initialShop, Shop } from "../model/shop.model";

@Injectable({
  providedIn: 'root'
})
export class ShopStateService {
    shop!: Shop;

    constructor() {}

    constructShop(shop: Shop | null | undefined) : void {
        if (shop) {
            this.shop = shop;
        } else {
            this.shop = initialShop;
        }
    }

    updateShop(shop: Shop) : void {
        this.shop = shop;
    }

    getShop() : Shop {
        return this.shop;
    }

}