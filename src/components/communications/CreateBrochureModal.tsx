import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image, 
  Palette, 
  Type,
  Upload,
  Eye,
  Download,
  Share2,
  QrCode,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface CreateBrochureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateBrochureModal: React.FC<CreateBrochureModalProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [brochureTitle, setBrochureTitle] = useState('');
  const [brochureDescription, setBrochureDescription] = useState('');
  const [category, setCategory] = useState('');
  const [linkedEvent, setLinkedEvent] = useState('');
  const [mainContent, setMainContent] = useState('');

  const templates = [
    {
      id: 'festival',
      name: 'Festival Celebration',
      description: 'Perfect for religious festivals and celebrations',
      thumbnail: '/placeholder.svg',
      category: 'Festivals'
    },
    {
      id: 'event',
      name: 'Event Invitation',
      description: 'General event invitation template',
      thumbnail: '/placeholder.svg',
      category: 'Events'
    },
    {
      id: 'donation',
      name: 'Donation Drive',
      description: 'For fundraising and donation campaigns',
      thumbnail: '/placeholder.svg',
      category: 'General'
    },
    {
      id: 'volunteer',
      name: 'Volunteer Recruitment',
      description: 'Recruit volunteers for temple activities',
      thumbnail: '/placeholder.svg',
      category: 'General'
    },
    {
      id: 'puja',
      name: 'Puja Schedule',
      description: 'Display puja timings and schedules',
      thumbnail: '/placeholder.svg',
      category: 'General'
    },
    {
      id: 'custom',
      name: 'Custom Template',
      description: 'Start from scratch with a blank template',
      thumbnail: '/placeholder.svg',
      category: 'Custom'
    }
  ];

  const events = [
    { id: '1', name: 'Diwali Festival 2024', date: '2024-11-01' },
    { id: '2', name: 'Holi Spring Celebration', date: '2024-03-15' },
    { id: '3', name: 'Monthly Community Gathering', date: '2024-02-10' },
    { id: '4', name: 'Volunteer Training Session', date: '2024-02-05' }
  ];

  const colorSchemes = [
    { id: 'traditional', name: 'Traditional', colors: ['#FF6B35', '#F7931E', '#FFD23F'] },
    { id: 'elegant', name: 'Elegant', colors: ['#2C3E50', '#34495E', '#BDC3C7'] },
    { id: 'vibrant', name: 'Vibrant', colors: ['#E74C3C', '#9B59B6', '#3498DB'] },
    { id: 'peaceful', name: 'Peaceful', colors: ['#27AE60', '#2ECC71', '#A8E6CF'] },
    { id: 'royal', name: 'Royal', colors: ['#8E44AD', '#9B59B6', '#D2B4DE'] }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Brochure</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="template">Template Selection</TabsTrigger>
            <TabsTrigger value="content">Content Creation</TabsTrigger>
            <TabsTrigger value="generation">Generation & Publishing</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedTemplate && selectedTemplate !== 'custom' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Template Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Color Scheme
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {colorSchemes.map((scheme) => (
                          <div key={scheme.id} className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50">
                            <span className="font-medium">{scheme.name}</span>
                            <div className="flex gap-1">
                              {scheme.colors.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="h-5 w-5" />
                        Typography
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label>Header Font</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select header font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="serif">Serif (Traditional)</SelectItem>
                              <SelectItem value="sans">Sans-serif (Modern)</SelectItem>
                              <SelectItem value="script">Script (Elegant)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Body Font</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select body font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sans">Sans-serif</SelectItem>
                              <SelectItem value="serif">Serif</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Brochure Title</Label>
                      <Input
                        id="title"
                        value={brochureTitle}
                        onChange={(e) => setBrochureTitle(e.target.value)}
                        placeholder="Enter brochure title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={brochureDescription}
                        onChange={(e) => setBrochureDescription(e.target.value)}
                        placeholder="Brief description of the brochure..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="festivals">Festivals</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Event Association (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label>Link to Event</Label>
                      <Select value={linkedEvent} onValueChange={setLinkedEvent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an event (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.name} - {event.date}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">
                        Auto-populate event details if linked
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="content">Main Content</Label>
                      <Textarea
                        id="content"
                        value={mainContent}
                        onChange={(e) => setMainContent(e.target.value)}
                        placeholder="Enter the main content for your brochure..."
                        rows={8}
                      />
                    </div>
                    <div>
                      <Label>Images</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Drag and drop images here, or click to browse
                        </p>
                        <Button variant="outline" className="mt-2">
                          <Image className="h-4 w-4 mr-2" />
                          Upload Images
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Phone</Label>
                        <Input placeholder="Temple phone number" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input placeholder="Temple email address" />
                      </div>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Textarea placeholder="Temple address" rows={2} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="qr-code" />
                      <Label htmlFor="qr-code" className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        Generate QR code for contact info
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="generation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>File Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span>PDF Version</span>
                      </div>
                      <Button size="sm">Generate PDF</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span>PowerPoint Version</span>
                      </div>
                      <Button size="sm">Generate PPTX</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Quality Settings</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Quality (Print)</SelectItem>
                        <SelectItem value="medium">Medium Quality (Web)</SelectItem>
                        <SelectItem value="low">Low Quality (Email)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Brochure
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="publish-downloads" defaultChecked />
                      <Label htmlFor="publish-downloads">Publish to Downloads section</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="shareable-link" defaultChecked />
                      <Label htmlFor="shareable-link">Generate shareable link</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="whatsapp-ready" />
                      <Label htmlFor="whatsapp-ready">WhatsApp-ready formatting</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="social-media" />
                      <Label htmlFor="social-media">Social media optimization</Label>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Sharing & Distribution</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Share2 className="h-4 w-4 mr-2" />
                        Generate Public Link
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Download for Distribution
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Distribution
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Brochure Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {brochureTitle || 'Brochure Preview'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {brochureDescription || 'Your brochure preview will appear here'}
                  </p>
                  <Button>
                    <Eye className="h-4 w-4 mr-2" />
                    Generate Preview
                  </Button>
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
              Create & Publish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrochureModal;