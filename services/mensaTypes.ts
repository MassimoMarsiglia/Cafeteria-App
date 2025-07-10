export interface Canteen {
  id: string; // MongoDB ObjectID string
  name: string;
  address?: {
    street?: string;
    city?: string;
    zipcode?: string;
    district?: string;
    geoLocation?: {
      latitude: number;
      longitude: number;
    };
  };
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  businessDays?: BusinessDay[];
  url?: string;
  lastUpdated?: string;
  canteenReviews?: CanteenReview[];
}

export interface BusinessDay {
  day: string;
  businessHours: BusinessHour[];
}

export interface BusinessHour {
  openAt: string;
  closeAt: string;
  businessHourType: string;
}

export interface Meal {
  id: string; // MongoDB ObjectID string
  name: string;
  prices?: Price[];
  category?: string;
  additives?: Additive[];
  badges?: Badge[];
  waterBilanz?: number;
  co2Bilanz?: number;
  mealReviews?: MealReview[];
}

export interface Price {
  price: number;
  priceType: string; // Student, Angestellte, Gäste
}

export interface Menu {
  date: string; // YYYY-MM-DD format
  canteenId: string; // MongoDB ObjectID string
  meals: Meal[];
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
}

export interface Additive {
  id: string;
  text: string;
  referenceid: string;
}

export interface MealReview {
  id: string;
  mealID: string;
  userID: string;
  averageRating?: number;
  detailRatings: DetailRating[];
  comment?: string;
  lastUpdated?: string;
  createdAt?: string;
}

export interface CanteenReview {
  id: string;
  canteenID: string;
  userID: string;
  averageRating?: number;
  detailRatings: DetailRating[];
  comment?: string;
  lastUpdated?: string;
  createdAt?: string;
}

export interface DetailRating {
  rating: number;
  name: string;
}

// Filter interfaces based on Swagger documentation
export interface CanteenFilter {
  id?: string;
  loadingtype?: 'lazy' | 'complete';
  name?: string;
  zipcode?: string;
  district?: string;
  clickandcollect?: boolean;
  time?: string;
  businesshourtype?: 'Mensa' | 'Mittagstisch' | 'Backshop';
  open?: string; // Format: WOCHENTAG;UHRZEIT;ÖFFNUNGSZEITENTYP
}

export interface MealFilter {
  id?: string;
  loadingtype?: 'lazy' | 'complete' | 'mealonly';
  category?: string;
  name?: string;
  price?: string; // Format: PREIS;PREISTYP
  pricegreater?: string;
  pricelower?: string;
  additive?: string; // ; separated list
  badges?: string; // ; separated list
}

export interface MenuFilter {
  loadingtype?: 'lazy' | 'complete';
  canteenId?: string;
  startdate?: string; // YYYY-MM-DD
  enddate?: string; // YYYY-MM-DD
}

export interface MealReviewFilter {
  id?: string;
  mealId?: string;
  usderId?: string; // Note: API has typo "usderId" instead of "userId"
  ratingequal?: string;
  ratinggreaterthan?: string;
  ratinglowerthan?: string;
  sortby?:
    | 'rating'
    | 'date'
    | 'rating:desc'
    | 'date:desc'
    | 'rating:asc'
    | 'date:asc';
  limit?: string; // Max 100
  page?: string;
}

export interface CanteenReviewFilter {
  id?: string;
  canteenId?: string;
  usderId?: string; // Note: API has typo "usderId" instead of "userId"
  ratingequal?: string;
  ratinggreaterthan?: string;
  ratinglowerthan?: string;
  sortby?:
    | 'rating'
    | 'date'
    | 'rating:desc'
    | 'date:desc'
    | 'rating:asc'
    | 'date:asc';
  limit?: string; // Max 100
  page?: string;
}

// Request types for creating reviews
export interface CreateMealReviewRequest {
  mealID: string;
  userID: string;
  detailRatings: DetailRating[];
  comment?: string;
}

export interface CreateCanteenReviewRequest {
  canteenID: string;
  userID: string;
  detailRatings: DetailRating[];
  comment?: string;
}
