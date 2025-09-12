import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-navigation-bar.html',
  styleUrl: './bottom-navigation-bar.css'
})
export class BottomNavigationBar {
}
