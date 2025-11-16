import React, { useState, useEffect } from 'react';
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
  FileText, Image, Palette, Type, Upload, Eye, Download,
  Share2, QrCode, Calendar, MapPin, Phone, Mail, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface CreateBrochureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateBrochureModal: React.FC<CreateBrochureModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [brochureTitle, setBrochureTitle] = useState('');
  const [brochureDescription, setBrochureDescription] = useState('');
  const [category, setCategory] = useState('');
  const [linkedEvent, setLinkedEvent] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [events, setEvents] = useState([]);
  
  // ✅ New state for image upload and generation
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (open) {
      // Fetch events from your database if needed
      // For now using static data
    }
  }, [open]);

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

  const colorSchemes = [
    { id: 'traditional', name: 'Traditional', colors: ['#FF6B35', '#F7931E', '#FFD23F'] },
    { id: 'elegant', name: 'Elegant', colors: ['#2C3E50', '#34495E', '#BDC3C7'] },
    { id: 'vibrant', name: 'Vibrant', colors: ['#E74C3C', '#9B59B6', '#3498DB'] },
    { id: 'peaceful', name: 'Peaceful', colors: ['#27AE60', '#2ECC71', '#A8E6CF'] },
    { id: 'royal', name: 'Royal', colors: ['#8E44AD', '#9B59B6', '#D2B4DE'] }
  ];

  // ✅ Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setUploadedImages(prev => [...prev, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded`);
    }
  };

  // ✅ Generate PDF handler
  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    toast.info('Generating PDF...');
    
    try {
      // Using jsPDF library
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text(brochureTitle || 'Brochure', 20, 20);
      
      doc.setFontSize(12);
      doc.text(brochureDescription || '', 20, 40);
      
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(mainContent || '', 170);
      doc.text(lines, 20, 60);
      
      doc.save(`${brochureTitle || 'brochure'}.pdf`);
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ Generate PPT handler
  const handleGeneratePPT = async () => {
    setIsGenerating(true);
    toast.info('Generating PowerPoint...');
    
    try {
      // Using PptxGenJS library
      const PptxGenJS = (await import('pptxgenjs')).default;
      const pptx = new PptxGenJS();
      
      const slide = pptx.addSlide();
      
      slide.addText(brochureTitle || 'Brochure', {
        x: 1,
        y: 1,
        fontSize: 32,
        bold: true,
        color: 'FF6B35'
      });
      
      slide.addText(brochureDescription || '', {
        x: 1,
        y: 2,
        fontSize: 16
      });
      
      slide.addText(mainContent || '', {
        x: 1,
        y: 3,
        fontSize: 12,
        w: 8
      });
      
      await pptx.writeFile({ fileName: `${brochureTitle || 'brochure'}.pptx` });
      toast.success('PowerPoint generated successfully!');
    } catch (error) {
      console.error('Error generating PPT:', error);
      toast.error('Failed to generate PowerPoint');
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ Generate Preview handler
  const handleGeneratePreview = () => {
    setPreviewUrl('generated');
    toast.success('Preview generated');
  };

  const handleCreateBrochure = async () => {
  // Validation
  if (!brochureTitle.trim()) {
    toast.error('Please enter a brochure title');
    return;
  }

  if (!category) {
    toast.error('Please select a category');
    return;
  }

  try {
    // Upload images to Supabase Storage
    const imageUrls: string[] = [];
    
    if (uploadedImages.length > 0) {
      for (const image of uploadedImages) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('brochure-images')
          .upload(fileName, image);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error(`Failed to upload ${image.name}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('brochure-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }
    }

    // Insert brochure data
    const { data, error } = await supabase
      .from('brochures')
      .insert([{
        title: brochureTitle,
        description: brochureDescription,
        category: category,
        content: mainContent,
        status: 'draft',
        downloads: 0,
        image_urls: imageUrls,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Success!
    toast.success('Brochure created successfully!');
    
    // Reset form
    setBrochureTitle('');
    setBrochureDescription('');
    setCategory('');
    setMainContent('');
    setSelectedTemplate('');
    setUploadedImages([]);
    
    onOpenChange(false);
    if (onSuccess) onSuccess();

  } catch (error: any) {
    console.error('Error creating brochure:', error);
    toast.error(error.message || 'Failed to create brochure');
  }
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Brochure</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="template">Template Selection</TabsTrigger>
            <TabsTrigger value="content">Content Creation</TabsTrigger>
            <TabsTrigger value="generation">Generation & Publishing</TabsTrigger>
          </TabsList>

          {/* Template Selection */}
          <TabsContent value="template" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Choose a Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <FileText className="h-12 w-12 text-orange-500 mb-3" />
                      <h4 className="font-semibold">{template.name}</h4>
                      <Badge variant="outline" className="mt-2">{template.category}</Badge>
                      <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedTemplate && selectedTemplate !== 'custom' && (
              <Card>
                <CardHeader>
                  <CardTitle>Template Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Color Scheme</Label>
                    <div className="grid grid-cols-5 gap-3 mt-2">
                      {colorSchemes.map((scheme) => (
                        <div key={scheme.id} className="flex flex-col items-center gap-2">
                          <div className="flex gap-1">
                            {scheme.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 rounded"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="text-xs">{scheme.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Typography</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Header Font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="serif">Serif (Traditional)</SelectItem>
                          <SelectItem value="sans">Sans-serif (Modern)</SelectItem>
                          <SelectItem value="script">Script (Elegant)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Body Font" />
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
            )}
          </TabsContent>

          {/* Content Creation */}
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Brochure Title</Label>
                  <Input
                    value={brochureTitle}
                    onChange={(e) => setBrochureTitle(e.target.value)}
                    placeholder="Enter brochure title..."
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
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
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Festivals">Festivals</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Main Content</Label>
                  <Textarea
                    value={mainContent}
                    onChange={(e) => setMainContent(e.target.value)}
                    placeholder="Enter the main content for your brochure..."
                    rows={8}
                  />
                </div>

                <div>
                  <Label>Images</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button type="button" variant="outline" asChild>
                        <span>Upload Images</span>
                      </Button>
                    </label>
                    {uploadedImages.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        {uploadedImages.length} image(s) uploaded
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input placeholder="+91 12345 67890" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input placeholder="contact@temple.com" />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input placeholder="Temple Address" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generation & Publishing */}
          <TabsContent value="generation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>File Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">PDF Version</h4>
                    <p className="text-sm text-gray-600 mb-4">High-quality PDF for printing</p>
                    <Button 
                      onClick={handleGeneratePDF} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                      ) : (
                        <><Download className="h-4 w-4 mr-2" /> Generate PDF</>
                      )}
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">PowerPoint Version</h4>
                    <p className="text-sm text-gray-600 mb-4">Editable PPTX file</p>
                    <Button 
                      onClick={handleGeneratePPT} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                      ) : (
                        <><Download className="h-4 w-4 mr-2" /> Generate PPTX</>
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Quality Settings</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Quality (Print)</SelectItem>
                      <SelectItem value="medium">Medium Quality (Web)</SelectItem>
                      <SelectItem value="low">Low Quality (Email)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-8 bg-gray-50 min-h-[200px] flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold mb-2">{brochureTitle || 'Brochure Preview'}</h3>
                  <p className="text-gray-600 text-center">{brochureDescription || 'Your brochure preview will appear here'}</p>
                  <Button onClick={handleGeneratePreview} className="mt-4">
                    <Eye className="h-4 w-4 mr-2" />
                    Generate Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleCreateBrochure}>
            Save as Draft
          </Button>
          <Button onClick={handleCreateBrochure} className="bg-orange-500 hover:bg-orange-600">
            Create & Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrochureModal;
