// src/hooks/use-complete-api.tsx - COMPLETE FIXED VERSION
// ================================================
// COMPLETE API HOOKS FOR TEMPLE MANAGEMENT SYSTEM
// MongoDB Backend Integration with Enhanced Error Handling
// ================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// API Base URL - Update this to match your backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ FIXED: Enhanced API request function with detailed logging
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log('🔵 API Request:', {
    method: options.method || 'GET',
    url,
    body: options.body ? JSON.parse(options.body as string) : null
  });

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('temple_token') || localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({ message: 'Invalid JSON response' }));

    console.log('🟢 API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data
    });

    // ✅ FIXED: Better error handling with detailed messages
    if (!response.ok) {
      const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error('🔴 API Error:', {
        status: response.status,
        message: errorMessage,
        fullData: data
      });
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    console.error('🔴 API Request Failed:', {
      endpoint,
      url,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// ================================================
// INTERFACE DEFINITIONS
// ================================================

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  owner_id: string;
  logo_url?: string;
  cover_image_url?: string;
  status: 'active' | 'inactive' | 'archived';
  settings: any;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  receipt_number: string;
  transaction_id: string;
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string;
  gross_amount: number;
  provider_fees: number;
  net_amount: number;
  currency: string;
  source: string;
  provider: string;
  payment_method: string;
  status: string;
  received_at: string;
  reconciled: boolean;
  community_id?: string;
  event_id?: string;
  notes?: string;
  metadata?: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  description: string;
  vendor_name: string;
  receipt_number: string;
  amount: number;
  currency: string;
  category: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  expense_date: string;
  entry_date: string;
  receipt_attached: boolean;
  receipt_url?: string;
  notes?: string;
  community_id?: string;
  event_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  requester?: User;
  approver?: User;
  community?: any;
}

export interface Event {
  id: string;
  community_id?: string;
  title: string;
  description?: string;
  location?: string;
  location_coords?: any;
  starts_at: string;
  ends_at: string;
  timezone: string;
  visibility: 'public' | 'community' | 'private';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  capacity?: number;
  registration_required: boolean;
  registration_deadline?: string;
  is_recurring: boolean;
  recurring_pattern?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurring_frequency?: number;
  recurring_days_of_week?: number[];
  recurring_day_of_month?: number;
  recurring_week_of_month?: number;
  recurring_end_date?: string;
  recurring_count?: number;
  created_by: string;
  updated_by?: string;
  published_at?: string;
  cancelled_at?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  creator?: User;
  community?: any;
}

export interface PujaSeries {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  deity?: string;
  type: string;
  status: string;
  schedule_config: any;
  start_date: string;
  end_date?: string;
  max_participants?: number;
  registration_required: boolean;
  priest_id?: string;
  location?: string;
  duration_minutes: number;
  requirements?: string[];
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator?: User;
  community?: any;
}

export interface VolunteerProfile {
  id: string;
  user_id: string;
  skills: string[];
  interests: string[];
  availability?: any;
  emergency_contact?: any;
  background_check_status: string;
  onboarding_completed: boolean;
  total_hours_volunteered: number;
  rating?: number;
  preferences?: any;
  community_id?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Broadcast {
  id: string;
  template_id?: string;
  channel: string;
  audience_type: string;
  audience_filters?: any;
  subject?: string;
  content: string;
  scheduled_at?: string;
  sent_at?: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  created_by: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: string;
  subject?: string;
  content: string;
  variables?: any[];
  is_active: boolean;
  category: string;
  created_by: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// ================================================
// COMMUNITIES HOOKS
// ================================================

export function useCommunities(params?: {
  status?: string;
  search?: string;
  owner_id?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['communities', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }

      if (params?.owner_id && params.owner_id !== 'all') {
        queryParams.append('owner_id', params.owner_id);
      }

      if (params?.search) {
        queryParams.append('search', params.search);
      }

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/communities${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint);
      return response;
    },
  });
}

export function useCommunity(id: string) {
  return useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const response = await apiRequest(`/communities/${id}`);
      return response.data as Community;
    },
    enabled: !!id,
  });
}

// ================================================
// DONATIONS HOOKS
// ================================================

export function useDonations(params?: {
  status?: string;
  source?: string;
  start_date?: string;
  end_date?: string;
  community_id?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['donations', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }

      if (params?.source && params.source !== 'all') {
        queryParams.append('source', params.source);
      }

      if (params?.start_date) {
        queryParams.append('start_date', params.start_date);
      }

      if (params?.end_date) {
        queryParams.append('end_date', params.end_date);
      }

      if (params?.community_id && params.community_id !== 'all') {
        queryParams.append('community_id', params.community_id);
      }

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/donations${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint);
      return response;
    },
  });
}

