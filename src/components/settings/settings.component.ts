import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Application Settings</h1>
      <p class="text-gray-600 dark:text-gray-300">This feature is under construction. Global settings like language, date format, and dropdown list management will be configured here.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {}
