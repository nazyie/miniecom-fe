import { Routes } from '@angular/router';
import { HomePage } from './home/components/home-page/home-page';
import { ShopPage } from './shop/components/shop-page/shop-page';
import { authGuard } from './common/guard/auth-guard';
import { InventoryPage } from './inventory/components/inventory-page/inventory-page';

// to tranform to lazy load later
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'kedai', component: ShopPage, canActivate: [authGuard] },
  { path: 'sales', component: HomePage },
  { path: 'order', component: HomePage },
  { path: 'inventori', component: InventoryPage, canActivate: [authGuard] },
  { path: 'tetapan', component: HomePage },
];