export function useCreateDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      receipt_number: string;
      transaction_id: string;
      gross_amount: number;
      net_amount: number;
      source: string;
      provider: string;
      payment_method: string;
      donor_name?: string;
      donor_email?: string;
      donor_phone?: string;
      community_id?: string;
      event_id?: string;
      notes?: string;
    }) => {
      return await apiRequest('/donations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      toast({
        title: 'Donation recorded',
        description: 'Donation has been recorded successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to record donation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ================================================
// EXPENSES HOOKS
// ================================================

export function useExpenses(params?: {
  status?: string;
  category?: string;
  community_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }

      if (params?.category && params.category !== 'all') {
        queryParams.append('category', params.category);
      }

      if (params?.community_id && params.community_id !== 'all') {
        queryParams.append('community_id', params.community_id);
      }

      if (params?.start_date) {
        queryParams.append('start_date', params.start_date);
      }

      if (params?.end_date) {
        queryParams.append('end_date', params.end_date);
      }

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/expenses${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint);
      return response;
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      description: string;
      vendor_name: string;
      receipt_number: string;
      amount: number;
      category: string;
      expense_date: string;
      community_id?: string;
      event_id?: string;
      notes?: string;
    }) => {
      return await apiRequest('/expenses', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Expense created',
        description: 'Expense has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create expense',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ================================================
// EVENTS HOOKS
// ================================================

export function useEvents(params?: {
  community_id?: string;
  status?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params?.community_id && params.community_id !== 'all') {
        queryParams.append('community_id', params.community_id);
      }

      if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }

      if (params?.start_date) {
        queryParams.append('start_date', params.start_date);
      }

      if (params?.end_date) {
        queryParams.append('end_date', params.end_date);
      }

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/events${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint);
      return response;
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      community_id?: string;
      title: string;
      description?: string;
      location?: string;
      starts_at: string;
      ends_at: string;
      timezone?: string;
      visibility?: string;
      capacity?: number;
      registration_required?: boolean;
      registration_deadline?: string;
    }) => {
      return await apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event created',
        description: 'Event has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title?: string;
      description?: string;
      location?: string;
      starts_at?: string;
      ends_at?: string;
      status?: string;
      visibility?: string;
      capacity?: number;
      registration_required?: boolean;
    }) => {
      return await apiRequest(`/events/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event updated',
        description: 'Event has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ================================================
// PUJAS HOOKS
// ================================================

export function usePujaSeries(params?: {
  community_id?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['puja-series', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params?.community_id && params.community_id !== 'all') {
        queryParams.append('community_id', params.community_id);
      }

      if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }

      if (params?.type && params.type !== 'all') {
        queryParams.append('type', params.type);
      }

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/pujas${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint);
      return response;
    },
  });
}

// ================================================
// VOLUNTEERS HOOKS
// ================================================

export function useVolunteers(params?: {
  community_id?: string;
  skills?: string[];
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['volunteers', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params?.community_id && params.community_id !== 'all') {
        queryParams.append('community_id', params.community_id);
      }

      if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }

      if (params?.skills && params.skills.length > 0) {
        queryParams.append('skills', params.skills.join(','));
      }

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/volunteers${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint);
      return response;
    },
  });
}

// ================================================
// BROADCASTS HOOKS
// ================================================

export function useBroadcasts(params?: {
  status?: string;
  channel?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['broadcasts', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }

      if (params?.channel && params.channel !== 'all') {
        queryParams.append('channel', params.channel);
      }

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/broadcasts${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint);
      return response;
    },
  });
}

export function useCreateBroadcast() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      channel: string;
      audience_type: string;
      subject?: string;
      content: string;
      scheduled_at?: string;
      template_id?: string;
    }) => {
      return await apiRequest('/broadcasts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts'] });
      toast({
        title: 'Broadcast created',
        description: 'Broadcast has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create broadcast',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ================================================
// COMMUNICATION TEMPLATES HOOKS
// ================================================

export function useCommunicationTemplates(params?: {
  type?: string;
  category?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['templates', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params?.type && params.type !== 'all') {
        queryParams.append('type', params.type);
      }

      if (params?.category && params.category !== 'all') {
        queryParams.append('category', params.category);
      }

      if (params?.is_active !== undefined) {
        queryParams.append('is_active', params.is_active.toString());
      }

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/templates${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint);
      return response;
    },
  });
}

// ================================================
// USERS AND AUTHENTICATION HOOKS
// ================================================

export function useRegisterUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      full_name?: string;
      phone?: string;
    }) => {
      return await apiRequest('/users/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      toast({
        title: 'Registration successful',
        description: 'Welcome to Temple Steward!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useLoginUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
    }) => {
      return await apiRequest('/users/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      toast({
        title: 'Login successful',
        description: 'Welcome back to Temple Steward!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
