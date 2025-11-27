import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-reports',
  template: `
    <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Reports & Analysis</h1>
      <p class="text-gray-600 dark:text-gray-300">This feature is under construction. Detailed stock reports with drill-down capabilities will be available here.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {}
