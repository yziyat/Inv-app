import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { Article, Movement, StockListItem } from '../../models/inventory.models';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [DecimalPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private apiService = inject(ApiService);
  
  // State Signals from Service
  private articles = this.apiService.articles$;
  private movements = this.apiService.movements$;
  
  // KPIs
  totalArticles = computed(() => this.articles().length);
  
  lowStockArticles = computed(() => {
    return this.stockItems().filter(item => item.stock > 0 && item.stock <= item.alert).length;
  });

  totalStockValue = computed(() => {
    return this.stockItems().reduce((acc, item) => acc + (item.stock * item.price), 0);
  });

  // Table Data
  stockItems = computed<StockListItem[]>(() => {
    return this.articles()
      .map(article => ({
        ...article,
        stock: this.apiService.getArticleStock(article.id),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  recentMovements = computed(() => this.movements().slice(0, 5));

  articlesWithDetails = computed(() => {
    return this.recentMovements().map(mov => ({
      ...mov,
      articleName: this.apiService.getArticleById(mov.articleId)?.name || 'N/A'
    }));
  });

  getStockStatus(item: StockListItem): { text: string; color: string } {
    if (item.stock <= 0) {
      return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    }
    if (item.stock <= item.alert) {
      return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  }
}