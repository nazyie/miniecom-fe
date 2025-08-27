import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toaster } from "./common/components/toaster/toaster";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'mini-ecommerce';
}
