import { Component, OnInit } from '@angular/core';
import { AdminLayout } from "../../../common/components/admin-layout/admin-layout";
import { ChangePassword } from "../change-password/change-password";
import { UpdateProfile } from "../update-profile/update-profile";
import { EntitlementService } from '../../service/entitlement-service';
import { ResponseEntitlementCard } from '../../model/configuration-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-configuration-page',
  imports: [AdminLayout, ChangePassword, UpdateProfile],
  templateUrl: './configuration-page.html',
  styleUrl: './configuration-page.css'
})
export class ConfigurationPage implements OnInit{
  titlePage: string = 'Tetapan'

  card: ResponseEntitlementCard | null = null;

  constructor(
    private entitlementService: EntitlementService
  ) {}

  ngOnInit(): void {
    this.entitlementService.getEntitlement().subscribe({
      next: (res) => {
        if (res) {
          const response = res;
          response.tier = response.tier.replace(/_/g, ' ');
          this.card = response;
        }
      },
    })
  }

}
