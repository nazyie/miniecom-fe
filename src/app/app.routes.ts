import { Routes } from '@angular/router';
import { HomePage } from './home/components/home-page/home-page';
import { ShopPage } from './shop/components/shop-page/shop-page';
import { authGuard } from './common/guard/auth-guard';
import { InventoryPage } from './catalogue/components/catalogue-page/catalogue-page';
import { ConfigurationPage } from './configuration/components/configuration-page/configuration-page';

// to tranform to lazy load later
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'kedai', component: ShopPage, canActivate: [authGuard] },
  { path: 'sales', component: HomePage },
  { path: 'order', component: HomePage },
  { path: 'katalog', component: InventoryPage, canActivate: [authGuard] },
  { path: 'tetapan', component: ConfigurationPage, canActivate: [authGuard] },
];
