/**
 * Mensa API Service
 * Wrapper for mensa.gregorflachs.de API
 * Based on official Swagger documentation
 */

import axios, { AxiosError, AxiosInstance } from 'axios';

const BASE_URL = 'https://mensa.gregorflachs.de/api/v1';

// Types for API responses based on Swagger documentation
export interface Canteen {
  ID: string; // MongoDB ObjectID string
  name: string;
  address?: {
    street?: string;
    city?: string;
    zipcode?: string;
    district?: string;
    geolocation?: {
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
  businesshours: BusinessHour[];
}

export interface BusinessHour {
  openAt: string;
  closeAt: string;
  businessHourType: string;
}

export interface Meal {
  ID: string; // MongoDB ObjectID string
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
  ID: string;
  name: string;
  description?: string;
}

export interface Additive {
  ID: string;
  text: string;
  referenceid: string;
}

export interface MealReview {
  ID: string;
  mealID: string;
  userID: string;
  averageRating?: number;
  detailRatings: DetailRating[];
  comment?: string;
  lastUpdated?: string;
  createdAt?: string;
}

export interface CanteenReview {
  ID: string;
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
  ID?: string;
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
  ID?: string;
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
  ID?: string;
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
  ID?: string;
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

/**
 * Mensa API Service Class
 * Handles all communication with the mensa.gregorflachs.de API
 */
class MensaApiService {
  private static instance: MensaApiService | null = null;
  private apiKey: string | null = null;
  private axiosInstance: AxiosInstance;

  constructor(apiKey?: string) {
    // Try to get API key from various sources
    let envApiKey: string | undefined;

    try {
      // Try process.env first
      envApiKey = process.env.EXPO_PUBLIC_MENSA_API_KEY;
    } catch (e) {
      throw new Error(
        'Failed to read environment variables. Make sure you have set EXPO_PUBLIC_MENSA_API_KEY in your .env file.',
      );
    }

    this.apiKey = apiKey || envApiKey || null;

    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include API key
    this.axiosInstance.interceptors.request.use(config => {
      if (this.apiKey) {
        config.headers['X-API-KEY'] = this.apiKey;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter =
            error.response.headers['X-RateLimit-Seconds-Till-Refill'];
          throw new Error(
            `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          );
        }

        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout - please try again');
        }

        // Handle network errors
        if (!error.response) {
          throw new Error('Network error - check your internet connection');
        }

        // Handle API errors
        const errorMessage = error.response.data || error.message;
        throw new Error(`API Error ${error.response.status}: ${errorMessage}`);
      },
    );

    // Only log on first initialization and only in development
    if (!MensaApiService.instance && __DEV__ && this.apiKey) {
      console.log('MensaApiService initialized with API key');
    }

    MensaApiService.instance = this;
  }

  // Canteen endpoints
  async getCanteens(filter?: CanteenFilter): Promise<Canteen[]> {
    const result = await this.axiosInstance.get<Canteen[]>(`/canteen`, {
      params: {
        ...filter,
        clickandcollect: filter?.clickandcollect ?? false, // Default to false if not provided
      },
    });
    return result.data;
  }

  // Meal endpoints
  async getMeals(filter?: MealFilter): Promise<Meal[]> {
    const result = await this.axiosInstance.get<Meal[]>(`/meal`, {
      params: filter,
    });
    return result.data;
  }

  // Menu endpoints (note: API uses "/menue" not "/menu")
  async getMenus(filter?: MenuFilter): Promise<Menu[]> {
    const result = await this.axiosInstance.get<Menu[]>('/menue', {
      params: filter,
    });
    return result.data;
  }

  // Badge endpoints
  async getBadges(): Promise<Badge[]> {
    const result = await this.axiosInstance.get('/badge');
    return result.data;
  }

  // Additive endpoints
  async getAdditives(): Promise<Additive[]> {
    const result = await this.axiosInstance.get<Additive[]>('/additive');
    return result.data;
  }

  // Review endpoints
  async getMealReviews(filter?: MealReviewFilter): Promise<MealReview[]> {
    const result = await this.axiosInstance.get<MealReview[]>('/mealreview', {
      params: filter,
    });

    return result.data;
  }

  async getCanteenReviews(
    filter?: CanteenReviewFilter,
  ): Promise<CanteenReview[]> {
    const result = await this.axiosInstance.get(`/canteenreview`, {
      params: filter,
    });
    return result.data;
  }

  async createMealReview(review: CreateMealReviewRequest): Promise<MealReview> {
    const result = await this.axiosInstance.post('/mealreview', {
      data: review,
    });
    return result.data;
  }

  async createCanteenReview(
    review: CreateCanteenReviewRequest,
  ): Promise<CanteenReview> {
    const result = await this.axiosInstance.post('/canteenreview', {
      data: review,
    });

    return result.data;
  }

  async updateMealReview(review: MealReview): Promise<MealReview> {
    const result = await this.axiosInstance.put('/mealreview', {
      data: review,
    });
    return result.data;
  }

  async updateCanteenReview(review: CanteenReview): Promise<CanteenReview> {
    const result = await this.axiosInstance.put('/canteenreview', {
      data: review,
    });
    return result.data;
  }

  async deleteMealReview(reviewId: string): Promise<MealReview> {
    const result = await this.axiosInstance.delete(`/mealreview/${reviewId}`);
    return result.data;
  }

  async deleteCanteenReview(reviewId: string): Promise<CanteenReview> {
    const result = await this.axiosInstance.delete(
      `/canteenreview/${reviewId}`,
    );
    return result.data;
  }
}

// Create and export a singleton instance
export const mensaApi = new MensaApiService();

// Export default instance
export default mensaApi;
