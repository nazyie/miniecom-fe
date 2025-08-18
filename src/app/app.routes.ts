import { Routes } from '@angular/router';
import { ShopPage } from './page/shop-page/shop-page';
import { HomePage } from './page/home-page/home-page';

export const routes: Routes = [
  { path: 'kedai', component: ShopPage },
  { path: '', component: HomePage },
  { path: 'sales', component: HomePage },
  { path: 'order', component: HomePage },
  { path: 'laman', component: HomePage },
  { path: 'tetapan', component: HomePage },
];
