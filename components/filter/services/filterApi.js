// components/filter/services/filterApi.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.ajur.app/api';

// Create axios instance with your project's config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  paramsSerializer: {
    encode: (param) => encodeURIComponent(param),
    indexes: false
  }
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('ajur_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache busting for GET requests
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _: Date.now() // Prevent caching
      };
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const filterApi = {
  async getFilteredWorkers(filters = {}) {
    const cacheKey = JSON.stringify(filters);
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('📦 Serving from cache');
      return cached.data;
    }
    
    try {
      console.log('🌐 Fetching workers with filters:', filters);
      
      const response = await apiClient.get('/server-filtered-workers', {
        params: filters,
        // Use your existing axios config
      });
      
      const result = {
        workers: response.data.workers || [],
        pagination: response.data.pagination || {
          current_page: 1,
          total_pages: 0,
          total_count: 0,
          has_next: false,
          per_page: 10
        },
        status: 'success'
      };
      
      // Cache successful response
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Filter API error:', {
        message: error.message,
        url: error.config?.url,
        params: filters
      });
      
      // Return graceful fallback
      return {
        workers: [],
        pagination: {
          current_page: 1,
          total_pages: 0,
          total_count: 0,
          has_next: false,
          per_page: 10
        },
        status: 'error',
        message: error.message
      };
    }
  },
  
  // Clear cache
  clearCache() {
    cache.clear();
  },
  
  // Your other API methods...
  getCategoryFields: async (categoryId) => {
    try {
      const response = await apiClient.get('/category-fields', {
        params: { cat: categoryId }
      });
      return response.data;
    } catch (error) {
      return {
        normal_fields: [],
        tick_fields: [],
        predefine_fields: []
      };
    }
  }
};

export default filterApi;