import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  UserCheck,
  UserX,
  Filter,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../utils/supabaseClient";

export const ApplicationsTab = () => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchApplications() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("volunteer_applications")
        .select(`
          *,
          volunteers (
            id,
            full_name,
            email,
            phone
          )
        `)
        .order("application_date", { ascending: false });

      if (fetchError) {
        console.error("Error fetching applications:", fetchError);
        setError(fetchError.message);
      } else {
        setApplications(data || []);
      }
    } catch (err: any) {
      console.error("Network error:", err);
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();

    const channel = supabase
      .channel("applications-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "volunteer_applications" },
        () => {
          console.log("Applications data changed, refetching...");
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredApplications = applications.filter(app => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApprove = async (applicationId: string, volunteerId: string) => {
    const { error } = await supabase
      .from("volunteer_applications")
      .update({
        status: "approved",
        approval_date: new Date().toISOString()
      })
      .eq("id", applicationId);

    if (!error) {
      // Update volunteer status
      await supabase
        .from("volunteers")
        .update({ verified: true })
        .eq("id", volunteerId);
      
      fetchApplications();
    } else {
      alert("Failed to approve application");
    }
  };

  const handleReject = async (applicationId: string, reason: string) => {
    const { error } = await supabase
      .from("volunteer_applications")
      .update({
        status: "rejected",
        rejection_date: new Date().toISOString(),
        rejection_reason: reason
      })
      .eq("id", applicationId);

    if (!error) {
      fetchApplications();
    } else {
      alert("Failed to reject application");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg font-medium text-red-600">Error Loading Applications</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchApplications}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Volunteer Applications</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {application.volunteers?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{application.volunteers?.full_name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{application.volunteers?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{application.phone || application.volunteers?.phone || 'N/A'}</p>
                      <p className="text-muted-foreground">{application.address || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {application.application_date ? format(new Date(application.application_date), "MMM dd, yyyy") : 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                          </DialogHeader>
                          {selectedApplication && (
                            <ApplicationDetailsModal 
                              application={selectedApplication} 
                              onApprove={handleApprove}
                              onReject={handleReject}
                              onRefresh={fetchApplications}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      {application.status === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(application.id, application.volunteer_id)}
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              const reason = prompt("Rejection reason:");
                              if (reason) handleReject(application.id, reason);
                            }}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No applications found for the selected filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ApplicationDetailsModal = ({ application, onApprove, onReject, onRefresh }: any) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Full Name</Label>
          <p className="text-sm">{application.volunteers?.full_name || 'N/A'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Email</Label>
          <p className="text-sm">{application.volunteers?.email || 'N/A'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Phone</Label>
          <p className="text-sm">{application.phone || 'N/A'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Address</Label>
          <p className="text-sm">{application.address || 'N/A'}</p>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Skills</Label>
        <div className="flex flex-wrap gap-1 mt-2">
          {application.skills?.map((skill: string, idx: number) => (
            <Badge key={idx} variant="secondary">{skill}</Badge>
          )) || <span className="text-sm text-muted-foreground">No skills listed</span>}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Interests</Label>
        <div className="flex flex-wrap gap-1 mt-2">
          {application.interests?.map((interest: string, idx: number) => (
            <Badge key={idx} variant="secondary">{interest}</Badge>
          )) || <span className="text-sm text-muted-foreground">No interests listed</span>}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Preferred Areas</Label>
        <div className="flex flex-wrap gap-1 mt-2">
          {application.preferred_areas?.map((area: string, idx: number) => (
            <Badge key={idx} variant="secondary">{area}</Badge>
          )) || <span className="text-sm text-muted-foreground">No preferred areas</span>}
        </div>
      </div>

      {application.experience && (
        <div>
          <Label className="text-sm font-medium">Experience</Label>
          <p className="text-sm mt-1">{application.experience}</p>
        </div>
      )}

      {application.motivation && (
        <div>
          <Label className="text-sm font-medium">Motivation</Label>
          <p className="text-sm mt-1">{application.motivation}</p>
        </div>
      )}

      {application.status === "pending" && (
        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          {!showRejectInput ? (
            <>
              <Button
                variant="outline"
                onClick={() => setShowRejectInput(true)}
                className="text-red-600"
              >
                <UserX className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => {
                  onApprove(application.id, application.volunteer_id);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          ) : (
            <div className="w-full space-y-2">
              <Textarea
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowRejectInput(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (rejectionReason.trim()) {
                      onReject(application.id, rejectionReason);
                      setShowRejectInput(false);
                    } else {
                      alert("Please provide a reason for rejection");
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {application.status === "approved" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Approved on {application.approval_date ? format(new Date(application.approval_date), "MMMM dd, yyyy") : 'N/A'}
          </p>
        </div>
      )}

      {application.status === "rejected" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            <XCircle className="w-4 h-4 inline mr-2" />
            Rejected on {application.rejection_date ? format(new Date(application.rejection_date), "MMMM dd, yyyy") : 'N/A'}
          </p>
          {application.rejection_reason && (
            <p className="text-sm text-red-700 mt-2">Reason: {application.rejection_reason}</p>
          )}
        </div>
      )}
    </div>
  );
};
