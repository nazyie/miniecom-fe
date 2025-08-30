import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  constructor(private router: Router,
    private securityService: SecurityService
  ) {
  }

  get isRootPath(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }

  logout() {
    this.securityService.logout();
  }

}
