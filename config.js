import dotenv from 'dotenv';

dotenv.config();

/**
 * Supabase configuration
 */
export const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  
  // API endpoints
  endpoints: {
    students: '/rest/v1/students',
    staff: '/rest/v1/staff',
    payments: '/rest/v1/payments',
    expenses: '/rest/v1/expenses',
    salaries: '/rest/v1/salaries'
  },
  
  // Common headers for all requests
  headers: {
    'apikey': process.env.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
};

/**
 * Base API class for common functionality
 */
export class BaseAPI {
  constructor() {
    this.baseUrl = config.supabaseUrl;
    this.headers = config.headers;
  }

  /**
   * Make a generic API request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Request options (method, body, etc.)
   * @returns {Promise<any>} Response data
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: this.headers,
        ...options
      });

      // Get response text for better error debugging
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error(`HTTP ${response.status} Error:`, responseText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      // Parse JSON if response has content
      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}