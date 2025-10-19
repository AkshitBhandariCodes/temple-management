import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Eye, Edit, MoreHorizontal, Users, Calendar, CheckSquare, DollarSign, Archive, RotateCcw } from "lucide-react";
import { Community } from "./types";
import { formatDistanceToNow } from "date-fns";

interface CommunitiesTableProps {
  communities: Community[];
  onViewDetails: (community: Community) => void;
  onEditCommunity: (community: Community) => void;
  onToggleStatus: (communityId: string) => void;
  onArchiveCommunity: (communityId: string) => void;
}

export const CommunitiesTable = ({
  communities,
  onViewDetails,
  onEditCommunity,
  onToggleStatus,
  onArchiveCommunity
}: CommunitiesTableProps) => {
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

  if (communities.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No communities found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Community Info</TableHead>
              <TableHead>Owner & Members</TableHead>
              <TableHead>Activity Metrics</TableHead>
              <TableHead>Financial Summary</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communities.map((community) => (
              <TableRow key={community.id} className="hover:bg-muted/50">
                {/* Community Info */}
                <TableCell className="min-w-[250px]">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 rounded-lg">
                      <AvatarImage src={community.logo} alt={community.name} />
                      <AvatarFallback className="rounded-lg">
                        {community.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => onViewDetails(community)}
                        className="font-medium text-foreground hover:text-primary text-left block truncate"
                      >
                        {community.name}
                      </button>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {community.description}
                      </p>
                      <Badge 
                        variant={getStatusBadgeVariant(community.status)}
                        className="mt-2"
                      >
                        {community.status}
                      </Badge>
                    </div>
                  </div>
                </TableCell>

                {/* Owner & Members */}
                <TableCell className="min-w-[200px]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={community.owner.avatar} alt={community.owner.name} />
                        <AvatarFallback className="text-xs">
                          {community.owner.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate">{community.owner.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {community.memberCount} members
                      </span>
                      <span>{community.leadCount} leads</span>
                    </div>
                    <Button
  variant="ghost"
  size="sm"
  onClick={(e) => {
    e.stopPropagation();
    onEditCommunity(community); // This will navigate to detail page
  }}
>
  <Users className="h-4 w-4 mr-2" />
  Manage Members
</Button>
                  </div>
                </TableCell>

                {/* Activity Metrics */}
                <TableCell className="min-w-[180px]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      <span>{community.activeEvents} active events</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckSquare className="w-3 h-3 text-green-500" />
                      <span>{community.pendingTasks} pending tasks</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last activity: {formatDistanceToNow(new Date(community.lastActivity), { addSuffix: true })}
                    </div>
                  </div>
                </TableCell>

                {/* Financial Summary */}
                <TableCell className="min-w-[180px]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="w-3 h-3 text-green-500" />
                      <span>{formatCurrency(community.totalDonations)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {community.pendingBudgetRequests} pending requests
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs p-1 h-auto"
                      onClick={() => onViewDetails(community)}
                    >
                      View Reports
                    </Button>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditCommunity(community)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(community)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onToggleStatus(community.id)}>
                          {community.status === "Active" ? (
                            <>
                              <Archive className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        {community.status !== "Archived" && (
                          <DropdownMenuItem 
                            onClick={() => onArchiveCommunity(community.id)}
                            className="text-destructive"
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};