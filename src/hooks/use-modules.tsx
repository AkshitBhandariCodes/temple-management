import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// ================================================
// DONATIONS AND FINANCE HOOKS
// ================================================

export interface Donation {
  id: string;
  donor_id: string;
  community_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_gateway?: string;
  gateway_transaction_id?: string;
  purpose?: string;
  status: string;
  received_at: string;
  processed_at?: string;
  metadata: any;
  created_at: string;
}

export interface CreateDonationData {
  amount: number;
  payment_method: string;
  purpose?: string;
  community_id?: string;
}

// List donations with filtering
export function useDonations(params?: {
  community_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['donations', params],
    queryFn: async () => {
      let query = supabase
        .from('donations')
        .select(`
          *,
          donor:users(id, full_name, email),
          community:communities(id, name)
        `, { count: 'exact' });

      if (params?.community_id) {
        query = query.eq('community_id', params.community_id);
      }

      if (params?.status) {
        query = query.eq('status', params.status);
      }

      if (params?.start_date) {
        query = query.gte('received_at', params.start_date);
      }

      if (params?.end_date) {
        query = query.lte('received_at', params.end_date);
      }

      const limit = params?.limit || 20;
      const page = params?.page || 1;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('received_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    },
  });
}

// Create donation
export function useCreateDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateDonationData) => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('Must be logged in to create donation');

      const { data: donation, error } = await supabase
        .from('donations')
        .insert([{
          ...data,
          donor_id: user.id,
          status: 'completed',
          received_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return donation as Donation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      toast({
        title: 'Donation recorded',
        description: 'Thank you for your generous donation!',
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

export interface Expense {
  id: string;
  community_id: string;
  category: string;
  amount: number;
  currency: string;
  description?: string;
  vendor?: string;
  receipt_url?: string;
  status: string;
  requested_by: string;
  approved_by?: string;
  approved_at?: string;
  expense_date: string;
  created_at: string;
}

export function useExpenses(params?: {
  community_id?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          requester:users!requested_by(id, full_name, email),
          approver:users!approved_by(id, full_name, email),
          community:communities(id, name)
        `, { count: 'exact' });

      if (params?.community_id) {
        query = query.eq('community_id', params.community_id);
      }

      if (params?.status) {
        query = query.eq('status', params.status);
      }

      if (params?.category) {
        query = query.eq('category', params.category);
      }

      const limit = params?.limit || 20;
      const page = params?.page || 1;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('expense_date', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    },
  });
}

// ================================================
// EVENTS HOOKS
// ================================================

export interface Event {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  starts_at: string;
  ends_at?: string;
  timezone: string;
  location?: any;
  max_attendees?: number;
  registration_required: boolean;
  registration_deadline?: string;
  is_recurring: boolean;
  recurrence_pattern?: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

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
      let query = supabase
        .from('events')
        .select(`
          *,
          creator:users!created_by(id, full_name, email),
          community:communities(id, name)
        `, { count: 'exact' });

      if (params?.community_id) {
        query = query.eq('community_id', params.community_id);
      }

      if (params?.status) {
        query = query.eq('status', params.status);
      }

      if (params?.type) {
        query = query.eq('type', params.type);
      }

      if (params?.start_date) {
        query = query.gte('starts_at', params.start_date);
      }

      if (params?.end_date) {
        query = query.lte('starts_at', params.end_date);
      }

      const limit = params?.limit || 20;
      const page = params?.page || 1;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('starts_at', { ascending: true });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    },
  });
}

// ================================================
// PUJAS HOOKS
// ================================================

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
  created_by: string;
  created_at: string;
  updated_at: string;
}

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
      let query = supabase
        .from('puja_series')
        .select(`
          *,
          creator:users!created_by(id, full_name, email),
          community:communities(id, name)
        `, { count: 'exact' });

      if (params?.community_id) {
        query = query.eq('community_id', params.community_id);
      }

      if (params?.status) {
        query = query.eq('status', params.status);
      }

      if (params?.type) {
        query = query.eq('type', params.type);
      }

      const limit = params?.limit || 20;
      const page = params?.page || 1;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    },
  });
}

// ================================================
// VOLUNTEERS HOOKS
// ================================================

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
  created_at: string;
  updated_at: string;
}

export function useVolunteers(params?: {
  community_id?: string;
  skills?: string[];
  availability?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['volunteers', params],
    queryFn: async () => {
      let query = supabase
        .from('volunteer_profiles')
        .select(`
          *,
          user:users(id, full_name, email, phone)
        `, { count: 'exact' });

      const limit = params?.limit || 20;
      const page = params?.page || 1;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    },
  });
}

// ================================================
// TASKS HOOKS
// ================================================

export interface Task {
  id: string;
  event_id?: string;
  community_id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee_id?: string;
  due_date?: string;
  completed_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useTasks(params?: {
  community_id?: string;
  event_id?: string;
  assignee_id?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          assignee:users!assignee_id(id, full_name, email),
          creator:users!created_by(id, full_name, email),
          event:events(id, title),
          community:communities(id, name)
        `, { count: 'exact' });

      if (params?.community_id) {
        query = query.eq('community_id', params.community_id);
      }

      if (params?.event_id) {
        query = query.eq('event_id', params.event_id);
      }

      if (params?.assignee_id) {
        query = query.eq('assignee_id', params.assignee_id);
      }

      if (params?.status) {
        query = query.eq('status', params.status);
      }

      if (params?.priority) {
        query = query.eq('priority', params.priority);
      }

      const limit = params?.limit || 20;
      const page = params?.page || 1;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    },
  });
}

// ================================================
// REPORTS AND ANALYTICS HOOKS
// ================================================

export function useCommunityStats(communityId: string) {
  return useQuery({
    queryKey: ['community-stats', communityId],
    queryFn: async () => {
      // Get member count
      const { count: memberCount } = await supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', communityId)
        .eq('status', 'active');

      // Get event count
      const { count: eventCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', communityId)
        .eq('status', 'published');

      // Get donation total
      const { data: donations } = await supabase
        .from('donations')
        .select('amount')
        .eq('community_id', communityId)
        .eq('status', 'completed');

      const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      // Get volunteer hours
      const { data: volunteerHours } = await supabase
        .from('volunteer_assignments')
        .select(`
          volunteer_shifts!inner(start_time, end_time),
          status
        `)
        .eq('volunteer_shifts.community_id', communityId)
        .eq('status', 'completed');

      const totalVolunteerHours = volunteerHours?.reduce((total, assignment) => {
        if (assignment.volunteer_shifts?.start_time && assignment.volunteer_shifts?.end_time) {
          const start = new Date(`1970-01-01T${assignment.volunteer_shifts.start_time}`);
          const end = new Date(`1970-01-01T${assignment.volunteer_shifts.end_time}`);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return total + hours;
        }
        return total;
      }, 0) || 0;

      return {
        member_count: memberCount || 0,
        event_count: eventCount || 0,
        total_donations: totalDonations,
        total_volunteer_hours: Math.round(totalVolunteerHours),
      };
    },
    enabled: !!communityId,
  });
}

// ================================================
// ACTIVITY TIMELINE HOOKS
// ================================================

export function useActivityTimeline(communityId: string, params?: {
  activity_type?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['activity-timeline', communityId, params],
    queryFn: async () => {
      let query = supabase
        .from('activity_timeline')
        .select(`
          *,
          user:users(id, full_name, email, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (params?.activity_type) {
        query = query.eq('activity_type', params.activity_type);
      }

      if (params?.user_id) {
        query = query.eq('user_id', params.user_id);
      }

      const limit = params?.limit || 50;
      const offset = params?.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId,
  });
}
