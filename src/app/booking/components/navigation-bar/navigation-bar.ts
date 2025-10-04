import { Component, Input } from '@angular/core';
import { ResponseShopDetail } from '../../model/booking-page.model';

@Component({
  selector: 'app-navigation-bar',
  imports: [],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.css'
})
export class NavigationBar {
  @Input() primaryColor: string = '#570df8';
  @Input() shopDetail: ResponseShopDetail | null = null;

}
