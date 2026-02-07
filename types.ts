
export interface User {
  id: number;
  name: string;
  role: 'farmer' | 'buyer';
}

export interface ProduceListing {
  id: number;
  seller_id: number;
  seller_name: string;
  category_id: number;
  category_name: string;
  title: string;
  description: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  location_name: string;
  market_name?: string;
  images: string[];
  harvest_date: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export enum AppRoute {
  HOME = 'home',
  LISTINGS = 'listings',
  CREATE = 'create',
  PROFILE = 'profile',
  AI_ADVISOR = 'ai-advisor'
}
