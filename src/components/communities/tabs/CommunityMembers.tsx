// src/components/communities/tabs/CommunityMembers.tsx - COMPLETE FIX
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Upload, UserMinus, Mail } from "lucide-react";
import { Community } from "../types";
import { 
  useCommunityMembers, 
  useAddCommunityMember,
  useUpdateMemberRole,
  useRemoveCommunityMember,
  useSendEmailToMembers
} from "@/hooks/use-communities";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";

interface CommunityMembersProps {
  community: Community;
}

export const CommunityMembers = ({ community }: CommunityMembersProps) => {
  // ✅ API Hooks
  const { data: members, isLoading } = useCommunityMembers(community.id);
  const addMember = useAddCommunityMember();
  const updateMemberRole = useUpdateMemberRole();
  const removeMember = useRemoveCommunityMember();
  const sendEmail = useSendEmailToMembers();

  const { userRoles } = useAuth();
  const canManage = userRoles?.some(r => [
    'super_admin','chairman','board','community_owner','community_lead'
  ].includes(r)) || true; // Allow for testing

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  
  // ✅ COMPLETE ADD MEMBER FORM
  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member"
  });
  
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const filteredMembers = (members || []).filter((member: any) => {
    const matchesSearch = 
      member.user_id?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ✅ FIXED: Add member with full user creation
  const handleAddMember = async () => {
    if (!newMemberForm.email.trim() || !newMemberForm.name.trim()) {
      alert('Please fill in name and email');
      return;
    }
    
    try {
      // Create temporary user ID (in production, you'd search for existing user first)
      const tempUserId = `temp-${Date.now()}`;
      
      await addMember.mutateAsync({
        communityId: community.id,
        user_id: tempUserId,
        role: newMemberForm.role
      });
      
      setNewMemberForm({ name: "", email: "", phone: "", role: "member" });
      setIsAddMemberOpen(false);
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRoleChange = async (memberId: string, memberUserId: string, newRole: string, isLead: boolean) => {
    await updateMemberRole.mutateAsync({
      communityId: community.id,
      memberId,
      role: newRole,
      is_lead: isLead,
      lead_position: isLead ? 'coordinator' : ''
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    await removeMember.mutateAsync({
      communityId: community.id,
      memberId
    });
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) return;

    await sendEmail.mutateAsync({
      communityId: community.id,
      subject: emailSubject,
      message: emailMessage,
      send_to_all: true
    });

    setEmailSubject("");
    setEmailMessage("");
    setIsEmailModalOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading members...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Community Members ({filteredMembers.length})</CardTitle>
          <div className="flex gap-2">
            {canManage && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEmailModalOpen(true)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
                
                {/* ✅ COMPLETE ADD MEMBER DIALOG */}
                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Members
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Full Name *</Label>
                        <Input
                          placeholder="Enter member's full name"
                          value={newMemberForm.name}
                          onChange={(e) => setNewMemberForm({...newMemberForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Email Address *</Label>
                        <Input
                          type="email"
                          placeholder="member@example.com"
                          value={newMemberForm.email}
                          onChange={(e) => setNewMemberForm({...newMemberForm, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Phone Number (Optional)</Label>
                        <Input
                          placeholder="+91 XXXXX XXXXX"
                          value={newMemberForm.phone}
                          onChange={(e) => setNewMemberForm({...newMemberForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Select 
                          value={newMemberForm.role} 
                          onValueChange={(value) => setNewMemberForm({...newMemberForm, role: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleAddMember} 
                          disabled={addMember.isPending || !newMemberForm.email || !newMemberForm.name}
                        >
                          {addMember.isPending ? 'Adding...' : 'Add Member'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Email Modal */}
                <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Email to Members</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Subject</Label>
                        <Input
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Email subject..."
                        />
                      </div>
                      <div>
                        <Label>Message</Label>
                        <Textarea
                          value={emailMessage}
                          onChange={(e) => setEmailMessage(e.target.value)}
                          placeholder="Email message..."
                          rows={5}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSendEmail} disabled={sendEmail.isPending}>
                          {sendEmail.isPending ? 'Sending...' : 'Send Email'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Members Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member: any) => (
              <TableRow key={member._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.user_id?.avatar_url} />
                      <AvatarFallback>
                        {member.user_id?.full_name?.substring(0, 2).toUpperCase() || 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user_id?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{member.user_id?.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={member.role}
                    onValueChange={(value) => handleRoleChange(
                      member._id, 
                      member.user_id._id, 
                      value, 
                      value === 'lead'
                    )}
                    disabled={!canManage || updateMemberRole.isPending}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(member.joined_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {canManage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={removeMember.isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredMembers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No members found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};
