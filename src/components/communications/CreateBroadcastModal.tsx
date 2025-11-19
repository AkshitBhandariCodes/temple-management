import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Mail,
  Smartphone,
  Bell,
  MessageCircle,
  Calendar,
  Clock,
  Send,
  Eye,
  TestTube,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface CreateBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateBroadcastModal: React.FC<CreateBroadcastModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("audience");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [subject, setSubject] = useState("");
  const [schedulingOption, setSchedulingOption] = useState("immediate");
  const [senderEmail, setSenderEmail] = useState("admin@temple.com");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRecipients, setIsFetchingRecipients] = useState(false);
  const [recipients, setRecipients] = useState<any[]>([]);

  // Fetch recipients from demo_user_profiles based on role
  useEffect(() => {
    if (open && selectedAudience) {
      fetchRecipients();
    }
  }, [open, selectedAudience]);

  const fetchRecipients = async () => {
    setIsFetchingRecipients(true);
    try {
      let query = supabase
        .from('demo_user_profiles')  // ✅ Changed to demo table
        .select('id, full_name, email, phone, role');  // ✅ Changed 'name' to 'full_name'

      // Filter by role if not "all"
      if (selectedAudience !== 'all' && selectedAudience !== '' && selectedAudience !== 'custom') {
        query = query.eq('role', selectedAudience);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recipients:', error);
        toast.error('Failed to load recipients');
        setRecipients([]);
        return;
      }

      // Map full_name to name for consistency
      const mappedRecipients = (data || []).map(user => ({
        id: user.id,
        name: user.full_name,  // ✅ Map full_name to name
        email: user.email,
        phone: user.phone,
        role: user.role,
      }));

      setRecipients(mappedRecipients);
      console.log(`✅ Loaded ${mappedRecipients.length} recipients for role: ${selectedAudience}`);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load recipients');
      setRecipients([]);
    } finally {
      setIsFetchingRecipients(false);
    }
  };

  const audienceTypes = [
    {
      id: "volunteers",
      name: "Volunteers",
      count: recipients.filter(r => r.role === 'volunteers').length,
      description: "Registered volunteers",
    },
    {
      id: "all",
      name: "All Users",
      count: recipients.length,
      description: "All registered users",
    },
    {
      id: "community_member",
      name: "Community Members",
      count: recipients.filter(r => r.role === 'community_member').length,
      description: "Temple community members",
    },
    {
      id: "donor",
      name: "Donors",
      count: recipients.filter(r => r.role === 'donor').length,
      description: "Active donors",
    },
    {
      id: "priest",
      name: "Priests",
      count: recipients.filter(r => r.role === 'priest').length,
      description: "Temple priests",
    },
    {
      id: "devotee",
      name: "Devotees",
      count: recipients.filter(r => r.role === 'devotee').length,
      description: "Regular devotees",
    },
    {
      id: "event_organizer",
      name: "Event Organizers",
      count: recipients.filter(r => r.role === 'event_organizer').length,
      description: "Event coordinators",
    },
    {
      id: "admin",
      name: "Administrators",
      count: recipients.filter(r => r.role === 'admin').length,
      description: "System administrators",
    },
    {
      id: "custom",
      name: "Custom Segment",
      count: 0,
      description: "Manually selected users",
    },
  ];

  const channels = [
    { id: "email", name: "Email", icon: Mail, description: "Rich HTML emails" },
    {
      id: "sms",
      name: "SMS",
      icon: Smartphone,
      description: "Text messages (160 chars)",
    },
    {
      id: "push",
      name: "Push Notification",
      icon: Bell,
      description: "Mobile app notifications",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      description: "WhatsApp messages",
    },
  ];

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const getEstimatedReach = () => {
    const audience = audienceTypes.find((a) => a.id === selectedAudience);
    return audience ? audience.count : 0;
  };

  const getRecipientEmails = () => {
    return recipients.map(r => r.email).filter(Boolean);
  };

  const handleSaveAsDraft = async () => {
    setIsLoading(true);
    try {
      const broadcast = {
        subject,
        content: messageContent,
        channel: selectedChannels[0] || 'email',
        audience: selectedAudience,
        status: 'draft',
        total_recipients: recipients.length,
        sent_count: 0,
        failed_count: 0,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('broadcasts').insert([broadcast]);

      if (error) throw error;

      toast.success('Broadcast saved as draft');
      onOpenChange(false);
      if (onSuccess) onSuccess();
      resetForm();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (
      !selectedAudience ||
      !subject ||
      !messageContent ||
      selectedChannels.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedChannels.includes("email")) {
      toast.error("Email channel is required for now");
      return;
    }

    setIsLoading(true);
    try {
      const recipientEmails = getRecipientEmails();
      if (recipientEmails.length === 0) {
        toast.error("No recipients found");
        setIsLoading(false);
        return;
      }

      // Create broadcast record
      const broadcast = {
        subject,
        content: messageContent,
        channel: 'email',
        audience: selectedAudience,
        status: schedulingOption === 'scheduled' ? 'scheduled' : 'sending',
        total_recipients: recipientEmails.length,
        sent_count: 0,
        failed_count: 0,
        created_at: new Date().toISOString(),
      };

      const { data: broadcastData, error: broadcastError } = await supabase
        .from('broadcasts')
        .insert([broadcast])
        .select()
        .single();

      if (broadcastError) throw broadcastError;

      // Send emails via API
      let sentCount = 0;
      let failedCount = 0;

      for (const email of recipientEmails) {
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email,
              subject: subject,
              content: messageContent,
            }),
          });

          if (response.ok) {
            sentCount++;
          } else {
            failedCount++;
          }
        } catch {
          failedCount++;
        }
      }

      // Update broadcast status
      await supabase
        .from('broadcasts')
        .update({
          status: 'completed',
          sent_count: sentCount,
          failed_count: failedCount,
        })
        .eq('id', broadcastData.id);

      toast.success(`Email sent to ${sentCount} recipients!`);
      resetForm();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedAudience("");
    setSelectedChannels([]);
    setSubject("");
    setMessageContent("");
    setSchedulingOption("immediate");
    setRecipients([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Broadcast</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="audience">Audience Selection</TabsTrigger>
            <TabsTrigger value="message">Message Content</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          </TabsList>

          {/* Audience Tab */}
          <TabsContent value="audience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Target Audience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {audienceTypes.map((audience) => (
                  <div
                    key={audience.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAudience === audience.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAudience(audience.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{audience.name}</h4>
                        <p className="text-sm text-gray-600">
                          {audience.description}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {isFetchingRecipients ? '...' : audience.count.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedAudience && (
              <Card>
                <CardHeader>
                  <CardTitle>Audience Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-3xl font-bold">
                        {isFetchingRecipients ? (
                          <Loader2 className="h-6 w-6 animate-spin inline" />
                        ) : (
                          getEstimatedReach().toLocaleString()
                        )}
                      </p>
                      <p className="text-sm text-gray-600">Estimated recipients</p>
                    </div>
                  </div>
                  <Button className="mt-4" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Recipients
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Message Content Tab */}
          <TabsContent value="message" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Communication Channels</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div
                      key={channel.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedChannels.includes(channel.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleChannelToggle(channel.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedChannels.includes(channel.id)}
                          onCheckedChange={() => handleChannelToggle(channel.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4" />
                            <span className="font-semibold">{channel.name}</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {channel.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {selectedChannels.length > 0 && (
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label>Sender Email</Label>
                    <Input
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="Enter sender email..."
                    />
                  </div>

                  <div>
                    <Label>Subject Line</Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject line..."
                    />
                  </div>

                  <div>
                    <Label>Message Content</Label>
                    <Textarea
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Enter your message content..."
                      rows={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can use personalization tokens like {`{{ name }}`}, {`{{ community }}`}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Scheduling Tab */}
          <TabsContent value="scheduling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="immediate"
                    checked={schedulingOption === "immediate"}
                    onCheckedChange={() => setSchedulingOption("immediate")}
                  />
                  <label htmlFor="immediate">Send immediately</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scheduled"
                    checked={schedulingOption === "scheduled"}
                    onCheckedChange={() => setSchedulingOption("scheduled")}
                  />
                  <label htmlFor="scheduled">Schedule for later</label>
                </div>

                {schedulingOption === "scheduled" && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div>
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input type="time" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveAsDraft} disabled={isLoading}>
              Save as Draft
            </Button>
            <Button onClick={handleSendEmail} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {schedulingOption === "immediate"
                    ? "Send Now"
                    : "Schedule Broadcast"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBroadcastModal;
