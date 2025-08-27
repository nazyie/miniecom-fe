import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private counter = 0;

  show(type: ToastType, text: string, duration = 3000) {
    const id = ++this.counter;
    const toast: ToastMessage = { id, type, text };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    // Auto remove after duration
    setTimeout(() => this.remove(id), duration);
  }

  success(msg: string, duration = 3000) {
    this.show('success', msg, duration);
  }

  error(msg: string, duration = 3000) {
    this.show('error', msg, duration);
  }

  info(msg: string, duration = 3000) {
    this.show('info', msg, duration);
  }

  warning(msg: string, duration = 3000) {
    this.show('warning', msg, duration);
  }

  remove(id: number) {
    this.toastsSubject.next(
      this.toastsSubject.value.filter((t) => t.id !== id)
    );
  }
}
