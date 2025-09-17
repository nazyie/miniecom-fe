import { Component } from '@angular/core';
import { AdminLayout } from "../../../common/components/admin-layout/admin-layout";

@Component({
  selector: 'app-configuration-page',
  imports: [AdminLayout],
  templateUrl: './configuration-page.html',
  styleUrl: './configuration-page.css'
})
export class ConfigurationPage {
  titlePage: string = 'Tetapan'

}
