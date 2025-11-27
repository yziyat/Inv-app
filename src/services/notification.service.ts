import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/inventory.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  toasts = signal<Toast[]>([]);

  showSuccess(message: string, duration = 3000) {
    this.addToast(message, 'success', duration);
  }

  showError(message: string, duration = 5000) {
    this.addToast(message, 'error', duration);
  }

  private addToast(message: string, type: 'success' | 'error' | 'info', duration: number) {
    const newToast: Toast = {
      id: Date.now(),
      message,
      type,
      duration
    };

    this.toasts.update(currentToasts => [...currentToasts, newToast]);

    setTimeout(() => {
      this.removeToast(newToast.id);
    }, duration);
  }

  removeToast(id: number) {
    this.toasts.update(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }
}
