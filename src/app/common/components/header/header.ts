import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  securityService!: SecurityService;

  constructor(
    private router: Router,
    securityService: SecurityService
  ) {
    this.securityService = securityService;
  }

  get isRootPath(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }

  logout() {
    this.securityService.logout().subscribe({
      next: (res) => {
        console.log('Logout');
      },
      complete: () => {
        this.router.navigateByUrl('/', { replaceUrl: true })
      }
    })
  }

}
