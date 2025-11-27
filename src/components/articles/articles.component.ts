import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Article, StockListItem } from '../../models/inventory.models';
import { ModalComponent } from '../shared/modal/modal.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { DecimalPipe } from '@angular/common';

type SortableFields = keyof StockListItem;

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  imports: [ReactiveFormsModule, ModalComponent, PaginationComponent, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent {
  // Services
  apiService = inject(ApiService);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  // State
  private articles = computed(() => 
    this.apiService.articles$().map(art => ({
      ...art,
      stock: this.apiService.getArticleStock(art.id)
    }))
  );
  categories = computed(() => this.apiService.settings$().categories);

  // Filtering
  searchTerm = signal('');
  selectedCategory = signal('');

  // Sorting
  sortColumn = signal<SortableFields>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);

  // Derived state for display
  filteredArticles = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    return this.articles().filter(article => {
      const nameMatch = article.name.toLowerCase().includes(term);
      const codeMatch = article.code.toLowerCase().includes(term);
      const categoryMatch = category ? article.category === category : true;
      return (nameMatch || codeMatch) && categoryMatch;
    });
  });

  sortedArticles = computed(() => {
    const sorted = [...this.filteredArticles()];
    const col = this.sortColumn();
    const dir = this.sortDirection();
    
    sorted.sort((a, b) => {
      const valA = a[col];
      const valB = b[col];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return dir === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
    return sorted;
  });

  paginatedArticles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.sortedArticles().slice(start, end);
  });
  
  totalItems = computed(() => this.filteredArticles().length);

  // Modal and Form State
  isModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  editingArticle = signal<Article | null>(null);
  articleToDelete = signal<Article | null>(null);

  articleForm = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    category: ['', Validators.required],
    unit: ['pcs', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    alert: [0, [Validators.required, Validators.min(0)]],
    description: [''],
  });

  // Methods
  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  onCategoryChange(event: Event) {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
  }

  setSort(column: SortableFields) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  openModal(article: Article | null) {
    this.editingArticle.set(article);
    if (article) {
      this.articleForm.patchValue(article);
    } else {
      this.articleForm.reset({ unit: 'pcs', price: 0, alert: 0 });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingArticle.set(null);
  }

  saveArticle() {
    if (this.articleForm.invalid) {
      return;
    }

    const formValue = this.articleForm.value;
    const articleData = {
      name: formValue.name!,
      code: formValue.code!,
      category: formValue.category!,
      unit: formValue.unit!,
      price: formValue.price!,
      alert: formValue.alert!,
      description: formValue.description!,
    };

    let result;
    if (this.editingArticle()) {
      const updatedArticle = { ...this.editingArticle()!, ...articleData };
      result = this.apiService.updateArticle(updatedArticle);
    } else {
      result = this.apiService.addArticle(articleData);
    }

    if (result.success) {
      this.notificationService.showSuccess(result.message!);
      this.closeModal();
    } else {
      this.notificationService.showError(result.message!);
    }
  }

  openDeleteModal(article: Article) {
    this.articleToDelete.set(article);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.articleToDelete.set(null);
  }

  confirmDelete() {
    if (this.articleToDelete()) {
      const result = this.apiService.deleteArticle(this.articleToDelete()!.id);
      if (result.success) {
        this.notificationService.showSuccess(result.message!);
      } else {
        this.notificationService.showError(result.message!);
      }
      this.closeDeleteModal();
    }
  }
}
