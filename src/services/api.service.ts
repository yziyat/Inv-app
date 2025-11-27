import { Injectable, signal } from '@angular/core';
import { Article, Movement, User, AppSettings } from '../models/inventory.models';

const MOCK_USERS: User[] = [
  { id: 1, username: 'admin', password: 'admin123', firstName: 'Admin', lastName: 'Istrator', role: 'admin' },
  { id: 2, username: 'editor', password: 'editor123', firstName: 'Edi', lastName: 'Tor', role: 'editor' },
  { id: 3, username: 'viewer', password: 'viewer123', firstName: 'View', lastName: 'Er', role: 'viewer' },
];

const MOCK_SETTINGS: AppSettings = {
  categories: ['Electronics', 'Accessories', 'Cables', 'Furniture', 'Office Supplies'],
  suppliers: ['Supplier A', 'Supplier B', 'Supplier C', 'Tech Imports'],
  destinations: ['Desk 5', 'Printer Room', 'Sales Department', 'Warehouse Section B'],
  outgoingSubcategories: ['Internal Use', 'Customer Sale', 'Project Allocation']
};

const MOCK_ARTICLES: Article[] = [
  { id: 1, name: 'Laptop Pro 15"', code: 'LP15', category: 'Electronics', unit: 'pcs', price: 1200, alert: 5, description: 'High-end laptop with 16GB RAM', createdAt: '2023-01-10', updatedAt: '2023-10-20', priceHistory: [{ price: 1200, date: '2023-01-10' }] },
  { id: 2, name: 'Wireless Mouse', code: 'WM01', category: 'Accessories', unit: 'pcs', price: 25, alert: 20, description: 'Ergonomic wireless mouse', createdAt: '2023-01-15', updatedAt: '2023-11-01', priceHistory: [{ price: 25, date: '2023-01-15' }] },
  { id: 3, name: 'USB-C Cable', code: 'UC03', category: 'Cables', unit: 'pcs', price: 10, alert: 50, description: '1m USB-C to USB-C cable', createdAt: '2023-02-01', updatedAt: '2023-09-15', priceHistory: [{ price: 10, date: '2023-02-01' }] },
  { id: 4, name: 'Office Chair', code: 'OC-BLK', category: 'Furniture', unit: 'pcs', price: 150, alert: 10, description: 'Ergonomic office chair, black', createdAt: '2023-03-05', updatedAt: '2023-08-22', priceHistory: [{ price: 150, date: '2023-03-05' }] },
  { id: 5, name: 'Printer Paper A4', code: 'PPA4', category: 'Office Supplies', unit: 'ream', price: 5, alert: 100, description: 'Pack of 500 sheets', createdAt: '2023-03-10', updatedAt: '2023-10-30', priceHistory: [{ price: 5, date: '2023-03-10' }] }
];

const MOCK_MOVEMENTS: Movement[] = [
    { id: '240521103000', articleId: 1, userId: 1, type: 'Entrée', quantity: 15, date: '2024-05-21', supplierDest: 'Supplier A' },
    { id: '240521094510', articleId: 2, userId: 2, type: 'Sortie', quantity: -2, date: '2024-05-21', supplierDest: 'Desk 5' },
    { id: '240520162030', articleId: 3, userId: 1, type: 'Entrée', quantity: 200, date: '2024-05-20', supplierDest: 'Supplier B' },
    { id: '240520141005', articleId: 5, userId: 2, type: 'Sortie', quantity: -10, date: '2024-05-20', supplierDest: 'Printer Room' },
    { id: '240519110000', articleId: 4, userId: 1, type: 'Entrée', quantity: 1, date: '2024-05-19', supplierDest: 'Supplier C', remarks: 'Damaged item return' },
    { id: '240518083000', articleId: 2, userId: 1, type: 'Entrée', quantity: 20, date: '2024-05-18', supplierDest: 'Supplier C' },
    { id: '240517083000', articleId: 1, userId: 2, type: 'Sortie', quantity: -5, date: '2024-05-17', supplierDest: 'Sales Department' },
];

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private users = signal<User[]>(MOCK_USERS);
  private settings = signal<AppSettings>(MOCK_SETTINGS);
  private articles = signal<Article[]>(MOCK_ARTICLES);
  private movements = signal<Movement[]>(MOCK_MOVEMENTS);

  // Public readonly signals
  users$ = this.users.asReadonly();
  settings$ = this.settings.asReadonly();
  articles$ = this.articles.asReadonly();
  movements$ = this.movements.asReadonly();

  // --- Article Methods ---

  getArticleById(id: number): Article | undefined {
    return this.articles$().find(a => a.id === id);
  }
  
  addArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'priceHistory'>): { success: boolean; message: string } {
    if (this.articles$().some(a => a.code.toLowerCase() === articleData.code.toLowerCase())) {
      return { success: false, message: `Article with code "${articleData.code}" already exists.` };
    }

    const newArticle: Article = {
      ...articleData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priceHistory: [{ price: articleData.price, date: new Date().toISOString() }],
    };
    
    this.articles.update(articles => [...articles, newArticle]);
    return { success: true, message: 'Article added successfully.' };
  }

  updateArticle(updatedArticle: Article): { success: boolean; message: string } {
    if (this.articles$().some(a => a.code.toLowerCase() === updatedArticle.code.toLowerCase() && a.id !== updatedArticle.id)) {
      return { success: false, message: `Another article with code "${updatedArticle.code}" already exists.` };
    }

    const currentArticle = this.getArticleById(updatedArticle.id);
    if (!currentArticle) {
      return { success: false, message: 'Article not found.' };
    }
    
    const priceChanged = currentArticle.price !== updatedArticle.price;
    const priceHistory = priceChanged 
      ? [...currentArticle.priceHistory, { price: updatedArticle.price, date: new Date().toISOString() }]
      : currentArticle.priceHistory;

    this.articles.update(articles => 
      articles.map(a => 
        a.id === updatedArticle.id 
          ? { ...updatedArticle, updatedAt: new Date().toISOString(), priceHistory } 
          : a
      )
    );
    return { success: true, message: 'Article updated successfully.' };
  }

  deleteArticle(id: number): { success: boolean; message: string } {
    const hasMovements = this.movements$().some(m => m.articleId === id);
    if (hasMovements) {
      return { success: false, message: 'Cannot delete article with existing movements.' };
    }

    this.articles.update(articles => articles.filter(a => a.id !== id));
    return { success: true, message: 'Article deleted successfully.' };
  }

  // --- Movement & Stock Methods ---
  
  getMovementsForArticle(articleId: number): Movement[] {
    return this.movements$().filter(m => m.articleId === articleId);
  }

  getArticleStock(articleId: number): number {
    return this.getMovementsForArticle(articleId)
      .reduce((stock, movement) => stock + movement.quantity, 0);
  }
}
