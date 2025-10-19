// src/hooks/use-communities.tsx - COMPLETE VERSION
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from './use-complete-api';

// ============================================
// INTERFACES
// ============================================

export interface Community {
  id: string;
  name: string;
  description?: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  is_active: boolean;
  member_count?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member' | 'lead';
  is_lead: boolean;
  lead_position?: string;
  joined_at: string;
  is_active: boolean;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface CommunityApplication {
  id: string;
  community_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  why_join?: string;
  skills?: string[];
  experience?: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
}

export interface CommunityTask {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: any[];
  created_by: any;
  due_date?: string;
  tags?: string[];
}

// ============================================
// BASIC COMMUNITY HOOKS
// ============================================

export function useCommunities(filters?: { 
  status?: string; 
  search?: string; 
  owner_id?: string; 
  is_active?: boolean; 
  limit?: number 
}) {
  return useQuery({
    queryKey: ['communities', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.owner_id && filters.owner_id !== 'all') params.append('owner_id', filters.owner_id);
      if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      return await apiRequest(`/communities?${params.toString()}`);
    },
  });
}

export function useCommunity(id: string) {
  return useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const response = await apiRequest(`/communities/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCommunity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/communities', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({
        title: 'Community created',
        description: 'Community has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create community',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCommunity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      return await apiRequest(`/communities/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({
        title: 'Community updated',
        description: 'Community has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update community',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCommunity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/communities/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({
        title: 'Community deleted',
        description: 'Community has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete community',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================
// COMMUNITY MEMBERS HOOKS
// ============================================

export function useCommunityMembers(communityId: string, filters?: { role?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['community-members', communityId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.role) params.append('role', filters.role);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      
      const queryString = params.toString();
      const endpoint = `/communities/${communityId}/members${queryString ? `?${queryString}` : ''}`;
      const response = await apiRequest(endpoint);
      return response.data;
    },
    enabled: !!communityId,
  });
}

export function useAddCommunityMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ communityId, user_id, role }: { communityId: string; user_id: string; role?: string }) => {
      return await apiRequest(`/communities/${communityId}/members`, {
        method: 'POST',
        body: JSON.stringify({ user_id, role: role || 'member' }),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-members', variables.communityId] });
      queryClient.invalidateQueries({ queryKey: ['community', variables.communityId] });
      toast({
        title: 'Member added',
        description: 'Member has been added to the community successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add member',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      communityId, 
      memberId, 
      role, 
      is_lead, 
      lead_position 
    }: { 
      communityId: string; 
      memberId: string; 
      role?: string; 
      is_lead?: boolean; 
      lead_position?: string 
    }) => {
      return await apiRequest(`/communities/${communityId}/members/${memberId}`, {
        method: 'PUT',
        body: JSON.stringify({ role, is_lead, lead_position }),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-members', variables.communityId] });
      queryClient.invalidateQueries({ queryKey: ['community-leads', variables.communityId] });
      toast({
        title: 'Member updated',
        description: 'Member role has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update member',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useRemoveCommunityMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ communityId, memberId }: { communityId: string; memberId: string }) => {
      return await apiRequest(`/communities/${communityId}/members/${memberId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-members', variables.communityId] });
      queryClient.invalidateQueries({ queryKey: ['community', variables.communityId] });
      toast({
        title: 'Member removed',
        description: 'Member has been removed from the community.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to remove member',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useSendEmailToMembers() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      communityId, 
      subject, 
      message, 
      recipient_ids, 
      send_to_all 
    }: { 
      communityId: string; 
      subject: string; 
      message: string; 
      recipient_ids?: string[]; 
      send_to_all?: boolean 
    }) => {
      return await apiRequest(`/communities/${communityId}/members/email`, {
        method: 'POST',
        body: JSON.stringify({ subject, message, recipient_ids, send_to_all }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Emails sent',
        description: `Successfully sent emails to ${data.sent_count} members.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send emails',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useCommunityLeads(communityId: string) {
  return useQuery({
    queryKey: ['community-leads', communityId],
    queryFn: async () => {
      const response = await apiRequest(`/communities/${communityId}/leads`);
      return response.data;
    },
    enabled: !!communityId,
  });
}

// ============================================
// COMMUNITY APPLICATIONS HOOKS (NEW!)
// ============================================

export function useCommunityApplications(communityId: string, status: string = 'pending') {
  return useQuery({
    queryKey: ['community-applications', communityId, status],
    queryFn: async () => {
      const response = await apiRequest(`/communities/${communityId}/applications?status=${status}`);
      return response.data;
    },
    enabled: !!communityId,
  });
}

export function useSubmitApplication() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ communityId, ...data }: any) => {
      return await apiRequest(`/communities/${communityId}/applications`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to submit application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useApproveApplication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      communityId, 
      applicationId, 
      role, 
      review_notes 
    }: { 
      communityId: string; 
      applicationId: string; 
      role?: string; 
      review_notes?: string 
    }) => {
      return await apiRequest(`/communities/${communityId}/applications/${applicationId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ role, review_notes }),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-applications', variables.communityId] });
      queryClient.invalidateQueries({ queryKey: ['community-members', variables.communityId] });
      queryClient.invalidateQueries({ queryKey: ['community', variables.communityId] });
      toast({
        title: 'Application approved',
        description: 'Application has been approved and member added.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to approve application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      communityId, 
      applicationId, 
      review_notes 
    }: { 
      communityId: string; 
      applicationId: string; 
      review_notes?: string 
    }) => {
      return await apiRequest(`/communities/${communityId}/applications/${applicationId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ review_notes }),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-applications', variables.communityId] });
      toast({
        title: 'Application rejected',
        description: 'Application has been rejected.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to reject application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================
// COMMUNITY TASKS HOOKS
// ============================================

export function useCommunityTasks(communityId: string, filters?: { status?: string; priority?: string }) {
  return useQuery({
    queryKey: ['community-tasks', communityId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      
      const queryString = params.toString();
      const endpoint = `/communities/${communityId}/tasks${queryString ? `?${queryString}` : ''}`;
      const response = await apiRequest(endpoint);
      return response.data;
    },
    enabled: !!communityId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ communityId, ...data }: any) => {
      return await apiRequest(`/communities/${communityId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-tasks', variables.communityId] });
      toast({
        title: 'Task created',
        description: 'Task has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ communityId, taskId, ...data }: any) => {
      return await apiRequest(`/communities/${communityId}/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-tasks', variables.communityId] });
      toast({
        title: 'Task updated',
        description: 'Task has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ communityId, taskId }: { communityId: string; taskId: string }) => {
      return await apiRequest(`/communities/${communityId}/tasks/${taskId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-tasks', variables.communityId] });
      toast({
        title: 'Task deleted',
        description: 'Task has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================
// OTHER COMMUNITY HOOKS
// ============================================

export function useCommunityCalendar(communityId: string) {
  return useQuery({
    queryKey: ['community-calendar', communityId],
    queryFn: async () => {
      const response = await apiRequest(`/communities/${communityId}/calendar`);
      return response.data || [];
    },
    enabled: !!communityId,
  });
}

export function useCommunityFinances(communityId: string) {
  return useQuery({
    queryKey: ['community-finances', communityId],
    queryFn: async () => {
      const response = await apiRequest(`/communities/${communityId}/finances`);
      return response.data || {};
    },
    enabled: !!communityId,
  });
}

export function useCommunityTimeline(communityId: string) {
  return useQuery({
    queryKey: ['community-timeline', communityId],
    queryFn: async () => {
      const response = await apiRequest(`/communities/${communityId}/timeline`);
      return response.data || [];
    },
    enabled: !!communityId,
  });
}

export function useCommunityStats(communityId: string) {
  return useQuery({
    queryKey: ['community-stats', communityId],
    queryFn: async () => {
      const response = await apiRequest(`/communities/${communityId}/stats`);
      return response.data || {};
    },
    enabled: !!communityId,
  });
}

// Add to use-communities.tsx

export function useCommunityEvents(communityId: string) {
  return useQuery({
    queryKey: ['community-events', communityId],
    queryFn: async () => {
      const response = await apiRequest(`/communities/${communityId}/events`);
      return response.data || [];
    },
    enabled: !!communityId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ communityId, ...data }: any) => {
      return await apiRequest(`/communities/${communityId}/events`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-events', variables.communityId] });
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
    mutationFn: async ({ communityId, eventId, ...data }: any) => {
      return await apiRequest(`/communities/${communityId}/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-events', variables.communityId] });
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

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ communityId, eventId }: { communityId: string; eventId: string }) => {
      return await apiRequest(`/communities/${communityId}/events/${eventId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-events', variables.communityId] });
      toast({
        title: 'Event deleted',
        description: 'Event has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
