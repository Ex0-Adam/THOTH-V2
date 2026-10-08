/**
 * Frontend API Client Hub
 * 
 * This is the single source of truth for all backend API requests.
 * - Centralized request handling with error recovery
 * - Automatic fallback to relative paths
 * - Robust error handling and logging
 * 
 * Environment: NEXT_PUBLIC_BACKEND_URL (optional)
 * Fallback: relative /api/* requests
 */

// ============================================
// Configuration
// ============================================

const getBackendUrl = (): string => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || '';
};

const apiUrl = (endpoint: string): string => {
  const baseUrl = getBackendUrl();
  if (baseUrl) {
    return `${baseUrl}${endpoint}`;
  }
  return endpoint;
};

// ============================================
// Error Handling
// ============================================

export class ApiError extends Error {
  constructor(
    public endpoint: string,
    public status?: number,
    public originalError?: Error,
    message?: string
  ) {
    super(message || `API Error on ${endpoint}`);
    this.name = 'ApiError';
  }
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

// ============================================
// Type Definitions
// ============================================

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string | null;
  gallery?: string[];
  videoLink?: string | null;
  projectUrl?: string | null;
  toolsUsed?: string[];
  date: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  image?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalProducts?: number;
  totalProjects?: number;
  totalStaffMembers?: number;
  recentActivity?: any[];
}

export interface SiteConfig {
  siteTitle?: string;
  siteDescription?: string;
  brandColor?: string;
  logoUrl?: string;
  [key: string]: any;
}

// ============================================
// Fetch Wrapper with Robust Error Handling
// ============================================

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount: number = 0
): Promise<T> {
  const url = apiUrl(endpoint);
  const maxRetries = 1;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Handle error responses
    if (!response.ok) {
      let errorData: ErrorResponse = {};
      try {
        errorData = await response.json();
      } catch {
        // Response is not JSON
      }

      const errorMessage =
        errorData.message || errorData.error || `HTTP ${response.status}`;

      throw new ApiError(
        endpoint,
        response.status,
        undefined,
        errorMessage
      );
    }

    // Parse successful response
    const data: T = await response.json();
    return data;
  } catch (error) {
    // Network or other errors
    if (error instanceof ApiError) {
      // Retry on network failures (status undefined)
      if (retryCount < maxRetries && !error.status) {
        console.warn(
          `Retrying API request (${retryCount + 1}/${maxRetries}): ${endpoint}`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchApi<T>(endpoint, options, retryCount + 1);
      }

      console.error(`API request failed: ${endpoint}`, error.message);
      throw error;
    }

    // Unknown error type
    const unknownError = error instanceof Error ? error : new Error(String(error));
    console.error(`Unexpected error on API request: ${endpoint}`, unknownError);
    throw new ApiError(endpoint, undefined, unknownError);
  }
}

// ============================================
// API Helper Utilities
// ============================================

export const ApiUtils = {
  /**
   * Build query parameters safely
   */
  buildQuery(params?: Record<string, string | number | boolean>): string {
    if (!params || Object.keys(params).length === 0) return '';
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query.append(key, String(value));
      }
    });
    const queryStr = query.toString();
    return queryStr ? `?${queryStr}` : '';
  },

  /**
   * Handle API response with type safety
   */
  handleResponse<T>(
    response: ApiResponse<T> | T,
    fallback?: T
  ): T | null {
    // If response is already the data (not wrapped)
    if (
      response &&
      typeof response === 'object' &&
      !('success' in response) &&
      !('data' in response)
    ) {
      return response as T;
    }

    // If wrapped in ApiResponse
    const apiResp = response as any;
    if (apiResp.data) {
      return apiResp.data;
    }
    if (apiResp.success === false) {
      return fallback || null;
    }

    return (response as T) || fallback || null;
  },
};

// ============================================
// PROJECTS API
// ============================================

