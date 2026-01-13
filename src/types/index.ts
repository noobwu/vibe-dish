export interface Dish {
  id: string;
  name: string;
  price: number;
  tags: string[];
  image: string;
  restaurant?: string;
}

export interface OrderHistory {
  id: string;
  dishName: string;
  tags: string[];
  orderDate: string;
}

export interface UserPreferences {
  gender: 'male' | 'female';
  age: number;
  taste: 'spicy' | 'light' | 'sweet' | 'random';
  budgetMin: number;
  budgetMax: number;
}

export interface Recommendation {
  dishName: string;
  feature: string;
  reason?: string;
}

export interface ApiConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
}
