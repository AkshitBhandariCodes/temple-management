import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { CommunitiesHeader } from "./CommunitiesHeader";
import { CommunitiesTable } from "./CommunitiesTable";
import { CreateCommunityModal } from "./CreateCommunityModal";
import { Community } from "./types";
import { useCommunities, useCreateCommunity, useUpdateCommunity } from "@/hooks/use-communities";
import { useAuth } from "@/hooks/use-auth";

// Map backend community shape to UI `Community` type for the table
function mapBackendToUI(item: any): Community {
  return {
    id: item._id || item.id,
    name: item.name,
    description: item.description || "",
    status: (item.status || 'active').charAt(0).toUpperCase() + (item.status || 'active').slice(1) as Community['status'],
    logo: item.logo_url || item.logo || "/placeholder.svg",
    owner: {
      id: item.owner_id || item.owner?.id,
      name: item.owner?.full_name || item.owner?.name || 'Owner',
      email: item.owner?.email || '',
      avatar: item.owner?.avatar_url || item.owner?.avatar || "/placeholder.svg"
    },
    memberCount: item.member_count || item.members?.length || 0,
    leadCount: 0,
    activeEvents: 0,
    pendingTasks: 0,
    lastActivity: item.updated_at || item.created_at,
    totalDonations: 0,
    pendingBudgetRequests: 0,
    createdAt: item.created_at
  };
}

export const CommunitiesManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");

  // Try to fetch from API with proper parameters
  const { data, isLoading, error } = useCommunities({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm || undefined,
    owner_id: ownerFilter !== 'all' ? ownerFilter : undefined
  });
  const createCommunity = useCreateCommunity();
  const updateCommunity = useUpdateCommunity();

  const backendCommunities = useMemo(() => {
    if (error || !data?.data) {
      console.log("🔄 No backend data available");
      return [];
    }

    const list = data?.data || [];
    return Array.isArray(list) ? list.map(mapBackendToUI) : [];
  }, [data, error]);

  // Use useEffect to update communities when backend data changes
  useEffect(() => {
    setCommunities(backendCommunities);
  }, [backendCommunities]);

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || community.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesOwner = ownerFilter === "all" || community.owner.name === ownerFilter;

    return matchesSearch && matchesStatus && matchesOwner;
  });

  const handleViewDetails = (community: Community) => {
    navigate(`/communities/${community.id}`);
  };

  const handleEditCommunity = (community: Community) => {
    navigate(`/communities/${community.id}`);
  };

  const handleCreateCommunity = async (newCommunity: Omit<Community, 'id' | 'createdAt'>) => {
    try {
      console.log("📝 Creating community:", newCommunity);

      // ✅ Try to create in backend
      const response = await createCommunity.mutateAsync({
        name: newCommunity.name,
        slug: newCommunity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newCommunity.description,
        logo_url: newCommunity.logo,
        owner_id: user?.id || newCommunity.owner.id,
        status: newCommunity.status.toLowerCase(),
      });

      console.log("✅ Community created successfully:", response);

      // ✅ Refresh communities list
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      
      toast({
        title: "Community created",
        description: `${newCommunity.name} has been created successfully.`,
      });

      setIsCreateModalOpen(false);

    } catch (err) {
      console.error('❌ Failed to create community:', err);
      
      toast({
        title: "Failed to create community",
        description: err?.message || "Please check your connection and try again",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCommunity = (updatedCommunity: Community) => {
    setCommunities(prev =>
      prev.map(c => c.id === updatedCommunity.id ? updatedCommunity : c)
    );
  };

  const handleToggleStatus = async (communityId: string) => {
    const target = communities.find(c => c.id === communityId);
    if (!target) return;

    const nextStatus = target.status === "Active" ? "Inactive" : "Active";

    try {
      await updateCommunity.mutateAsync({ 
        id: communityId, 
        status: nextStatus.toLowerCase() 
      });
      
      handleUpdateCommunity({
        ...target,
        status: nextStatus as Community['status']
      });

      toast({
        title: "Status updated",
        description: `Community status changed to ${nextStatus}`,
      });
    } catch (err) {
      console.error('Error toggling status:', err);
      toast({
        title: "Failed to update status",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleArchiveCommunity = async (communityId: string) => {
    const target = communities.find(c => c.id === communityId);
    if (!target) return;

    try {
      await updateCommunity.mutateAsync({ 
        id: communityId, 
        status: 'archived' 
      });
      
      handleUpdateCommunity({
        ...target,
        status: 'Archived' as Community['status']
      });

      toast({
        title: "Community archived",
        description: "Community has been archived successfully",
      });
    } catch (err) {
      console.error('Error archiving community:', err);
      toast({
        title: "Failed to archive community",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <CommunitiesHeader
        onCreateCommunity={() => setIsCreateModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        ownerFilter={ownerFilter}
        onOwnerFilterChange={setOwnerFilter}
        communities={communities}
      />

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Backend API unavailable. Please check your connection.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : (
        <CommunitiesTable
          communities={filteredCommunities}
          onViewDetails={handleViewDetails}
          onEditCommunity={handleEditCommunity}
          onToggleStatus={handleToggleStatus}
          onArchiveCommunity={handleArchiveCommunity}
        />
      )}

      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCommunity}
      />
    </div>
  );
};
