import { Component } from '@angular/core';
import { AdminLayout } from "../../../common/components/admin-layout/admin-layout";
import { ChangePassword } from "../change-password/change-password";
import { UpdateProfile } from "../update-profile/update-profile";

@Component({
  selector: 'app-configuration-page',
  imports: [AdminLayout, ChangePassword, UpdateProfile],
  templateUrl: './configuration-page.html',
  styleUrl: './configuration-page.css'
})
export class ConfigurationPage {
  titlePage: string = 'Tetapan'

}
