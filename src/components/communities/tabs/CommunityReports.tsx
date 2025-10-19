import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  CheckSquare, 
  TrendingUp, 
  Activity,
  UserPlus,
  Clock
} from "lucide-react";
import { Community } from "../types";
import { 
  useCommunityMembers, 
  useCommunityTasks, 
  useCommunityEvents,
  useCommunityStats 
} from "@/hooks/use-communities";

interface CommunityReportsProps {
  community: Community;
}

export const CommunityReports = ({ community }: CommunityReportsProps) => {
  const { data: members, isLoading: membersLoading } = useCommunityMembers(community.id);
  const { data: tasks, isLoading: tasksLoading } = useCommunityTasks(community.id);
  const { data: events, isLoading: eventsLoading } = useCommunityEvents(community.id);
  const { data: stats, isLoading: statsLoading } = useCommunityStats(community.id);

  const isLoading = membersLoading || tasksLoading || eventsLoading || statsLoading;

  // Calculate statistics
  const totalMembers = members?.length || 0;
  const activeMembers = members?.filter((m: any) => m.status === 'active').length || 0;
  const leads = members?.filter((m: any) => m.is_lead).length || 0;

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t: any) => t.status === 'completed').length || 0;
  const inProgressTasks = tasks?.filter((t: any) => t.status === 'in_progress').length || 0;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalEvents = events?.length || 0;
  const upcomingEvents = events?.filter((e: any) => 
    new Date(e.start_date) > new Date()
  ).length || 0;

  const statsCards = [
    {
      title: "Total Members",
      value: totalMembers,
      change: "+12%",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Members",
      value: activeMembers,
      change: `${Math.round((activeMembers / totalMembers) * 100) || 0}%`,
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Community Leads",
      value: leads,
      icon: UserPlus,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: CheckSquare,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      change: `${taskCompletionRate}%`,
      icon: TrendingUp,
      color: "text-teal-500",
      bgColor: "bg-teal-50"
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Total Events",
      value: totalEvents,
      icon: Calendar,
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents,
      icon: Calendar,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading reports...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Analytics & Reports</CardTitle>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    {stat.change && (
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Task Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-muted-foreground">
                  {completedTasks} / {totalTasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${taskCompletionRate}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">In Progress</span>
                <span className="text-sm text-muted-foreground">
                  {inProgressTasks} / {totalTasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Member Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium">Active Members</span>
              <Badge>{activeMembers}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium">Community Leads</span>
              <Badge variant="secondary">{leads}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium">Total Events Organized</span>
              <Badge variant="outline">{totalEvents}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
