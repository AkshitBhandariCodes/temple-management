import { useState } from "react";
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
  Smartphone,
  Bell,
  Calendar,
  Eye,
  Edit,
  Copy,
  Trash2,
  Plus,
  Filter,
  Download,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

export const CommunicationsTab = () => {
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  // Mock communication history data
  const communicationHistory = [
    {
      id: 1,
      subject: "Weekly Shift Assignments",
      content: "Dear volunteers, please find your shift assignments for this week...",
      audience: "All Active Volunteers",
      recipientCount: 156,
      sentDate: "2024-01-15T10:00:00",
      deliveryRate: 98,
      openRate: 85,
      responseRate: 12,
      channels: ["email", "sms"],
      status: "delivered",
      sender: "Volunteer Coordinator"
    },
    {
      id: 2,
      subject: "Festival Preparation - Extra Volunteers Needed",
      content: "We need additional volunteers for the upcoming Maha Shivaratri festival...",
      audience: "Event Volunteers",
      recipientCount: 45,
      sentDate: "2024-01-12T14:30:00",
      deliveryRate: 100,
      openRate: 92,
      responseRate: 28,
      channels: ["email", "push"],
      status: "delivered",
      sender: "Event Coordinator"
    },
    {
      id: 3,
      subject: "Monthly Volunteer Appreciation",
      content: "Thank you for your dedicated service this month. Your contributions...",
      audience: "All Volunteers",
      recipientCount: 180,
      sentDate: "2024-01-01T09:00:00",
      deliveryRate: 97,
      openRate: 78,
      responseRate: 8,
      channels: ["email"],
      status: "delivered",
      sender: "Temple Administration"
    },
    {
      id: 4,
      subject: "Kitchen Safety Training Reminder",
      content: "This is a reminder about the mandatory kitchen safety training...",
      audience: "Kitchen Volunteers",
      recipientCount: 25,
      sentDate: "2024-01-10T16:00:00",
      deliveryRate: 100,
      openRate: 88,
      responseRate: 35,
      channels: ["email", "sms"],
      status: "delivered",
      sender: "Kitchen Coordinator"
    }
  ];

  // Mock message templates
  const messageTemplates = [
    {
      id: 1,
      name: "Shift Assignment",
      category: "Scheduling",
      subject: "Your Shift Assignment for {date}",
      content: "Dear {volunteer_name},\n\nYou have been assigned to the following shift:\n\nDate: {date}\nTime: {time}\nLocation: {location}\nRole: {role}\n\nPlease confirm your availability.\n\nBest regards,\nVolunteer Coordination Team",
      usage: 45
    },
    {
      id: 2,
      name: "Shift Reminder",
      category: "Reminders",
      subject: "Reminder: Your shift tomorrow at {time}",
      content: "Dear {volunteer_name},\n\nThis is a friendly reminder about your shift tomorrow:\n\nDate: {date}\nTime: {time}\nLocation: {location}\n\nPlease arrive 15 minutes early.\n\nThank you for your service!",
      usage: 78
    },
    {
      id: 3,
      name: "Welcome New Volunteer",
      category: "Onboarding",
      subject: "Welcome to our Volunteer Family!",
      content: "Dear {volunteer_name},\n\nWelcome to our volunteer community! We're excited to have you join us in serving the temple.\n\nYour application has been approved and you can now:\n- View available shifts\n- Update your preferences\n- Connect with other volunteers\n\nWe look forward to working with you!\n\nBlessings,\nVolunteer Team",
      usage: 12
    },
    {
      id: 4,
      name: "Monthly Appreciation",
      category: "Recognition",
      subject: "Thank You for Your Service",
      content: "Dear {volunteer_name},\n\nWe want to express our heartfelt gratitude for your dedicated service this month.\n\nYour contributions:\n- Hours served: {hours}\n- Shifts completed: {shifts}\n- Impact made: Immeasurable\n\nYour selfless service helps create a spiritual haven for all devotees.\n\nWith gratitude,\nTemple Administration",
      usage: 8
    }
  ];

  // Mock audience options
  const audienceOptions = [
    { id: "all", label: "All Volunteers", count: 180 },
    { id: "active", label: "Active Volunteers", count: 156 },
    { id: "kitchen", label: "Kitchen Volunteers", count: 25 },
    { id: "temple", label: "Temple Service Volunteers", count: 45 },
    { id: "events", label: "Event Volunteers", count: 38 },
    { id: "youth", label: "Youth Program Volunteers", count: 15 },
    { id: "new", label: "New Volunteers (Last 30 days)", count: 12 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "sending":
        return <Badge className="bg-blue-100 text-blue-800">Sending</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getChannelIcons = (channels: string[]) => {
    return channels.map((channel, index) => {
      switch (channel) {
        case "email":
          return <Mail key={index} className="w-4 h-4 text-blue-600" />;
        case "sms":
          return <Smartphone key={index} className="w-4 h-4 text-green-600" />;
        case "push":
          return <Bell key={index} className="w-4 h-4 text-purple-600" />;
        default:
          return null;
      }
    });
  };

  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    if (checked) {
      setSelectedAudience([...selectedAudience, audienceId]);
    } else {
      setSelectedAudience(selectedAudience.filter(id => id !== audienceId));
    }
  };

  const getTotalRecipients = () => {
    return selectedAudience.reduce((total, audienceId) => {
      const audience = audienceOptions.find(opt => opt.id === audienceId);
      return total + (audience?.count || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="history">Communication History</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Broadcast Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Audience Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Select Audience</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {audienceOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={option.id}
                        checked={selectedAudience.includes(option.id)}
                        onCheckedChange={(checked) => handleAudienceChange(option.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="font-medium cursor-pointer">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{option.count} volunteers</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedAudience.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{getTotalRecipients()}</strong> volunteers will receive this message
                    </p>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template">Use Template (Optional)</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {messageTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Message Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Normal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Enter message subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter your message content here..."
                    rows={8}
                  />
                </div>
              </div>

              {/* Delivery Options */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Delivery Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" defaultChecked />
                    <Label htmlFor="email" className="flex items-center space-x-2 cursor-pointer">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms" />
                    <Label htmlFor="sms" className="flex items-center space-x-2 cursor-pointer">
                      <Smartphone className="w-4 h-4" />
                      <span>SMS</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="push" />
                    <Label htmlFor="push" className="flex items-center space-x-2 cursor-pointer">
                      <Bell className="w-4 h-4" />
                      <span>Push Notification</span>
                    </Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Send Option</Label>
                    <Select defaultValue="now">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Send Immediately</SelectItem>
                        <SelectItem value="schedule">Schedule for Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Recurring</Label>
                    <Select defaultValue="none">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">One-time</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-temple-saffron hover:bg-temple-saffron/90">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Communication History</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communicationHistory.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{message.subject}</h3>
                          {getStatusBadge(message.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {message.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{message.audience}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(message.sentDate), "MMM dd, yyyy 'at' HH:mm")}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>By {message.sender}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {getChannelIcons(message.channels)}
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{message.recipientCount}</div>
                        <div className="text-xs text-muted-foreground">Recipients</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{message.deliveryRate}%</div>
                        <div className="text-xs text-muted-foreground">Delivered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{message.openRate}%</div>
                        <div className="text-xs text-muted-foreground">Opened</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">{message.responseRate}%</div>
                        <div className="text-xs text-muted-foreground">Responded</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Copy className="w-5 h-5" />
                  <span>Message Templates</span>
                </div>
                <Button className="bg-temple-saffron hover:bg-temple-saffron/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messageTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          {template.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {template.content.substring(0, 120)}...
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-muted-foreground">
                        Used {template.usage} times
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};