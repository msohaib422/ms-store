import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
    };
  };
};

export interface ProductVariant {
  name: string;
  price: number;
  discountPrice: number | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  discount_price: number | null;
  variants: ProductVariant[];
  category_id: string | null;
  brand: string | null;
  sku: string | null;
  stock: number;
  images: string[];
  status: 'active' | 'inactive';
  is_featured: boolean;
  is_trending: boolean;
  is_offer: boolean;
  tags: string[];
  ratings: number;
  reviews_count: number;
  search_keywords: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  banner_url: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  banner_url: string | null;
  discount_percentage: number;
  badge_text: string | null;
  expiry_date: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string | null;
  customer_name: string;
  rating: number;
  review: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}
