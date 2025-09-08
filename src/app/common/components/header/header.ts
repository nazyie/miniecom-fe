import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security-service';
import { AsyncPipe } from '@angular/common';
import { ResponseShopDropdown } from '../../../shop/model/shop.model';
import { ShopService } from '../../../shop/services/shop-service';
import { Observable } from 'rxjs';
import { ShopNavigatorService } from '../../services/shop-navigator-service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  securityService!: SecurityService;
  shopNavigatorService!: ShopNavigatorService;
  listOfShop$!: Observable<ResponseShopDropdown[]>;

  constructor(
    private router: Router,
    private shopService: ShopService, 
    shopNavigatorService: ShopNavigatorService,
    securityService: SecurityService
  ) {
    this.securityService = securityService;
    this.shopNavigatorService = shopNavigatorService;
  }

  ngOnInit(): void {
    this.listOfShop$ = this.shopService.getAllShop();
  }

  navigateSelectedShop(shop: ResponseShopDropdown) {
    this.shopNavigatorService.loadCurrentShop(shop);
  }

  get isRootPath(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }

  logout() {
    this.securityService.logout().subscribe({
      next: (res) => {
        console.log('Logout');
      },
      complete: () => {
        this.router.navigateByUrl('/', { replaceUrl: true })
      }
    })
  }

}
