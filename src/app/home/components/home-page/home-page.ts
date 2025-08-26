import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { TrustedUser } from '../trusted-user/trusted-user';
import { Feature } from '../feature/feature';
import { Preview } from '../preview/preview';

@Component({
  selector: 'app-home-page',
  imports: [Hero, TrustedUser, Feature, Preview],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
}
