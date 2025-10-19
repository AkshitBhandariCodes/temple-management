import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Heart,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Zap,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  href?: string;
  onClick?: () => void;
  isPrimary?: boolean;
}

export const QuickActions = () => {
  const quickActions: QuickAction[] = [
    {
      id: 'create-event',
      title: 'Create Event',
      description: 'Schedule new temple event',
      icon: Calendar,
      color: 'text-temple-saffron',
      bgColor: 'bg-temple-saffron/10 hover:bg-temple-saffron/20',
      href: '/events/create',
      isPrimary: true,
    },
    {
      id: 'add-donation',
      title: 'Add Donation',
      description: 'Record new donation',
      icon: Heart,
      color: 'text-temple-accent',
      bgColor: 'bg-temple-accent/10 hover:bg-temple-accent/20',
      href: '/donations/add',
    },
    {
      id: 'new-community',
      title: 'New Community',
      description: 'Register community group',
      icon: Users,
      color: 'text-temple-maroon',
      bgColor: 'bg-temple-maroon/10 hover:bg-temple-maroon/20',
      href: '/communities/create',
    },
    {
      id: 'send-broadcast',
      title: 'Send Broadcast',
      description: 'Message all devotees',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      href: '/communications/broadcast',
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create financial report',
      icon: FileText,
      color: 'text-temple-gold',
      bgColor: 'bg-temple-gold/10 hover:bg-temple-gold/20',
      href: '/reports/generate',
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'User administration',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      href: '/settings/users',
    },
  ];

  const handleActionClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      // TODO: Navigate to the href
      console.log(`Navigate to: ${action.href}`);
    }
  };

  return (
    <Card className="h-[600px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-temple-gold" />
            <span>Quick Actions</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {quickActions.length} actions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          
          return (
            <Button
              key={action.id}
              variant="ghost"
              onClick={() => handleActionClick(action)}
              className={`w-full h-auto p-4 justify-start text-left transition-all duration-200 ${action.bgColor} border border-transparent hover:border-border group`}
            >
              <div className="flex items-center space-x-4 w-full">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${action.bgColor.replace('hover:', '')} group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-5 h-5 ${action.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground group-hover:text-temple-saffron transition-colors">
                      {action.title}
                    </h3>
                    {action.isPrimary && (
                      <Badge variant="default" className="bg-temple-saffron text-white text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-muted-foreground rotate-45" />
                </div>
              </div>
            </Button>
          );
        })}

        {/* Additional Quick Stats */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Today's Summary</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending Tasks</span>
              <Badge variant="outline" className="text-temple-maroon">
                8 items
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Events Today</span>
              <Badge variant="outline" className="text-temple-saffron">
                3 events
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New Messages</span>
              <Badge variant="outline" className="text-blue-600">
                12 unread
              </Badge>
            </div>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            Emergency Actions
          </h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Emergency Broadcast
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Cancel All Events
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};