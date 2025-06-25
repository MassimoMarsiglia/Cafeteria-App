/**
 * Mensa API Service
 * Wrapper for mensa.gregorflachs.de API
 * Based on official Swagger documentation
 */

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

  constructor(apiKey?: string) {
    // Try to get API key from various sources
    let envApiKey: string | undefined;

    try {
      // Try process.env first
      envApiKey = process.env.EXPO_PUBLIC_MENSA_API_KEY;

      // Fallback for development - this key is from the user's request
      if (!envApiKey && typeof global !== 'undefined') {
        const globalWithExpo = global as any;
        envApiKey = globalWithExpo.__DEV__
          ? 'MGOtdI2nLs3FJJ8+rz0gIJL4sfOboeu5UyFz4si8e2E1Y+dhx83vej5NJiD+NtTyRT1kbzd8VHwO1mNHOMzNXq4AP9hhaC40gfOqC18sMZJuVtdj4hH9viEPudz6tfy4OMLpWNwBWBUbI/eoXHteWwQsREtszVzOnqQUbYP1CZAGE/95FeKZwAn3EZowbNeDBPnRVfXMPzeTZxQm88fX1fD/m9sL5FPlrZ6J4FFB8XUIEQMsk9I261LZWx2TzlFGaG5qeHWsNbjL9XiBWFaOtIwMT5v83PG8meZDRQ713vz2s1JXy3MR0PDIIyUrydpPUnxKxkZ8RtqxZu7E0YPPXg=='
          : undefined;
      }
    } catch (e) {
      // Silent error handling to prevent console spam
      envApiKey = undefined;
    }

    this.apiKey = apiKey || envApiKey || null;

    // Only log on first initialization and only in development
    if (!MensaApiService.instance && __DEV__ && this.apiKey) {
      console.log('MensaApiService initialized with API key');
    }

    MensaApiService.instance = this;
  }

  /**
   * Set the API key for authenticated requests
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Make a generic API request
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add API key if available
    if (this.apiKey) {
      headers['X-API-KEY'] = this.apiKey;
    }

    try {
      // Use only AbortController for timeout handling (increase timeout significantly for slow connections)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased to 30 seconds for very slow connections

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
      });

      clearTimeout(timeoutId);

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get(
          'X-RateLimit-Seconds-Till-Refill',
        );
        throw new Error(
          `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        );
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        // Handle AbortError specifically to prevent memory leaks
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }

        // Provide user-friendly error messages
        if (error.message.includes('fetch')) {
          throw new Error('Network error - check your internet connection');
        }

        throw error;
      }

      throw new Error('Unknown error occurred');
    }
  }

  /**
   * Build query string from filter object
   */
  private buildQueryString(filter: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Normalize API response fields in case they differ from Swagger documentation
   */
  private normalizeCanteen(raw: any): Canteen {
    // Handle different possible ID field names
    const id = raw.ID || raw.id || raw._id;

    if (!id) {
      console.warn('Canteen without ID field:', raw);
    }

    return {
      ...raw,
      ID: id, // Ensure ID field is always present
    } as Canteen;
  }

  private normalizeMenu(raw: any): Menu {
    // Handle different possible canteenId field names
    const canteenId = raw.canteenId || raw.canteenID || raw.canteen_id;

    if (!canteenId) {
      console.warn('Menu without canteenId field:', raw);
    }

    return {
      ...raw,
      canteenId: canteenId, // Ensure canteenId field is always present
    } as Menu;
  }

  // Canteen endpoints
  async getCanteens(filter?: CanteenFilter): Promise<Canteen[]> {
    // Always include clickandcollect=false unless explicitly set
    const defaultFilter = { clickandcollect: false, ...(filter || {}) };
    const queryString = this.buildQueryString(defaultFilter);
    console.log('API Request: /canteen' + queryString);

    const result = await this.makeRequest<any[]>(`/canteen${queryString}`);

    // Debug: Log the raw API response to understand the structure
    console.log(
      'Raw API response for canteens:',
      JSON.stringify(result.slice(0, 2), null, 2),
    );

    // Check what fields are actually available in the API response
    if (result && result.length > 0) {
      const firstItem = result[0];
      console.log('Available fields in first canteen:', Object.keys(firstItem));
      console.log('First canteen sample:', {
        ID: firstItem.ID,
        id: firstItem.id,
        _id: firstItem._id,
        name: firstItem.name,
      });
    }

    return result.map(item => this.normalizeCanteen(item));
  }

  /**
   * Enhanced canteen loading with fallback strategies
   */
  async getCanteensWithFallback(): Promise<Canteen[]> {
    try {
      // Try primary approach with clickandcollect filter
      console.log('Attempting primary canteen fetch...');
      const primaryResult = await this.getCanteens({
        clickandcollect: false,
      });

      if (primaryResult && primaryResult.length > 0) {
        console.log(
          'Primary canteen fetch successful:',
          primaryResult.length,
          'canteens',
        );
        return primaryResult;
      }

      // Fallback 1: Try without any filters
      console.log('Primary fetch failed, trying without filters...');
      const fallbackResult = await this.getCanteens();

      if (fallbackResult && fallbackResult.length > 0) {
        console.log(
          'Fallback canteen fetch successful:',
          fallbackResult.length,
          'canteens',
        );
        return fallbackResult;
      }

      // Fallback 2: Try minimal request
      console.log('Standard fetch failed, trying basic request...');
      const basicResult = await this.makeRequest<any[]>('/canteen');

      if (basicResult && Array.isArray(basicResult)) {
        console.log(
          'Basic canteen fetch successful:',
          basicResult.length,
          'canteens',
        );
        return basicResult.map(item => this.normalizeCanteen(item));
      }

      console.warn('All canteen fetch strategies failed');
      return [];
    } catch (error) {
      console.error('Error in getCanteensWithFallback:', error);
      return [];
    }
  }

  // Meal endpoints
  async getMeals(filter?: MealFilter): Promise<Meal[]> {
    const queryString = filter ? this.buildQueryString(filter) : '';
    return this.makeRequest<Meal[]>(`/meal${queryString}`);
  }

  // Menu endpoints (note: API uses "/menue" not "/menu")
  async getMenus(filter?: MenuFilter): Promise<Menu[]> {
    const queryString = filter ? this.buildQueryString(filter) : '';
    console.log('Menu API request: /menue' + queryString);

    const result = await this.makeRequest<any[]>(`/menue${queryString}`);

    // Debug: Log raw response
    console.log('Raw Menu API response length:', result?.length || 0);
    if (result && result.length > 0) {
      console.log('First menu raw structure:', Object.keys(result[0]));
    }

    return result.map(item => this.normalizeMenu(item));
  }

  // Badge endpoints
  async getBadges(): Promise<Badge[]> {
    return this.makeRequest<Badge[]>('/badge');
  }

  // Additive endpoints
  async getAdditives(): Promise<Additive[]> {
    return this.makeRequest<Additive[]>('/additive');
  }

  // Review endpoints
  async getMealReviews(filter?: MealReviewFilter): Promise<MealReview[]> {
    const queryString = filter ? this.buildQueryString(filter) : '';
    return this.makeRequest<MealReview[]>(`/mealreview${queryString}`);
  }

  async getCanteenReviews(
    filter?: CanteenReviewFilter,
  ): Promise<CanteenReview[]> {
    const queryString = filter ? this.buildQueryString(filter) : '';
    return this.makeRequest<CanteenReview[]>(`/canteenreview${queryString}`);
  }

  async createMealReview(review: CreateMealReviewRequest): Promise<MealReview> {
    return this.makeRequest<MealReview>('/mealreview', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async createCanteenReview(
    review: CreateCanteenReviewRequest,
  ): Promise<CanteenReview> {
    return this.makeRequest<CanteenReview>('/canteenreview', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async updateMealReview(review: MealReview): Promise<MealReview> {
    return this.makeRequest<MealReview>('/mealreview', {
      method: 'PUT',
      body: JSON.stringify(review),
    });
  }

  async updateCanteenReview(review: CanteenReview): Promise<CanteenReview> {
    return this.makeRequest<CanteenReview>('/canteenreview', {
      method: 'PUT',
      body: JSON.stringify(review),
    });
  }

  async deleteMealReview(reviewId: string): Promise<MealReview> {
    return this.makeRequest<MealReview>(`/mealreview/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async deleteCanteenReview(reviewId: string): Promise<CanteenReview> {
    return this.makeRequest<CanteenReview>(`/canteenreview/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      // Use the correct endpoint from Swagger documentation
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add API key if available
      if (this.apiKey) {
        headers['X-API-KEY'] = this.apiKey;
      }

      // Try a simple GET request with longer timeout for stability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

      const response = await fetch(
        `${BASE_URL}/canteen?clickandcollect=false`,
        {
          method: 'GET',
          headers,
          signal: controller.signal,
          mode: 'cors',
          credentials: 'omit',
        },
      );

      clearTimeout(timeoutId);

      // Only log in development mode
      if (__DEV__) {
        console.log('API Response status:', response.status);
      }

      if (response.status === 401) {
        return false;
      }

      return response.ok;
    } catch (error) {
      if (__DEV__) {
        console.log('API connection test failed:', error);
      }
      return false;
    }
  }

  // Utility methods for the app
  async getTodaysMenu(canteenId: string): Promise<Menu[]> {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      console.log('getTodaysMenu called with:', { canteenId, today });

      // Use the menue endpoint with canteenId filter
      const result = await this.getMenus({
        canteenId: canteenId,
        startdate: today,
        enddate: today,
        loadingtype: 'complete',
      });

      console.log('Menu API result:', result);
      console.log(
        'Menu API result type:',
        typeof result,
        'length:',
        Array.isArray(result) ? result.length : 'not array',
      );

      // Debug: Check structure of menu items
      if (result && Array.isArray(result) && result.length > 0) {
        console.log('First menu item keys:', Object.keys(result[0]));
        console.log('First menu item sample:', {
          date: result[0].date,
          canteenId: result[0].canteenId,
          meals: Array.isArray(result[0].meals)
            ? result[0].meals.length
            : 'not array',
        });
      }

      // Return the menu data directly
      return result;
    } catch (error) {
      if (__DEV__) {
        console.error('Error in getTodaysMenu:', error);
      }
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  }

  async getCanteenWithTodaysMenu(
    canteenId: string,
  ): Promise<{ canteen: Canteen; menu: Menu[] }> {
    const [canteens, menu] = await Promise.all([
      this.getCanteens({ ID: canteenId }),
      this.getTodaysMenu(canteenId),
    ]);

    const canteen = canteens.find(c => c.ID === canteenId);
    if (!canteen) {
      throw new Error(`Canteen with ID ${canteenId} not found`);
    }

    return { canteen, menu };
  }
}

// Create and export a singleton instance
export const mensaApi = new MensaApiService();

// Export default instance
export default mensaApi;
