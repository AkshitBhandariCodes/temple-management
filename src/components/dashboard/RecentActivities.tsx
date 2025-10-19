import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  Heart,
  Calendar,
  Users,
  Clock,
  DollarSign,
  UserPlus,
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useActivityTimeline } from "@/hooks/use-complete-api";

interface ActivityItem {
  id: string;
  type: 'donation' | 'event' | 'member' | 'task' | 'budget' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  community?: string;
  amount?: number;
  status?: 'success' | 'warning' | 'info' | 'error';
}

export const RecentActivities = () => {
  // Get activities from all communities (or current community)
  const { data: activities, isLoading, error } = useActivityTimeline('all', {
    limit: 20
  });

  // Transform API data to component format
  const transformedActivities: ActivityItem[] = activities?.map(activity => ({
    id: activity.id,
    type: activity.activity_type as any,
    title: activity.title,
    description: activity.description || '',
    timestamp: new Date(activity.created_at),
    user: activity.user?.full_name || 'System',
    community: activity.community_id || 'General',
    amount: activity.metadata?.amount,
    status: activity.activity_type.includes('failed') || activity.activity_type.includes('error') ? 'error' : 'success'
  })) || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <Heart className="w-4 h-4 text-temple-accent" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-temple-saffron" />;
      case 'member':
        return <UserPlus className="w-4 h-4 text-temple-maroon" />;
      case 'task':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'budget':
        return <DollarSign className="w-4 h-4 text-temple-gold" />;
      case 'system':
        return <Settings className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-600" />;
      case 'info':
        return <Info className="w-3 h-3 text-blue-600" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="h-[600px]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-temple-saffron" />
            <span>Recent Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[480px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[600px]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-temple-saffron" />
            <span>Recent Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[480px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load activities</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-temple-saffron" />
            <span>Recent Activities</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {transformedActivities.length} activities
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[480px] px-6">
          <div className="space-y-4">
            {transformedActivities.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activities</p>
                </div>
              </div>
            ) : (
              transformedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                >
                  {/* Activity Icon */}
                  <div className="flex-shrink-0 p-2 bg-temple-cream rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-foreground">
                            {activity.title}
                          </h4>
                          {activity.status && getStatusIcon(activity.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {activity.description}
                        </p>

                        {/* Activity Details */}
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>

                          {activity.user && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{activity.user}</span>
                            </div>
                          )}

                          {activity.community && (
                            <Badge variant="outline" className="text-xs">
                              {activity.community}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Amount Display */}
                      {activity.amount && (
                        <div className="flex items-center space-x-1 text-sm font-semibold text-temple-gold">
                          <TrendingUp className="w-4 h-4" />
                          <span>{formatCurrency(activity.amount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* View All Button */}
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full text-temple-saffron hover:text-temple-saffron hover:bg-temple-cream/50">
            View All Activities
          </Button>
      </CardContent>
    </Card>
  );
};