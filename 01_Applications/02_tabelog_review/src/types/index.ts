export interface Restaurant {
  id: string;
  name: string;
  nameKana: string;
  category: string;
  area: string;
  address: string;
  tel: string;
  businessHours: string;
  holiday: string;
  budget: {
    lunch: string;
    dinner: string;
  };
  rating: number;
  reviewCount: number;
  images: string[];
  features: string[];
  description: string;
  mapUrl?: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  visitDate: string;
  visitType: 'lunch' | 'dinner' | 'drink';
  title: string;
  content: string;
  images: string[];
  helpfulCount: number;
  createdAt: string;
  scores: {
    taste: number;
    service: number;
    atmosphere: number;
    costPerformance: number;
  };
}

export interface SearchFilters {
  area?: string;
  category?: string;
  budget?: string;
  rating?: number;
  keyword?: string;
}

