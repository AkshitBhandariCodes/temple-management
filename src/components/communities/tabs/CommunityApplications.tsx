import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Mail, Phone, Calendar, User } from "lucide-react";
import { 
  useCommunityApplications, 
  useApproveApplication, 
  useRejectApplication 
} from "@/hooks/use-communities";
import { Community } from "../types";
import { formatDistanceToNow } from "date-fns";

interface CommunityApplicationsProps {
  community: Community;
}

export const CommunityApplications = ({ community }: CommunityApplicationsProps) => {
  const [statusFilter, setStatusFilter] = useState('pending');
  
  const { data: applications, isLoading } = useCommunityApplications(community.id, statusFilter);
  const approveApplication = useApproveApplication();
  const rejectApplication = useRejectApplication();

  const handleApprove = async (applicationId: string) => {
    await approveApplication.mutateAsync({
      communityId: community.id,
      applicationId,
      role: 'member'
    });
  };

  const handleReject = async (applicationId: string) => {
    await rejectApplication.mutateAsync({
      communityId: community.id,
      applicationId,
      review_notes: 'Application does not meet current requirements'
    });
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Membership Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({applications?.filter((a: any) => a.status === 'pending').length || 0})
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="space-y-4 mt-4">
              {applications?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No applications found
                </p>
              ) : (
                applications?.map((app: any) => (
                  <Card key={app._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={app.user_id?.avatar_url} />
                            <AvatarFallback>
                              {app.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{app.name}</h3>
                              <Badge variant={
                                app.status === 'approved' ? 'default' :
                                app.status === 'rejected' ? 'destructive' :
                                'secondary'
                              }>
                                {app.status}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {app.email}
                              </div>
                              {app.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {app.phone}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Applied {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-sm font-medium mb-1">Why join:</p>
                              <p className="text-sm text-muted-foreground">{app.why_join || app.message}</p>
                            </div>

                            {app.skills && app.skills.length > 0 && (
                              <div className="mt-3 flex gap-2 flex-wrap">
                                {app.skills.map((skill: string, idx: number) => (
                                  <Badge key={idx} variant="outline">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(app._id)}
                              disabled={approveApplication.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(app._id)}
                              disabled={rejectApplication.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
