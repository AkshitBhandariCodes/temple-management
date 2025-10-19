import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Settings, Users, Calendar, CheckSquare, BarChart3, Clock, Crown, UserPlus } from "lucide-react";
import { Community } from "./types";
import { useCommunity, useCommunityStats } from "@/hooks/use-communities";
import { CommunityOverview } from "./tabs/CommunityOverview";
import { CommunityMembers } from "./tabs/CommunityMembers";
import { CommunityApplications } from "./tabs/CommunityApplications"; // NEW!
import { CommunityCalendar } from "./tabs/CommunityCalendar";
import { CommunityTasks } from "./tabs/CommunityTasks";
import { CommunityKanban } from "./tabs/CommunityKanban";
import { CommunityReports } from "./tabs/CommunityReports";
import { CommunityTimeline } from "./tabs/CommunityTimeline";
import { formatDistanceToNow } from "date-fns";

interface CommunityDetailViewProps {
  communityId: string;
}

function mapBackendToUI(item: any): Community {
  return {
    id: item._id || item.id,
    name: item.name,
    description: item.description || "",
    status: (item.status || 'active').charAt(0).toUpperCase() + (item.status || 'active').slice(1) as Community['status'],
    logo: item.logo_url || "/placeholder.svg",
    owner: {
      id: item.owner_id?._id || item.owner_id || '',
      name: item.owner_id?.full_name || 'Owner',
      email: item.owner_id?.email || '',
      avatar: item.owner_id?.avatar_url || "/placeholder.svg"
    },
    memberCount: item.member_count || 0,
    leadCount: 0,
    activeEvents: 0,
    pendingTasks: 0,
    lastActivity: item.updated_at || item.created_at,
    totalDonations: 0,
    pendingBudgetRequests: 0,
    createdAt: item.created_at
  };
}

export const CommunityDetailView = ({ communityId }: CommunityDetailViewProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [community, setCommunity] = useState<Community | null>(null);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [loading, setLoading] = useState(true);

  const communityQuery = useCommunity(communityId);
  const statsQuery = useCommunityStats(communityId);

  useEffect(() => {
    if (communityQuery.isLoading) {
      setLoading(true);
      return;
    }
    if (communityQuery.data) {
      setCommunity(mapBackendToUI(communityQuery.data));
      setLoading(false);
    }
  }, [communityQuery.isLoading, communityQuery.data]);

  const handleUpdateCommunity = (updatedCommunity: Community) => {
    setCommunity(updatedCommunity);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Inactive": return "secondary";
      case "Archived": return "destructive";
      default: return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/communities")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Communities
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Community Not Found</h3>
            <p className="text-muted-foreground">The community you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/communities")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Communities
        </Button>
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit Community
        </Button>
      </div>

      {/* Community Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={community.logo} />
                <AvatarFallback>
                  {community.name?.substring(0, 2).toUpperCase() || 'CO'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{community.name}</h1>
                  <Badge variant={getStatusBadgeVariant(community.status)}>
                    {community.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{community.description || 'No description'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={community.owner?.avatar} />
                  <AvatarFallback className="bg-temple-cream text-temple-maroon">
                    {community.owner?.name?.substring(0, 2).toUpperCase() || 'OW'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-1">
                  <Crown className="w-4 h-4 text-temple-saffron" />
                  <span className="text-sm text-muted-foreground">
                    {community.owner?.name || 'Owner'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{community.memberCount}</div>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{community.activeEvents}</div>
                  <p className="text-sm text-muted-foreground">Events</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(community.totalDonations)}</div>
                  <p className="text-sm text-muted-foreground">Donations</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
              <span>Created {formatDistanceToNow(new Date(community.createdAt), { addSuffix: true })}</span>
              <span>•</span>
              <span>Last activity {formatDistanceToNow(new Date(community.lastActivity), { addSuffix: true })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Applications</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Kanban</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CommunityOverview community={community} onUpdate={handleUpdateCommunity} />
        </TabsContent>

        <TabsContent value="members">
          <CommunityMembers community={community} />
        </TabsContent>

        <TabsContent value="applications">
          <CommunityApplications community={community} />
        </TabsContent>

        <TabsContent value="calendar">
          <CommunityCalendar community={community} />
        </TabsContent>

        <TabsContent value="tasks">
          <CommunityTasks community={community} />
        </TabsContent>

        <TabsContent value="kanban">
          <CommunityKanban community={community} />
        </TabsContent>

        <TabsContent value="reports">
          <CommunityReports community={community} />
        </TabsContent>

        <TabsContent value="timeline">
          <CommunityTimeline community={community} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
