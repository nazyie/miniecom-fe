import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  imports: [],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.css'
})
export class NavigationBar {
  @Input() primaryColor: string = '#570df8';

}
