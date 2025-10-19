import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  TestTube
} from 'lucide-react';

interface CreateBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateBroadcastModal: React.FC<CreateBroadcastModalProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('audience');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [subject, setSubject] = useState('');
  const [schedulingOption, setSchedulingOption] = useState('immediate');

  const audienceTypes = [
    { id: 'all', name: 'All Users', count: 8500, description: 'All registered users' },
    { id: 'community', name: 'Community Members', count: 3200, description: 'Active community participants' },
    { id: 'donors', name: 'Donors', count: 1800, description: 'Users who have made donations' },
    { id: 'volunteers', name: 'Volunteers', count: 450, description: 'Registered volunteers' },
    { id: 'attendees', name: 'Event Attendees', count: 2100, description: 'Recent event participants' },
    { id: 'custom', name: 'Custom Segment', count: 0, description: 'Manually selected users' }
  ];

  const channels = [
    { id: 'email', name: 'Email', icon: Mail, description: 'Rich HTML emails' },
    { id: 'sms', name: 'SMS', icon: Smartphone, description: 'Text messages (160 chars)' },
    { id: 'push', name: 'Push Notification', icon: Bell, description: 'Mobile app notifications' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, description: 'WhatsApp messages' }
  ];

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const getEstimatedReach = () => {
    const audience = audienceTypes.find(a => a.id === selectedAudience);
    return audience ? audience.count : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Broadcast</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="audience">Audience Selection</TabsTrigger>
            <TabsTrigger value="content">Message Content</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          </TabsList>

          <TabsContent value="audience" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Target Audience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audienceTypes.map((audience) => (
                  <Card 
                    key={audience.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedAudience === audience.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAudience(audience.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{audience.name}</h4>
                        <Badge variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          {audience.count.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{audience.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedAudience && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Audience Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All locations</SelectItem>
                        <SelectItem value="local">Local area</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Engagement Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All levels</SelectItem>
                        <SelectItem value="high">High engagement</SelectItem>
                        <SelectItem value="medium">Medium engagement</SelectItem>
                        <SelectItem value="low">Low engagement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Subscription Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All subscribers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All subscribers</SelectItem>
                        <SelectItem value="active">Active only</SelectItem>
                        <SelectItem value="inactive">Inactive only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Audience Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{getEstimatedReach().toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Estimated recipients</p>
                  </div>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Recipients
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Communication Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <Card 
                      key={channel.id}
                      className={`cursor-pointer transition-colors ${
                        selectedChannels.includes(channel.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleChannelToggle(channel.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <h4 className="font-medium">{channel.name}</h4>
                            <p className="text-sm text-gray-600">{channel.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {selectedChannels.length > 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject line..."
                  />
                </div>

                <div>
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter your message content..."
                    rows={8}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can use personalization tokens like {{name}}, {{community}}
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
              </div>
            )}
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Options</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="immediate" 
                    checked={schedulingOption === 'immediate'}
                    onCheckedChange={() => setSchedulingOption('immediate')}
                  />
                  <Label htmlFor="immediate" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send immediately
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="scheduled" 
                    checked={schedulingOption === 'scheduled'}
                    onCheckedChange={() => setSchedulingOption('scheduled')}
                  />
                  <Label htmlFor="scheduled" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule for later
                  </Label>
                </div>

                {schedulingOption === 'scheduled' && (
                  <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="recurring" 
                    checked={schedulingOption === 'recurring'}
                    onCheckedChange={() => setSchedulingOption('recurring')}
                  />
                  <Label htmlFor="recurring" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recurring schedule
                  </Label>
                </div>

                {schedulingOption === 'recurring' && (
                  <div className="ml-6">
                    <Label>Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Batch Size</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 messages/batch</SelectItem>
                      <SelectItem value="500">500 messages/batch</SelectItem>
                      <SelectItem value="1000">1000 messages/batch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Delivery Speed</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow (1 batch/hour)</SelectItem>
                      <SelectItem value="medium">Medium (1 batch/15min)</SelectItem>
                      <SelectItem value="fast">Fast (1 batch/5min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button>
              {schedulingOption === 'immediate' ? 'Send Now' : 'Schedule Broadcast'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBroadcastModal;