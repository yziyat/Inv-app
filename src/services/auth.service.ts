import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/inventory.models';

const CURRENT_USER_KEY = 'inventory_app_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // FIX: Add explicit type annotation for Router to fix type inference issue.
  private router: Router = inject(Router);

  currentUser = signal<User | null>(this.getStoredUser());

  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isEditor = computed(() => this.currentUser()?.role === 'editor' || this.currentUser()?.role === 'admin');
  isViewer = computed(() => this.currentUser()?.role === 'viewer');

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  }

  // FIX: Implement mock authentication locally to remove dependency on missing ApiService.
  private authenticateUser(username: string, password: string): User | null {
    // Mock users - in a real app, this would be a call to a backend
    const MOCK_USERS: User[] = [
      { id: 1, username: 'admin', password: 'admin123', firstName: 'Admin', lastName: 'Istrator', role: 'admin' },
      { id: 2, username: 'editor', password: 'editor123', firstName: 'Edi', lastName: 'Tor', role: 'editor' },
      { id: 3, username: 'viewer', password: 'viewer123', firstName: 'View', lastName: 'Er', role: 'viewer' },
    ];
    
    const foundUser = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (foundUser) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = foundUser;
        return userWithoutPassword as User;
    }
    return null;
  }

  login(username: string, password: string, rememberMe: boolean): boolean {
    const user = this.authenticateUser(username, password);
    if (user) {
      this.currentUser.set(user);
      if (rememberMe) {
         if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
         }
      }
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
    this.router.navigate(['/login']);
  }
}
