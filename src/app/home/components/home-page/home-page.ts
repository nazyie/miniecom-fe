import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { TrustedUser } from '../trusted-user/trusted-user';
import { Feature } from '../feature/feature';
import { Preview } from '../preview/preview';
import { Header } from "../../../common/components/header/header";

@Component({
  selector: 'app-home-page',
  imports: [Hero, TrustedUser, Feature, Preview, Header],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
}
