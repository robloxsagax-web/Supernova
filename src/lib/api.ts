/**
 * Centralized API Client for Supernova
 * 
 * All frontend API calls should use this client instead of scattered fetch() calls.
 * The backend URL is configured via environment variable.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL || '';

interface ApiError {
  error: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        
        try {
          const errorData: ApiError = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Response might not be JSON
        }

        return { error: errorMessage };
      }

      const data: T = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { error: 'Backend unavailable. Please try again later.' };
      }
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          return { error: 'Request timed out. Please try again.' };
        }
        return { error: error.message };
      }
      
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }
}

// Create singleton instance
export const api = new ApiClient();

// Export types for use in components
export type { ApiError, ApiResponse };
