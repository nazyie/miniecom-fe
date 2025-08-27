import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toaster',
  imports: [AsyncPipe],
  templateUrl: './toaster.html',
  styleUrl: './toaster.css'
})
export class Toaster {
  private toastService = inject(ToastService);

  toasts$ = this.toastService.toasts$;

  remove(id: number) {
    this.toastService.remove(id);
  }

}
