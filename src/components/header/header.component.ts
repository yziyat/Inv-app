import { Component, ChangeDetectionStrategy, inject, output, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService);
  toggleSidebar = output<void>();
  isProfileMenuOpen = signal(false);

  user = this.authService.currentUser;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
  
  onToggleProfileMenu() {
    this.isProfileMenuOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