export const Projects = {
  /**
   * Get all projects
   * GET /api/projects
   */
  async getAll(
    params?: Record<string, string | number>
  ): Promise<Project[]> {
    try {
      const query = ApiUtils.buildQuery(params);
      const response = await fetchApi<Project[] | ApiResponse<Project[]>>(
        `/api/projects${query}`
      );
      return ApiUtils.handleResponse(response, []) || [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  },

  /**
   * Get project by ID
   * GET /api/projects/:id
   */
  async getById(id: string): Promise<Project | null> {
    try {
      const response = await fetchApi<Project | ApiResponse<Project>>(
        `/api/projects/${id}`
      );
      return ApiUtils.handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      return null;
    }
  },

  /**
   * Create new project
   * POST /api/projects
   */
  async create(data: Partial<Project>): Promise<Project | null> {
    try {
      const response = await fetchApi<Project | ApiResponse<Project>>(
        '/api/projects',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return ApiUtils.handleResponse(response);
    } catch (error) {
      console.error('Failed to create project:', error);
      return null;
    }
  },

  /**
   * Update project
   * PATCH /api/projects/:id
   */
  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    try {
      const response = await fetchApi<Project | ApiResponse<Project>>(
        `/api/projects/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
      return ApiUtils.handleResponse(response);
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error);
      return null;
    }
  },

  /**
   * Delete project
   * DELETE /api/projects/:id
   */
  async delete(id: string): Promise<boolean> {
    try {
      await fetchApi<void>(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error);
      return false;
    }
  },
};

// ============================================
// STAFF API
// ============================================

export const Staff = {
  /**
   * Get all staff members
   * GET /api/staff
   */
  async getAll(
    params?: Record<string, string | number>
  ): Promise<StaffMember[]> {
    try {
      const query = ApiUtils.buildQuery(params);
      const response = await fetchApi<
        StaffMember[] | ApiResponse<StaffMember[]>
      >(`/api/staff${query}`);
      return ApiUtils.handleResponse(response, []) || [];
    } catch (error) {
      console.error('Failed to fetch staff members:', error);
      return [];
    }
  },

  /**
   * Get staff member by ID
   * GET /api/staff/:id
   */
  async getById(id: string): Promise<StaffMember | null> {
    try {
      const response = await fetchApi<
        StaffMember | ApiResponse<StaffMember>
      >(`/api/staff/${id}`);
      return ApiUtils.handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch staff member ${id}:`, error);
      return null;
    }
  },
};

// ============================================
// SITE CONFIG API
// ============================================

export const SiteConfig = {
  /**
   * Get site configuration
   * GET /api/site-config
   */
  async get(): Promise<SiteConfig | null> {
    try {
      const response = await fetchApi<SiteConfig | ApiResponse<SiteConfig>>(
        '/api/site-config'
      );
      return ApiUtils.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch site config:', error);
      return null;
    }
  },

  /**
   * Update site configuration
   * PATCH /api/site-config
   */
  async update(data: Partial<SiteConfig>): Promise<SiteConfig | null> {
    try {
      const response = await fetchApi<SiteConfig | ApiResponse<SiteConfig>>(
        '/api/site-config',
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
      return ApiUtils.handleResponse(response);
    } catch (error) {
      console.error('Failed to update site config:', error);
      return null;
    }
  },
};

// ============================================
// PAGES API
// ============================================

export const Pages = {
  /**
   * Get all pages
   * GET /api/pages
   */
  async getAll(): Promise<any[]> {
    try {
      const response = await fetchApi<any[] | ApiResponse<any[]>>(
        '/api/pages'
      );
      return ApiUtils.handleResponse(response, []) || [];
    } catch (error) {
      console.error('Failed to fetch pages:', error);
      return [];
    }
  },

  /**
   * Get page by slug or ID
   * GET /api/pages/:id
   */
  async getById(id: string): Promise<any | null> {
    try {
      const response = await fetchApi<any | ApiResponse<any>>(
        `/api/pages/${id}`
      );
      return ApiUtils.handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch page ${id}:`, error);
      return null;
    }
  },
};

// ============================================
// CATEGORIES API
// ============================================

export const Categories = {
  /**
   * Get all categories
   * GET /api/categories
   */
  async getAll(): Promise<any[]> {
    try {
      const response = await fetchApi<any[] | ApiResponse<any[]>>(
        '/api/categories'
      );
      return ApiUtils.handleResponse(response, []) || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },
};

// ============================================
// DASHBOARD API
// ============================================

export const Dashboard = {
  /**
   * Get dashboard statistics
   * Aggregates data from all content types
   */
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      // Fetch all data in parallel
      const [products, projects, staff] = await Promise.all([
        Projects.getAll(),
        Projects.getAll(), // Reusing Projects for now - adjust if you have separate Products endpoint
        Staff.getAll(),
      ]);

      return {
        success: true,
        data: {
          totalProducts: products?.length || 0,
          totalProjects: projects?.length || 0,
          totalStaffMembers: staff?.length || 0,
          recentActivity: [],
        },
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        success: false,
        error: 'Failed to load dashboard statistics',
        data: {
          totalProducts: 0,
          totalProjects: 0,
          totalStaffMembers: 0,
          recentActivity: [],
        },
      };
    }
  },
};
