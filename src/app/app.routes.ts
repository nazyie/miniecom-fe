import { Routes } from '@angular/router';
import { HomePage } from './home/components/home-page/home-page';
import { ShopPage } from './shop/components/shop-page/shop-page';

export const routes: Routes = [
  { path: 'kedai', component: ShopPage },
  { path: '', component: HomePage },
  { path: 'sales', component: HomePage },
  { path: 'order', component: HomePage },
  { path: 'laman', component: HomePage },
  { path: 'tetapan', component: HomePage },
];
