import { Component, Input } from '@angular/core';
import { Header } from "../header/header";
import { BottomNavigationBar } from "../bottom-navigation-bar/bottom-navigation-bar";

@Component({
  selector: 'app-admin-layout',
  imports: [Header, BottomNavigationBar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  @Input() title!: string;

}
