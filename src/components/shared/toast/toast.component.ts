import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { Toast } from '../../../models/inventory.models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  notificationService = inject(NotificationService);
  sanitizer = inject(DomSanitizer);
  toasts = this.notificationService.toasts;

  getIcon(type: 'success' | 'error' | 'info'): SafeHtml {
    let svgString: string;
    switch (type) {
      case 'success':
        svgString = `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
        break;
      case 'error':
        svgString = `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        break;
      default:
        svgString = '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

  getBackgroundColor(type: 'success' | 'error' | 'info'): string {
    switch(type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  }

  removeToast(id: number) {
    this.notificationService.removeToast(id);
  }
}