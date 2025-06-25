/**
 * Mensa API Service
 * Wrapper for mensa.gregorflachs.de API
 */

const BASE_URL = 'https://mensa.gregorflachs.de/api/v1';

// Types for API responses
export interface Canteen {
  id: string; // MongoDB ObjectID string
  name: string;
  address?: string | {
    street?: string;
    city?: string;
    zipcode?: string;
    district?: string;
    geoLocation?: {
      latitude: number;
      longitude: number;
    };
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: OpeningHours[];
}

export interface Meal {
  id: string; // MongoDB ObjectID string
  name: string;
  description?: string;
  price?: {
    students?: number;
    employees?: number;
    guests?: number;
  };
  category?: string;
  badges?: Badge[];
  additives?: Additive[];
}

export interface Menu {
  id: string; // MongoDB ObjectID string
  canteenId: string; // MongoDB ObjectID string
  date: string;
  meals: Meal[];
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
}

export interface Additive {
  id: string;
  name: string;
  description?: string;
}

export interface MealReview {
  id: string;
  mealId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CanteenReview {
  id: string;
  canteenId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface OpeningHours {
  day: string;
  openTime?: string;
  closeTime?: string;
  closed?: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// Filter interfaces
export interface CanteenFilter {
  name?: string;
  location?: string;
}

export interface MealFilter {
  name?: string;
  canteenId?: string;
  category?: string;
}

export interface MenuFilter {
  canteenId?: string;
}

export interface ReviewFilter {
  mealId?: string;
  canteenId?: string;
  rating?: number;
  dateFrom?: string;
  dateTo?: string;
}

class MensaApiService {
  private apiKey: string | null = null;
  private static instance: MensaApiService | null = null;

  constructor(apiKey?: string) {
    // Prevent multiple instances in development with hot reload
    if (MensaApiService.instance) {
      return MensaApiService.instance;
    }

    // Try to get API key from environment variable first, then fallback to parameter
    // Use a safer way to access environment variables that works in all environments
    let envApiKey: string | undefined;
    try {
      // Check multiple ways to access environment variables
      if (typeof process !== 'undefined' && process.env) {
        envApiKey = process.env.EXPO_PUBLIC_MENSA_API_KEY;
      }
      
      // For web, also check window.__expo_env or global variables
      if (!envApiKey && typeof window !== 'undefined') {
        const windowWithEnv = window as any;
        envApiKey = windowWithEnv.__expo_env?.EXPO_PUBLIC_MENSA_API_KEY;
      }
      
      // For Expo web, also check the global expo object
      if (!envApiKey && typeof global !== 'undefined') {
        const globalWithExpo = global as any;
        envApiKey = globalWithExpo.__DEV__ ? 
          "MGOtdI2nLs3FJJ8+rz0gIJL4sfOboeu5UyFz4si8e2E1Y+dhx83vej5NJiD+NtTyRT1kbzd8VHwO1mNHOMzNXq4AP9hhaC40gfOqC18sMZJuVtdj4hH9viEPudz6tfy4OMLpWNwBWBUbI/eoXHteWwQsREtszVzOnqQUbYP1CZAGE/95FeKZwAn3EZowbNeDBPnRVfXMPzeTZxQm88fX1fD/m9sL5FPlrZ6J4FFB8XUIEQMsk9I261LZWx2TzlFGaG5qeHWsNbjL9XiBWFaOtIwMT5v83PG8meZDRQ713vz2s1JXy3MR0PDIIyUrydpPUnxKxkZ8RtqxZu7E0YPPXg==" : 
          undefined;
      }
      
    } catch (e) {
      console.log('Error accessing environment variables:', e);
      envApiKey = undefined;
    }
    
    this.apiKey = apiKey || envApiKey || null;
    
    // Only log on first initialization
    if (!MensaApiService.instance) {
      console.log('MensaApiService initialized');
      console.log('API Key from env:', !!envApiKey);
      console.log('API Key final:', !!this.apiKey);
      
      if (!this.apiKey) {
        console.warn('No Mensa API key found. Please set EXPO_PUBLIC_MENSA_API_KEY in your .env file or call setApiKey()');
      }
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
    options: RequestInit = {}
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

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout - API nicht erreichbar'));
      }, 15000); // Longer timeout for web (15 seconds)
    });

    try {
      // Create abort controller for timeout handling (cross-platform compatible)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const fetchPromise = fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        // Add mode for CORS handling in web
        mode: 'cors',
        // Add credentials handling
        credentials: 'omit',
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      clearTimeout(timeoutId);

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('X-RateLimit-Seconds-Till-Refill');
        throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        // Provide user-friendly error messages
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          throw new Error('Verbindung zur Mensa-API fehlgeschlagen - bitte später versuchen');
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
          throw new Error('Keine Internetverbindung oder API nicht verfügbar');
        }
        throw error;
      }
      throw new Error('Unbekannter Fehler beim Laden der Daten');
    }
  }

  /**
   * Build query string from filter object
   */
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // Canteen endpoints
  async getCanteens(filter?: CanteenFilter): Promise<Canteen[]> {
    const queryString = filter ? this.buildQueryString(filter) : '';
    return this.makeRequest<Canteen[]>(`/canteen${queryString}`);
  }

  // Meal endpoints
  async getMeals(filter?: MealFilter): Promise<Meal[]> {
    const queryString = filter ? this.buildQueryString(filter) : '';
    return this.makeRequest<Meal[]>(`/meal${queryString}`);
  }

  // Menu endpoints
  async getMenus(filter?: MenuFilter): Promise<Menu[]> {
    const queryString = filter ? this.buildQueryString(filter) : '';
    return this.makeRequest<Menu[]>(`/menue${queryString}`);
  }

  // Badge endpoints
  async getBadges(): Promise<Badge[]> {
    return this.makeRequest<Badge[]>('/badge');
  }

  // Additive endpoints
  async getAdditives(): Promise<Additive[]> {
    return this.makeRequest<Additive[]>('/additive');
  }

  // Meal Review endpoints
  async getMealReviews(filter?: ReviewFilter): Promise<MealReview[]> {
    const queryString = filter ? this.buildQueryString(filter) : '';
    return this.makeRequest<MealReview[]>(`/mealreview${queryString}`);
  }

  async createMealReview(review: Omit<MealReview, 'id' | 'createdAt'>): Promise<MealReview> {
    return this.makeRequest<MealReview>('/mealreview', {
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

  async deleteMealReview(id: string): Promise<void> {
    return this.makeRequest<void>(`/mealreview/${id}`, {
      method: 'DELETE',
    });
  }

  // Canteen Review endpoints
  async getCanteenReviews(filter?: ReviewFilter): Promise<CanteenReview[]> {
    const queryString = filter ? this.buildQueryString(filter) : '';
    return this.makeRequest<CanteenReview[]>(`/canteenreview${queryString}`);
  }

  async createCanteenReview(review: Omit<CanteenReview, 'id' | 'createdAt'>): Promise<CanteenReview> {
    return this.makeRequest<CanteenReview>('/canteenreview', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async updateCanteenReview(review: CanteenReview): Promise<CanteenReview> {
    return this.makeRequest<CanteenReview>('/canteenreview', {
      method: 'PUT',
      body: JSON.stringify(review),
    });
  }

  async deleteCanteenReview(id: string): Promise<void> {
    return this.makeRequest<void>(`/canteenreview/${id}`, {
      method: 'DELETE',
    });
  }

  // Test method to check API availability
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing API connection...');
      console.log('API Key available:', !!this.apiKey);
      console.log('API Key length:', this.apiKey ? this.apiKey.length : 0);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add API key if available
      if (this.apiKey) {
        headers['X-API-KEY'] = this.apiKey;
        console.log('API Key set in headers');
      } else {
        console.log('No API Key available');
      }
      
      // Try a simple GET request with short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${BASE_URL}/canteen`, {
        method: 'GET',
        headers,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
      });
      
      clearTimeout(timeoutId);
      
      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.status === 401) {
        console.log('API requires authentication but key might be invalid');
        return false;
      }
      
      return response.ok;
    } catch (error) {
      console.log('API connection test failed:', error);
      return false;
    }
  }

  // Utility methods
  async getTodaysMenu(canteenId: string): Promise<Menu[]> {
    try {
      // First try to get menus directly for the canteen
      const menus = await this.getMenus({ canteenId });
      
      if (menus && menus.length > 0) {
        return menus;
      }
      
      // Fallback: try to get meals and wrap them in a menu structure
      const meals = await this.getMeals({ canteenId });
      
      if (meals && meals.length > 0) {
        // Create a mock menu structure with today's date
        const today = new Date().toISOString().split('T')[0];
        return [{
          id: `temp_${Date.now()}`, // Generate a temporary string ID
          canteenId: canteenId,
          date: today,
          meals: meals
        }];
      }
      
      // Return empty array if no data found
      return [];
    } catch (error) {
      console.error('Error in getTodaysMenu:', error);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  }

  async getCanteenWithTodaysMenu(canteenId: string): Promise<{ canteen: Canteen; menu: Menu[] }> {
    const [canteens, menu] = await Promise.all([
      this.getCanteens(),
      this.getTodaysMenu(canteenId)
    ]);
    
    const canteen = canteens.find(c => c.id === canteenId);
    if (!canteen) {
      throw new Error(`Canteen with ID ${canteenId} not found`);
    }

    return { canteen, menu };
  }
}

// Export singleton instance - use getInstance to ensure single instance
let mensaApiInstance: MensaApiService | null = null;

export const mensaApi = (() => {
  if (!mensaApiInstance) {
    mensaApiInstance = new MensaApiService();
  }
  return mensaApiInstance;
})();

// Export class for custom instances
export default MensaApiService;
