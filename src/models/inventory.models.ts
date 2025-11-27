export interface Article {
  id: number;
  name: string;
  code: string;
  category: string;
  unit: string;
  price: number;
  alert: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  priceHistory: { price: number; date: string }[];
}

export interface StockListItem extends Article {
  stock: number;
}

export interface Movement {
  id: string; // JJMMYYHHMMSS
  articleId: number;
  userId: number;
  type: 'Entrée' | 'Sortie' | 'Ajustement' | 'Périmé / Rebut';
  quantity: number;
  date: string; // AAAA-MM-JJ
  supplierDest: string;
  subcategory?: string;
  refDoc?: string;
  remarks?: string;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  password?: string; // Should be hashed in a real app
  role: 'admin' | 'editor' | 'viewer';
}

export interface AppSettings {
  categories: string[];
  suppliers: string[];
  destinations: string[];
  outgoingSubcategories: string[];
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}