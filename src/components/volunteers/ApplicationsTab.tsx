import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  UserCheck,
  AlertCircle,
  Star
} from "lucide-react";
import { format } from "date-fns";

export const ApplicationsTab = () => {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("pending");

  // Mock applications data
  const applications = [
    {
      id: 1,
      applicantName: "Anita Gupta",
      email: "anita.gupta@email.com",
      phone: "+91 98765 43210",
      avatar: "/placeholder.svg",
      applicationDate: "2024-01-10",
      status: "pending",
      preferredAreas: ["Youth Programs", "Teaching", "Event Coordination"],
      skills: ["Teaching", "Public Speaking", "Child Psychology", "Hindi", "English"],
      experience: "5 years teaching experience, worked with children's programs",
      availability: "Weekends and evenings",
      motivation: "I want to contribute to the spiritual development of young minds and help preserve our cultural values.",
      address: "Mumbai, Maharashtra",
      emergencyContact: "Rajesh Gupta - +91 98765 43211",
      references: [
        { name: "Dr. Priya Sharma", relation: "Former Colleague", phone: "+91 98765 43212" },
        { name: "Mrs. Meera Singh", relation: "Community Leader", phone: "+91 98765 43213" }
      ],
      backgroundCheck: "pending",
      interviewScheduled: false,
      notes: ""
    },
    {
      id: 2,
      applicantName: "Vikram Singh",
      email: "vikram.singh@email.com",
      phone: "+91 87654 32109",
      avatar: "/placeholder.svg",
      applicationDate: "2024-01-08",
      status: "under-review",
      preferredAreas: ["Temple Services", "Maintenance", "Security"],
      skills: ["Electrical Work", "Plumbing", "Security", "Punjabi", "Hindi"],
      experience: "10 years in facility management, security background",
      availability: "Flexible, can work any shift",
      motivation: "I want to serve the temple and ensure devotees have a safe and comfortable environment for worship.",
      address: "Delhi, India",
      emergencyContact: "Harpreet Kaur - +91 87654 32110",
      references: [
        { name: "Mr. Arjun Kumar", relation: "Former Supervisor", phone: "+91 87654 32111" },
        { name: "Pandit Sharma", relation: "Temple Priest", phone: "+91 87654 32112" }
      ],
      backgroundCheck: "completed",
      interviewScheduled: true,
      interviewDate: "2024-01-18",
      notes: "Strong technical background, good references"
    },
    {
      id: 3,
      applicantName: "Lakshmi Devi",
      email: "lakshmi.devi@email.com",
      phone: "+91 76543 21098",
      avatar: "/placeholder.svg",
      applicationDate: "2024-01-05",
      status: "approved",
      preferredAreas: ["Kitchen Management", "Prasadam Preparation", "Festival Cooking"],
      skills: ["Cooking", "Food Safety", "Kitchen Management", "Tamil", "Sanskrit"],
      experience: "15 years professional cooking, temple kitchen experience",
      availability: "Morning shifts preferred",
      motivation: "Cooking prasadam is my way of serving the divine and the devotees.",
      address: "Chennai, Tamil Nadu",
      emergencyContact: "Ravi Kumar - +91 76543 21099",
      references: [
        { name: "Chef Ramesh", relation: "Former Colleague", phone: "+91 76543 21100" },
        { name: "Mrs. Sita Devi", relation: "Temple Coordinator", phone: "+91 76543 21101" }
      ],
      backgroundCheck: "completed",
      interviewScheduled: false,
      approvalDate: "2024-01-12",
      notes: "Excellent cooking skills, very dedicated"
    },
    {
      id: 4,
      applicantName: "Ravi Shankar",
      email: "ravi.shankar@email.com",
      phone: "+91 65432 10987",
      avatar: "/placeholder.svg",
      applicationDate: "2024-01-12",
      status: "rejected",
      preferredAreas: ["Music", "Bhajan", "Cultural Programs"],
      skills: ["Tabla", "Harmonium", "Singing", "Bengali", "Hindi"],
      experience: "Amateur musician, participated in local cultural events",
      availability: "Evening programs only",
      motivation: "Music is my passion and I want to share it in service of the divine.",
      address: "Kolkata, West Bengal",
      emergencyContact: "Gita Shankar - +91 65432 10988",
      references: [
        { name: "Pandit Raghunath", relation: "Music Teacher", phone: "+91 65432 10989" }
      ],
      backgroundCheck: "completed",
      interviewScheduled: false,
      rejectionDate: "2024-01-14",
      rejectionReason: "Limited availability doesn't match program needs",
      notes: "Good musical skills but availability constraints"
    }
  ];

  const filteredApplications = applications.filter(app => 
    statusFilter === "all" || app.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "under-review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "under-review":
        return <Eye className="w-4 h-4 text-blue-600" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getBackgroundCheckStatus = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Application Review</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredApplications.length} applications
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={application.avatar} />
                    <AvatarFallback>
                      {application.applicantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{application.applicantName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Applied {format(new Date(application.applicationDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(application.status)}
                  {getStatusBadge(application.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{application.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{application.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{application.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{application.availability}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Preferred Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {application.preferredAreas.slice(0, 2).map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                  {application.preferredAreas.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{application.preferredAreas.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {application.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {application.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{application.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">Background Check:</span>
                    {getBackgroundCheckStatus(application.backgroundCheck)}
                  </div>
                  {application.interviewScheduled && (
                    <Badge variant="outline" className="text-xs">
                      Interview Scheduled
                    </Badge>
                  )}
                </div>
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
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Application Review</DialogTitle>
                      </DialogHeader>
                      {selectedApplication && (
                        <ApplicationDetailModal application={selectedApplication} />
                      )}
                    </DialogContent>
                  </Dialog>
                  {application.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No applications found</p>
            <p className="text-muted-foreground">
              No applications match the selected filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Application Detail Modal Component
const ApplicationDetailModal = ({ application }: { application: any }) => {
  const [reviewNotes, setReviewNotes] = useState(application.notes || "");
  const [decision, setDecision] = useState("");

  return (
    <Tabs defaultValue="applicant" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="applicant">Applicant Information</TabsTrigger>
        <TabsTrigger value="preferences">Volunteer Preferences</TabsTrigger>
        <TabsTrigger value="review">Review & Decision</TabsTrigger>
      </TabsList>

      <TabsContent value="applicant" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={application.avatar} />
                <AvatarFallback className="text-lg">
                  {application.applicantName.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{application.applicantName}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(application.status)}
                  {getStatusBadge(application.status)}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{application.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm text-muted-foreground">{application.phone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-muted-foreground">{application.address}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Emergency Contact</Label>
                <p className="text-sm text-muted-foreground">{application.emergencyContact}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Application Date</Label>
              <p className="text-sm text-muted-foreground">
                {format(new Date(application.applicationDate), "MMMM dd, yyyy")}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">References</Label>
              <div className="space-y-2 mt-2">
                {application.references.map((ref: any, index: number) => (
                  <div key={index} className="p-2 border rounded">
                    <p className="font-medium text-sm">{ref.name}</p>
                    <p className="text-xs text-muted-foreground">{ref.relation}</p>
                    <p className="text-xs text-muted-foreground">{ref.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Verification Status</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Background Check</span>
                  <div className="flex items-center space-x-1">
                    {getBackgroundCheckStatus(application.backgroundCheck)}
                    <span className="text-sm capitalize">{application.backgroundCheck}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reference Check</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Pending</span>
                  </div>
                </div>
                {application.interviewScheduled && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interview</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">
                        {application.interviewDate ? format(new Date(application.interviewDate), "MMM dd") : "Scheduled"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="preferences" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Preferred Volunteer Areas</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {application.preferredAreas.map((area: string, index: number) => (
                  <Badge key={index} variant="secondary">{area}</Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Skills & Experience</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {application.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Availability</Label>
              <p className="text-sm text-muted-foreground mt-1">{application.availability}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Experience Details</Label>
              <p className="text-sm text-muted-foreground mt-1">{application.experience}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Motivation Statement</Label>
              <p className="text-sm text-muted-foreground mt-1">{application.motivation}</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="review" className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Coordinator Notes</Label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add your review notes here..."
              rows={4}
              className="mt-2"
            />
          </div>

          {application.status === "pending" && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Decision</Label>
                <Select value={decision} onValueChange={setDecision}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve Application</SelectItem>
                    <SelectItem value="reject">Reject Application</SelectItem>
                    <SelectItem value="interview">Schedule Interview</SelectItem>
                    <SelectItem value="more-info">Request More Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {decision === "reject" && (
                <div>
                  <Label className="text-sm font-medium">Rejection Reason</Label>
                  <Textarea
                    placeholder="Please provide a reason for rejection..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
              )}

              {decision === "interview" && (
                <div>
                  <Label className="text-sm font-medium">Interview Date & Time</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <input
                      type="date"
                      className="px-3 py-2 border rounded-md"
                    />
                    <input
                      type="time"
                      className="px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save Notes</Button>
                <Button className="bg-temple-saffron hover:bg-temple-saffron/90">
                  Submit Decision
                </Button>
              </div>
            </div>
          )}

          {application.status === "approved" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Application Approved</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Approved on {format(new Date(application.approvalDate), "MMMM dd, yyyy")}
              </p>
            </div>
          )}

          {application.status === "rejected" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Application Rejected</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Rejected on {format(new Date(application.rejectionDate), "MMMM dd, yyyy")}
              </p>
              <p className="text-sm text-red-700 mt-1">
                Reason: {application.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};