import { Component, Input } from '@angular/core';
import { Header } from "../header/header";
import { BottomNavigationBar } from "../../../component/bottom-navigation-bar/bottom-navigation-bar";
import { ɵEmptyOutletComponent } from "../../../../../node_modules/@angular/router/router_module.d-dBTUdUNJ";

@Component({
  selector: 'app-admin-layout',
  imports: [Header, BottomNavigationBar, ɵEmptyOutletComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  @Input() title!: string;

}
