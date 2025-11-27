import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  // FIX: Add explicit type annotation for FormBuilder to fix type inference issue.
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  // FIX: Add explicit type annotation for Router to fix type inference issue.
  private router: Router = inject(Router);

  error = signal<string | null>(null);

  loginForm = this.fb.group({
    username: ['admin', Validators.required],
    password: ['admin123', Validators.required],
    rememberMe: [true]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password, rememberMe } = this.loginForm.value;
      const success = this.authService.login(username!, password!, rememberMe!);
      
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Invalid username or password.');
      }
    }
  }
}
