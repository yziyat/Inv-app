import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-users',
  template: `
    <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">User Management</h1>
      <p class="text-gray-600 dark:text-gray-300">This feature is under construction. Admins will be able to add, edit, and remove users from this page.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {}
