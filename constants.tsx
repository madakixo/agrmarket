
import React from 'react';
import { ShoppingBasket, Leaf, Carrot, Apple, Wheat, Coffee } from 'lucide-react';
import { Category, ProduceListing } from './types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Vegetables', icon: 'carrot' },
  { id: 2, name: 'Fruits', icon: 'apple' },
  { id: 3, name: 'Grains', icon: 'wheat' },
  { id: 4, name: 'Tubers', icon: 'leaf' },
  { id: 5, name: 'Beverages', icon: 'coffee' },
];

export const MOCK_LISTINGS: ProduceListing[] = [
  {
    id: 1,
    seller_id: 101,
    seller_name: "Green Valley Farm",
    category_id: 1,
    category_name: "Vegetables",
    title: "Organic Vine Tomatoes",
    description: "Bursting with flavor, these organic tomatoes are picked at peak ripeness. Perfect for salads, sauces, or snacks.",
    price_per_unit: 4.5,
    unit: "kg",
    quantity_available: 50,
    location_name: "Riverside County",
    market_name: "Central Farmers Market",
    images: ["https://picsum.photos/seed/tomato/800/600"],
    harvest_date: "2024-05-15T00:00:00Z",
    created_at: "2024-05-16T10:30:00Z"
  },
  {
    id: 2,
    seller_id: 102,
    seller_name: "Sunnyside Orchards",
    category_id: 2,
    category_name: "Fruits",
    title: "Honeycrisp Apples",
    description: "Extra crunchy and sweet. Our Honeycrisp apples are cooled immediately after picking to lock in the freshness.",
    price_per_unit: 3.2,
    unit: "kg",
    quantity_available: 200,
    location_name: "North Valley",
    market_name: "Local Depot",
    images: ["https://picsum.photos/seed/apple/800/600"],
    harvest_date: "2024-05-10T00:00:00Z",
    created_at: "2024-05-11T08:00:00Z"
  },
  {
    id: 3,
    seller_id: 103,
    seller_name: "Golden Grain Estates",
    category_id: 3,
    category_name: "Grains",
    title: "Premium Basmati Rice",
    description: "Long-grain aromatic rice grown in silt-rich soil. Aged for 12 months for the best texture and fragrance.",
    price_per_unit: 12.0,
    unit: "25kg Bag",
    quantity_available: 40,
    location_name: "Delta Plains",
    market_name: "Bulk Exchange",
    images: ["https://picsum.photos/seed/rice/800/600"],
    harvest_date: "2024-04-20T00:00:00Z",
    created_at: "2024-04-25T14:20:00Z"
  }
];

export const getIcon = (name: string) => {
  switch(name) {
    case 'carrot': return <Carrot className="w-5 h-5" />;
    case 'apple': return <Apple className="w-5 h-5" />;
    case 'wheat': return <Wheat className="w-5 h-5" />;
    case 'leaf': return <Leaf className="w-5 h-5" />;
    case 'coffee': return <Coffee className="w-5 h-5" />;
    default: return <ShoppingBasket className="w-5 h-5" />;
  }
};
