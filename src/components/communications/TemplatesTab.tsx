import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Mail,
    Smartphone,
    Bell,
    MessageCircle,
    Plus,
    Edit,
    Copy,
    Trash2,
    Eye,
    BarChart3,
    Calendar,
    User,
    Search,
    Filter
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const TemplatesTab: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('email');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    // Mock data for templates
    const templates = {
        email: [
            {
                id: 1,
                name: 'Welcome New Member',
                description: 'Welcome message for new community members',
                category: 'Welcome',
                usage: 245,
                lastModified: '2024-01-15',
                createdBy: 'Admin User',
                subject: 'Welcome to Our Temple Community!',
                content: 'Dear {{name}},\n\nWelcome to our temple community! We are delighted to have you join us...',
                variables: ['name', 'community', 'contact_email']
            },
            {
                id: 2,
                name: 'Event Notification',
                description: 'General template for event announcements',
                category: 'Events',
                usage: 189,
                lastModified: '2024-01-12',
                createdBy: 'Events Team',
                subject: '{{event_name}} - Join Us!',
                content: 'Dear {{name}},\n\nYou are invited to {{event_name}} on {{event_date}}...',
                variables: ['name', 'event_name', 'event_date', 'event_location']
            },
            {
                id: 3,
                name: 'Donation Receipt',
                description: 'Thank you message with donation receipt',
                category: 'Donations',
                usage: 456,
                lastModified: '2024-01-10',
                createdBy: 'Finance Team',
                subject: 'Thank You for Your Generous Donation',
                content: 'Dear {{donor_name}},\n\nThank you for your generous donation of ${{amount}}...',
                variables: ['donor_name', 'amount', 'donation_date', 'receipt_number']
            },
            {
                id: 4,
                name: 'Volunteer Assignment',
                description: 'Notification for volunteer shift assignments',
                category: 'Volunteers',
                usage: 123,
                lastModified: '2024-01-08',
                createdBy: 'Volunteer Coordinator',
                subject: 'Your Volunteer Assignment - {{shift_date}}',
                content: 'Dear {{volunteer_name}},\n\nYou have been assigned to {{shift_name}} on {{shift_date}}...',
                variables: ['volunteer_name', 'shift_name', 'shift_date', 'shift_time']
            }
        ],
        sms: [
            {
                id: 5,
                name: 'Event Reminder',
                description: 'Quick reminder for upcoming events',
                category: 'Events',
                usage: 567,
                lastModified: '2024-01-14',
                createdBy: 'Events Team',
                content: 'Hi {{name}}! Reminder: {{event_name}} tomorrow at {{time}}. See you there!',
                variables: ['name', 'event_name', 'time']
            },
            {
                id: 6,
                name: 'Donation Confirmation',
                description: 'Quick confirmation for donations',
                category: 'Donations',
                usage: 234,
                lastModified: '2024-01-11',
                createdBy: 'Finance Team',
                content: 'Thank you {{donor_name}} for your ${{amount}} donation. Receipt: {{receipt_id}}',
                variables: ['donor_name', 'amount', 'receipt_id']
            },
            {
                id: 7,
                name: 'Volunteer Shift Reminder',
                description: 'Reminder for volunteer shifts',
                category: 'Volunteers',
                usage: 89,
                lastModified: '2024-01-09',
                createdBy: 'Volunteer Coordinator',
                content: 'Hi {{name}}! Your {{shift_name}} shift is tomorrow at {{time}}. Thanks!',
                variables: ['name', 'shift_name', 'time']
            }
        ],
        push: [
            {
                id: 8,
                name: 'Puja Alert',
                description: 'Notification for puja timings',
                category: 'Puja',
                usage: 789,
                lastModified: '2024-01-13',
                createdBy: 'Puja Committee',
                title: '{{puja_name}} Starting Soon',
                content: '{{puja_name}} will begin in 15 minutes at the main hall.',
                variables: ['puja_name']
            },
            {
                id: 9,
                name: 'Community Update',
                description: 'General community announcements',
                category: 'General',
                usage: 345,
                lastModified: '2024-01-07',
                createdBy: 'Admin User',
                title: 'Community Update',
                content: '{{message}}',
                variables: ['message']
            }
        ]
    };

    const [newTemplate, setNewTemplate] = useState({
        name: '',
        description: '',
        category: '',
        type: activeCategory,
        subject: '',
        title: '',
        content: '',
        variables: []
    });

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'email': return <Mail className="h-4 w-4" />;
            case 'sms': return <Smartphone className="h-4 w-4" />;
            case 'push': return <Bell className="h-4 w-4" />;
            default: return null;
        }
    };

    const filteredTemplates = templates[activeCategory as keyof typeof templates]?.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleCreateTemplate = () => {
        // Add template creation logic here
        setShowCreateModal(false);
        setNewTemplate({
            name: '',
            description: '',
            category: '',
            type: activeCategory,
            subject: '',
            title: '',
            content: '',
            variables: []
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Template Management</h2>
                    <p className="text-gray-600">Create and manage communication templates</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                </Button>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search templates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Template Categories */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Templates
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        SMS Templates
                    </TabsTrigger>
                    <TabsTrigger value="push" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Push Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="mt-6">
                    <TemplateGrid templates={filteredTemplates} type="email" onEdit={setSelectedTemplate} />
                </TabsContent>

                <TabsContent value="sms" className="mt-6">
                    <TemplateGrid templates={filteredTemplates} type="sms" onEdit={setSelectedTemplate} />
                </TabsContent>

                <TabsContent value="push" className="mt-6">
                    <TemplateGrid templates={filteredTemplates} type="push" onEdit={setSelectedTemplate} />
                </TabsContent>
            </Tabs>

            {/* Create Template Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Template</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="template-name">Template Name</Label>
                                <Input
                                    id="template-name"
                                    value={newTemplate.name}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                    placeholder="Enter template name..."
                                />
                            </div>
                            <div>
                                <Label>Category</Label>
                                <Select
                                    value={newTemplate.category}
                                    onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Welcome">Welcome</SelectItem>
                                        <SelectItem value="Events">Events</SelectItem>
                                        <SelectItem value="Donations">Donations</SelectItem>
                                        <SelectItem value="Volunteers">Volunteers</SelectItem>
                                        <SelectItem value="Puja">Puja</SelectItem>
                                        <SelectItem value="General">General</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="template-description">Description</Label>
                            <Textarea
                                id="template-description"
                                value={newTemplate.description}
                                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                placeholder="Brief description of the template..."
                                rows={2}
                            />
                        </div>

                        {(activeCategory === 'email' || activeCategory === 'push') && (
                            <div>
                                <Label htmlFor="template-subject">
                                    {activeCategory === 'email' ? 'Subject Line' : 'Title'}
                                </Label>
                                <Input
                                    id="template-subject"
                                    value={activeCategory === 'email' ? newTemplate.subject : newTemplate.title}
                                    onChange={(e) => setNewTemplate({
                                        ...newTemplate,
                                        [activeCategory === 'email' ? 'subject' : 'title']: e.target.value
                                    })}
                                    placeholder={`Enter ${activeCategory === 'email' ? 'subject line' : 'title'}...`}
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="template-content">Content</Label>
                            <Textarea
                                id="template-content"
                                value={newTemplate.content}
                                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                                placeholder="Enter template content..."
                                rows={8}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Use {{ variable_name }} for dynamic content
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Available Variables</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {['name', 'email', 'phone', 'community', 'event_name', 'event_date', 'amount', 'date'].map((variable) => (
                                        <Badge key={variable} variant="outline" className="justify-center">
                                            {`{{${variable}}}`}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-between pt-6 border-t">
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                            <Button onClick={handleCreateTemplate}>
                                Create Template
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Template Detail Modal */}
            {selectedTemplate && (
                <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{selectedTemplate.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Badge variant="outline">{selectedTemplate.category}</Badge>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <BarChart3 className="h-4 w-4" />
                                    Used {selectedTemplate.usage} times
                                </div>
                            </div>
                            <p className="text-gray-600">{selectedTemplate.description}</p>
                            {selectedTemplate.subject && (
                                <div>
                                    <Label>Subject</Label>
                                    <div className="p-2 bg-gray-50 rounded">{selectedTemplate.subject}</div>
                                </div>
                            )}
                            <div>
                                <Label>Content</Label>
                                <div className="p-3 bg-gray-50 rounded whitespace-pre-wrap">{selectedTemplate.content}</div>
                            </div>
                            <div>
                                <Label>Variables</Label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTemplate.variables.map((variable: string) => (
                                        <Badge key={variable} variant="outline">{`{{${variable}}}`}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

// Template Grid Component
const TemplateGrid: React.FC<{ templates: any[], type: string, onEdit: (template: any) => void }> = ({
    templates,
    type,
    onEdit
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{template.description}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <BarChart3 className="h-3 w-3" />
                                    {template.usage} uses
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {template.lastModified}
                                </div>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <User className="h-3 w-3" />
                                {template.createdBy}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(template)}>
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Copy className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default TemplatesTab;