import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  UserPlus,
  Phone,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Loader2,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../utils/supabaseClient";

export const VolunteersTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch volunteers
  async function fetchVolunteers() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching volunteers:", fetchError);
        setError(fetchError.message);
      } else {
        setVolunteers(data || []);
      }
    } catch (err: any) {
      console.error("Network error:", err);
      setError("Failed to fetch volunteers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVolunteers();

    // Real-time subscription
    const channel = supabase
      .channel("volunteers-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "volunteers" },
        () => {
          console.log("Volunteers data changed, refetching...");
          fetchVolunteers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = 
      volunteer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.phone?.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "verified" && volunteer.verified) ||
      (statusFilter === "unverified" && !volunteer.verified) ||
      (statusFilter === "onboarded" && volunteer.onboarded);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (volunteer: any) => {
    if (!volunteer.verified) {
      return <Badge variant="destructive">Unverified</Badge>;
    }
    if (!volunteer.onboarded) {
      return <Badge variant="secondary">Pending Onboarding</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
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
        <p className="text-lg font-medium text-red-600">Error Loading Volunteers</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchVolunteers}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Volunteer Management</span>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-temple-saffron hover:bg-temple-saffron/90">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Volunteer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Volunteer</DialogTitle>
                </DialogHeader>
                <CreateVolunteerModal onClose={() => setIsCreateModalOpen(false)} onRefresh={fetchVolunteers} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search volunteers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Volunteers</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="onboarded">Onboarded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers List */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteers ({filteredVolunteers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Volunteer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVolunteers.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={volunteer.avatar_url} />
                        <AvatarFallback>
                          {volunteer.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'V'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{volunteer.full_name}</p>
                        <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="w-3 h-3" />
                        <span>{volunteer.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills?.slice(0, 2).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {volunteer.skills?.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{volunteer.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(volunteer)}</TableCell>
                  <TableCell>
                    {volunteer.created_at ? format(new Date(volunteer.created_at), "MMM dd, yyyy") : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedVolunteer(volunteer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Volunteer Details</DialogTitle>
                          </DialogHeader>
                          {selectedVolunteer && <VolunteerDetailsModal volunteer={selectedVolunteer} onRefresh={fetchVolunteers} />}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={async () => {
                          if (confirm('Delete this volunteer?')) {
                            await supabase.from('volunteers').delete().eq('id', volunteer.id);
                            fetchVolunteers();
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredVolunteers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No volunteers found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Create Volunteer Modal
const CreateVolunteerModal = ({ onClose, onRefresh }: { onClose: () => void; onRefresh: () => void }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!fullName || !email) {
      alert("Please fill in required fields (Name and Email)");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("volunteers").insert({
      full_name: fullName,
      email,
      phone,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      languages: languages.split(',').map(l => l.trim()).filter(Boolean),
      verified: false,
      onboarded: false
    });

    if (error) {
      console.error("Error creating volunteer:", error);
      alert(`Failed: ${error.message}`);
    } else {
      onRefresh();
      onClose();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" />
      </div>
      <div className="space-y-2">
        <Label>Skills (comma separated)</Label>
        <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Temple Services, Event Management" />
      </div>
      <div className="space-y-2">
        <Label>Languages (comma separated)</Label>
        <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Hindi" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Volunteer'}
        </Button>
      </div>
    </div>
  );
};

// Volunteer Details Modal
const VolunteerDetailsModal = ({ volunteer, onRefresh }: { volunteer: any; onRefresh: () => void }) => {
  const [verified, setVerified] = useState(volunteer.verified);
  const [onboarded, setOnboarded] = useState(volunteer.onboarded);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("volunteers")
      .update({ verified, onboarded })
      .eq("id", volunteer.id);

    if (error) {
      console.error("Error updating volunteer:", error);
      alert("Failed to update");
    } else {
      onRefresh();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Full Name</Label>
          <p className="text-sm">{volunteer.full_name}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Email</Label>
          <p className="text-sm">{volunteer.email}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Phone</Label>
          <p className="text-sm">{volunteer.phone || 'N/A'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Joined</Label>
          <p className="text-sm">{volunteer.created_at ? format(new Date(volunteer.created_at), "MMMM dd, yyyy") : 'N/A'}</p>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Skills</Label>
        <div className="flex flex-wrap gap-1 mt-2">
          {volunteer.skills?.map((skill: string, idx: number) => (
            <Badge key={idx} variant="secondary">{skill}</Badge>
          )) || <span className="text-sm text-muted-foreground">No skills listed</span>}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Languages</Label>
        <div className="flex flex-wrap gap-1 mt-2">
          {volunteer.languages?.map((lang: string, idx: number) => (
            <Badge key={idx} variant="secondary">{lang}</Badge>
          )) || <span className="text-sm text-muted-foreground">No languages listed</span>}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label>Verified Status</Label>
          <Button
            variant={verified ? "default" : "outline"}
            size="sm"
            onClick={() => setVerified(!verified)}
          >
            {verified ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
            {verified ? 'Verified' : 'Not Verified'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Label>Onboarding Status</Label>
          <Button
            variant={onboarded ? "default" : "outline"}
            size="sm"
            onClick={() => setOnboarded(!onboarded)}
          >
            {onboarded ? <CheckCircle className="w-4 h-4 mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
            {onboarded ? 'Onboarded' : 'Pending'}
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleUpdate} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </div>
    </div>
  );
};
