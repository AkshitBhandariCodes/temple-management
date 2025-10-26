// src/hooks/use-budget-requests.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:5000/api';

// Types
interface BudgetRequest {
  id: string;
  community_id: string;
  budget_amount: number;
  purpose: string;
  event_name?: string;
  documents: Array<{
    name: string;
    url: string;
    type?: string;
  }>;
  requested_by?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  rejected_by?: string;
  approved_amount?: number;
  approval_notes?: string;
  rejection_reason?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  community?: {
    id: string;
    name: string;
    logo?: string;
  };
}

interface CreateBudgetRequestData {
  community_id: string;
  budget_amount: number;
  purpose: string;
  event_name?: string;
  documents?: Array<{
    name: string;
    url: string;
    type?: string;
  }>;
  requested_by?: string;
}

interface ApproveBudgetRequestData {
  approved_by?: string;
  approval_notes?: string;
  approved_amount?: number;
}

interface RejectBudgetRequestData {
  rejected_by?: string;
  rejection_reason?: string;
}

// API Functions
const budgetRequestsApi = {
  // Get all budget requests (for finance team)
  getAll: async (params?: { status?: string; community_id?: string }): Promise<BudgetRequest[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.community_id) searchParams.append('community_id', params.community_id);
    
    const response = await fetch(`${API_BASE_URL}/budget-requests?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch budget requests');
    const data = await response.json();
    return data.data;
  },

  // Get budget requests for a specific community
  getByCommunity: async (communityId: string, status?: string): Promise<BudgetRequest[]> => {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    
    const response = await fetch(`${API_BASE_URL}/budget-requests/community/${communityId}?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch community budget requests');
    const data = await response.json();
    return data.data;
  },

  // Create new budget request
  create: async (requestData: CreateBudgetRequestData): Promise<BudgetRequest> => {
    const response = await fetch(`${API_BASE_URL}/budget-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to create budget request');
    const data = await response.json();
    return data.data;
  },

  // Approve budget request
  approve: async (requestId: string, approvalData: ApproveBudgetRequestData): Promise<BudgetRequest> => {
    const response = await fetch(`${API_BASE_URL}/budget-requests/${requestId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(approvalData),
    });
    if (!response.ok) throw new Error('Failed to approve budget request');
    const data = await response.json();
    return data.data;
  },

  // Reject budget request
  reject: async (requestId: string, rejectionData: RejectBudgetRequestData): Promise<BudgetRequest> => {
    const response = await fetch(`${API_BASE_URL}/budget-requests/${requestId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rejectionData),
    });
    if (!response.ok) throw new Error('Failed to reject budget request');
    const data = await response.json();
    return data.data;
  },

  // Delete budget request
  delete: async (requestId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/budget-requests/${requestId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete budget request');
  },
};

// Hooks
export const useBudgetRequests = (communityId?: string, status?: string) => {
  return useQuery({
    queryKey: ['budgetRequests', communityId, status],
    queryFn: () => {
      if (communityId) {
        return budgetRequestsApi.getByCommunity(communityId, status);
      }
      return budgetRequestsApi.getAll({ status, community_id: communityId });
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useAllBudgetRequests = (params?: { status?: string; community_id?: string }) => {
  return useQuery({
    queryKey: ['budgetRequests', 'all', params],
    queryFn: () => budgetRequestsApi.getAll(params),
    staleTime: 30000,
  });
};

export const useCreateBudgetRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: budgetRequestsApi.create,
    onSuccess: (newRequest) => {
      // Invalidate and refetch budget requests
      queryClient.invalidateQueries({ queryKey: ['budgetRequests'] });
      
      // Optionally update the cache directly
      queryClient.setQueryData(
        ['budgetRequests', newRequest.community_id],
        (oldData: BudgetRequest[] | undefined) => {
          if (!oldData) return [newRequest];
          return [newRequest, ...oldData];
        }
      );
    },
  });
};

export const useApproveBudgetRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, approvalData }: { requestId: string; approvalData: ApproveBudgetRequestData }) =>
      budgetRequestsApi.approve(requestId, approvalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetRequests'] });
    },
  });
};

export const useRejectBudgetRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, rejectionData }: { requestId: string; rejectionData: RejectBudgetRequestData }) =>
      budgetRequestsApi.reject(requestId, rejectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetRequests'] });
    },
  });
};

export const useDeleteBudgetRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: budgetRequestsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetRequests'] });
    },
  });
};