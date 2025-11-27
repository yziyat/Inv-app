import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { MovementsComponent } from './components/movements/movements.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UsersComponent } from './components/users/users.component';
import { SettingsComponent } from './components/settings/settings.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

export const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'articles', component: ArticlesComponent },
      { path: 'movements', component: MovementsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [adminGuard] },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
