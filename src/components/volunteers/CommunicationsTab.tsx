import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MessageSquare,
  Send,
  Users,
  Mail,
  Bell,
  Eye,
  Trash2,
  Plus,
  Filter,
  Download,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../utils/supabaseClient";

export const CommunicationsTab = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchNotifications() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("notifications")
        .select(`
          *,
          volunteers (
            id,
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching notifications:", fetchError);
        setError(fetchError.message);
      } else {
        setNotifications(data || []);
      }
    } catch (err: any) {
      console.error("Network error:", err);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }

  async function fetchVolunteers() {
    const { data } = await supabase
      .from("volunteers")
      .select("*")
      .eq("verified", true);
    
    setVolunteers(data || []);
  }

  useEffect(() => {
    fetchNotifications();
    fetchVolunteers();

    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          console.log("Notifications data changed, refetching...");
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredNotifications = notifications.filter(notif => {
    if (selectedType === "all") return true;
    return notif.type === selectedType;
  });

  const getTypeBadge = (type: string) => {
    const colors: any = {
      general: "bg-gray-100 text-gray-800",
      shift: "bg-blue-100 text-blue-800",
      application: "bg-purple-100 text-purple-800",
      announcement: "bg-green-100 text-green-800",
      reminder: "bg-yellow-100 text-yellow-800",
      update: "bg-orange-100 text-orange-800",
      appreciation: "bg-pink-100 text-pink-800",
      urgent: "bg-red-100 text-red-800"
    };
    
    return <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "unread":
        return <Badge className="bg-yellow-100 text-yellow-800">Unread</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
        <MessageSquare className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg font-medium text-red-600">Error Loading Communications</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchNotifications}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Communications</span>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-temple-saffron hover:bg-temple-saffron/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send Notification</DialogTitle>
                </DialogHeader>
                <SendMessageModal 
                  volunteers={volunteers}
                  onClose={() => setIsCreateModalOpen(false)} 
                  onRefresh={fetchNotifications} 
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="shift">Shift</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="appreciation">Appreciation</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message History ({filteredNotifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeBadge(notification.type)}
                      {getStatusBadge(notification.status)}
                      <span className="text-sm text-muted-foreground">
                        {notification.sent_at ? format(new Date(notification.sent_at), "MMM dd, yyyy HH:mm") : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{notification.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span>To: {notification.volunteers?.full_name || 'Unknown'} ({notification.volunteers?.email || 'N/A'})</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      if (confirm('Delete this notification?')) {
                        await supabase.from('notifications').delete().eq('id', notification.id);
                        fetchNotifications();
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No notifications found for the selected filter.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SendMessageModal = ({ volunteers, onClose, onRefresh }: any) => {
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("general");
  const [sending, setSending] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(volunteers.map((v: any) => v.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSend = async () => {
    if (!message.trim() || selectedVolunteers.length === 0) {
      alert("Please enter a message and select at least one recipient");
      return;
    }

    setSending(true);

    const notifications = selectedVolunteers.map(volunteerId => ({
      volunteer_id: volunteerId,
      message: message.trim(),
      type,
      status: "delivered",
      sent_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from("notifications")
      .insert(notifications);

    if (error) {
      console.error("Error sending notifications:", error);
      alert(`Failed to send: ${error.message}`);
    } else {
      onRefresh();
      onClose();
    }

    setSending(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Message Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="shift">Shift</SelectItem>
            <SelectItem value="application">Application</SelectItem>
            <SelectItem value="announcement">Announcement</SelectItem>
            <SelectItem value="reminder">Reminder</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="appreciation">Appreciation</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Recipients ({selectedVolunteers.length} selected)</Label>
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {selectAll ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
        <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
          {volunteers.map((volunteer: any) => (
            <div key={volunteer.id} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedVolunteers.includes(volunteer.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedVolunteers([...selectedVolunteers, volunteer.id]);
                  } else {
                    setSelectedVolunteers(selectedVolunteers.filter(id => id !== volunteer.id));
                  }
                }}
              />
              <label className="text-sm">
                {volunteer.full_name} ({volunteer.email})
              </label>
            </div>
          ))}
          {volunteers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No verified volunteers available
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSend} disabled={sending}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
          Send Message
        </Button>
      </div>
    </div>
  );
};
