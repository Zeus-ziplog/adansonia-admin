// lib/api.ts

/**
 * Adansonia Admin API Client
 * Base URL: configurable via VITE_API_URL environment variable.
 * Default: http://localhost:5000/api
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ========== Type Definitions ==========
// (These improve type safety and documentation)

export interface LoginResponse {
  token: string;
  email: string;
  avatar?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role?: string;
  expertise?: string[];
  priority?: number;
  image_url?: string;
  bio?: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  created_at: string;
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  published_date: string;
  published: boolean;
  category?: string;
  tags?: string[];
  image_url?: string;
  created_at: string;
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  icon?: string;
  priority: number;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  practiceArea?: string;
  image_url?: string;
  client?: string;
  outcome?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  avatar?: string;
  created_at: string;
}

// ========== Helper Functions ==========

/**
 * Retrieve authentication headers from the stored session.
 * The session is expected to be a JSON object with a `token` field.
 */
const getAuthHeaders = (): HeadersInit => {
  const sessionStr = localStorage.getItem('admin_token');
  if (!sessionStr) return { 'Content-Type': 'application/json' };

  try {
    const session = JSON.parse(sessionStr);
    return {
      'Content-Type': 'application/json',
      ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
    };
  } catch (err) {
    console.error('Failed to parse session', err);
    return { 'Content-Type': 'application/json' };
  }
};

/**
 * Generic fetch wrapper with error handling.
 * Automatically adds authentication headers when `requiresAuth` is true.
 */
const fetchApi = async <T = any>(
  endpoint: string,
  options?: RequestInit,
  requiresAuth: boolean = false
): Promise<T> => {
  const url = `${API_BASE}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(requiresAuth ? getAuthHeaders() : {}),
    ...options?.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.error || errorMsg;
    } catch {
      // Ignore JSON parsing errors
    }
    throw new Error(errorMsg);
  }

  return res.json();
};

// ========== API Client ==========

export const api = {
  // ===== AUTHENTICATION =====
  login: (email: string, password: string, rememberMe?: boolean): Promise<LoginResponse> =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    }),

  register: (email: string, password: string): Promise<LoginResponse> =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // ===== STAFF (ADVOCATES) =====
  getStaff: (): Promise<Staff[]> => fetchApi('/admin/staff', {}, true),

  createStaff: (data: Partial<Staff> & { image_base64?: string }): Promise<Staff> =>
    fetchApi('/admin/staff', { method: 'POST', body: JSON.stringify(data) }, true),

  updateStaff: (id: string, data: Partial<Staff> & { image_base64?: string }): Promise<Staff> =>
    fetchApi(`/admin/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  deleteStaff: (id: string): Promise<{ success: boolean }> =>
    fetchApi(`/admin/staff/${id}`, { method: 'DELETE' }, true),

  // ===== TESTIMONIALS =====
  getTestimonials: (): Promise<Testimonial[]> => fetchApi('/admin/testimonials', {}, true),

  createTestimonial: (data: Partial<Testimonial>): Promise<Testimonial> =>
    fetchApi('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }, true),

  updateTestimonial: (id: string, data: Partial<Testimonial>): Promise<Testimonial> =>
    fetchApi(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  deleteTestimonial: (id: string): Promise<{ success: boolean }> =>
    fetchApi(`/admin/testimonials/${id}`, { method: 'DELETE' }, true),

  // ===== INSIGHTS =====
  getAdminInsights: (): Promise<Insight[]> => fetchApi('/admin/insights', {}, true),

  createInsight: (data: Partial<Insight> & { image_base64?: string }): Promise<Insight> =>
    fetchApi('/admin/insights', { method: 'POST', body: JSON.stringify(data) }, true),

  updateInsight: (id: string, data: Partial<Insight> & { image_base64?: string }): Promise<Insight> =>
    fetchApi(`/admin/insights/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  deleteInsight: (id: string): Promise<{ success: boolean }> =>
    fetchApi(`/admin/insights/${id}`, { method: 'DELETE' }, true),

  // ===== CAPABILITIES =====
  getCapabilities: (): Promise<Capability[]> => fetchApi('/admin/capabilities', {}, true),

  createCapability: (data: Partial<Capability>): Promise<Capability> =>
    fetchApi('/admin/capabilities', { method: 'POST', body: JSON.stringify(data) }, true),

  updateCapability: (id: string, data: Partial<Capability>): Promise<Capability> =>
    fetchApi(`/admin/capabilities/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  deleteCapability: (id: string): Promise<{ success: boolean }> =>
    fetchApi(`/admin/capabilities/${id}`, { method: 'DELETE' }, true),

  // ===== CASE STUDIES =====
  getCaseStudies: (): Promise<CaseStudy[]> => fetchApi('/admin/case-studies', {}, true),

  createCaseStudy: (data: Partial<CaseStudy> & { image_base64?: string }): Promise<CaseStudy> =>
    fetchApi('/admin/case-studies', { method: 'POST', body: JSON.stringify(data) }, true),

  updateCaseStudy: (id: string, data: Partial<CaseStudy> & { image_base64?: string }): Promise<CaseStudy> =>
    fetchApi(`/admin/case-studies/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  deleteCaseStudy: (id: string): Promise<{ success: boolean }> =>
    fetchApi(`/admin/case-studies/${id}`, { method: 'DELETE' }, true),

  // ===== CONTACT MESSAGES =====
  getContactMessages: (): Promise<ContactMessage[]> => fetchApi('/admin/contact', {}, true),

  // Alias for dashboard compatibility
  getMessages: (): Promise<ContactMessage[]> => fetchApi('/admin/contact', {}, true),

  deleteContactMessage: (id: string): Promise<{ success: boolean }> =>
    fetchApi(`/admin/contact/${id}`, { method: 'DELETE' }, true),

  // ===== ADMIN USERS =====
  getAdmins: (): Promise<Admin[]> => fetchApi('/admin/admins', {}, true),

  createAdmin: (email: string, password: string): Promise<{ success: boolean; email: string }> =>
    fetchApi('/admin/register', { method: 'POST', body: JSON.stringify({ email, password }) }, true),

  deleteAdmin: (id: string): Promise<{ success: boolean }> =>
    fetchApi(`/admin/admins/${id}`, { method: 'DELETE' }, true),
};

// For advanced usage, you may also export a namespaced version:
// export const api = { ... };  (as above)