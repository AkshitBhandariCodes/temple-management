import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	Filter,
	Loader2,
	CheckCircle,
	Download,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	useCommunicationTemplates,
	useCreateCommunicationTemplate,
	useUpdateCommunicationTemplate,
} from "@/hooks/use-complete-api";
import { useToast } from "@/hooks/use-toast";

const TemplatesTab: React.FC = () => {
	const [activeCategory, setActiveCategory] = useState("email");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

	const { toast } = useToast();

	// Fetch templates from API
	const {
		data: templatesData,
		isLoading,
		refetch,
	} = useCommunicationTemplates({
		category: activeCategory === "all" ? undefined : activeCategory,
		limit: 100,
	});

	const createTemplateMutation = useCreateCommunicationTemplate();

	const apiTemplates = templatesData?.data || [];

	// Pre-built Temple Email Templates
	const TEMPLE_TEMPLATES = [
		{
			name: "🏛️ Welcome to Temple Community",
			description: "Welcome new members to the temple community",
			category: "welcome",
			subject: "Welcome to {{temple_name}} - Your Spiritual Journey Begins",
			content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d97706; font-size: 28px; margin-bottom: 10px;">🏛️ Welcome to {{temple_name}}</h1>
        <p style="color: #666; font-size: 16px;">Your Spiritual Journey Begins Here</p>
    </div>
    
    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #92400e; font-size: 16px;">🙏 Namaste {{name}},</p>
    </div>
    
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        We are delighted to welcome you to our temple community! Your presence enriches our spiritual family.
    </p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #d97706; margin-top: 0;">🌟 What's Next?</h3>
        <ul style="color: #374151; line-height: 1.8;">
            <li>📅 Join our daily prayers and weekly events</li>
            <li>🤝 Connect with fellow devotees</li>
            <li>📚 Explore our spiritual programs</li>
            <li>💝 Participate in community service</li>
        </ul>
    </div>
    
    <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            With divine blessings,<br>{{temple_name}} Administration
        </p>
    </div>
</div>`,
			variables: ["name", "temple_name", "contact_email"],
		},
		{
			name: "🎉 Festival Celebration Invitation",
			description: "Invite community to festival celebrations",
			category: "event",
			subject: "Join Us for {{festival_name}} Celebration",
			content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc2626; font-size: 28px;">🎉 {{festival_name}} Celebration</h1>
        <p style="color: #666;">You're Invited to Join Our Sacred Celebration</p>
    </div>
    
    <p style="font-size: 16px; color: #374151;">Dear {{name}},</p>
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        We cordially invite you to join us for {{festival_name}} at {{temple_name}}.
    </p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #dc2626;">📅 Event Details</h3>
        <p><strong>Date:</strong> {{event_date}}</p>
        <p><strong>Time:</strong> {{event_time}}</p>
        <p><strong>Location:</strong> {{event_location}}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <p>Your presence will add to the divine atmosphere!</p>
    </div>
</div>`,
			variables: [
				"name",
				"festival_name",
				"temple_name",
				"event_date",
				"event_time",
				"event_location",
			],
		},
		{
			name: "💝 Donation Thank You & Receipt",
			description: "Thank donors and provide receipt",
			category: "donation",
			subject:
				"Thank You for Your Sacred Offering - Receipt #{{receipt_number}}",
			content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #059669; font-size: 28px;">💝 Thank You for Your Sacred Offering</h1>
    </div>
    
    <p style="font-size: 16px; color: #374151;">Dear {{donor_name}},</p>
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        We are deeply grateful for your generous donation to {{temple_name}}.
    </p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #059669;">📋 Donation Receipt</h3>
        <p><strong>Receipt Number:</strong> #{{receipt_number}}</p>
        <p><strong>Amount:</strong> ${{ amount }}</p>
        <p><strong>Date:</strong> {{donation_date}}</p>
        <p><strong>Purpose:</strong> {{donation_purpose}}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <p style="font-style: italic;">"The best way to find yourself is to lose yourself in the service of others."</p>
    </div>
</div>`,
			variables: [
				"donor_name",
				"temple_name",
				"receipt_number",
				"amount",
				"donation_date",
				"donation_purpose",
			],
		},
		{
			name: "🤝 Volunteer Opportunity",
			description: "Invite members to volunteer",
			category: "volunteer",
			subject: "Join Our Sacred Service - Volunteer Opportunity",
			content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; font-size: 28px;">🤝 Sacred Service Opportunity</h1>
    </div>
    
    <p style="font-size: 16px; color: #374151;">Dear {{name}},</p>
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        We invite you to join our volunteer community at {{temple_name}}. Through selfless service, we grow spiritually.
    </p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #7c3aed;">🌟 Volunteer Opportunities</h3>
        <ul style="color: #374151; line-height: 1.8;">
            <li>🏛️ Temple maintenance and cleaning</li>
            <li>🍽️ Kitchen service and prasadam preparation</li>
            <li>📚 Teaching in programs</li>
            <li>🎉 Event organization</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <p>Ready to serve? Contact us at {{volunteer_email}}</p>
    </div>
</div>`,
			variables: ["name", "temple_name", "volunteer_email"],
		},
	];

	// Mock data for templates (keeping for backward compatibility)
	const templates = {
		email: [
			{
				id: 1,
				name: "Welcome New Member",
				description: "Welcome message for new community members",
				category: "Welcome",
				usage: 245,
				lastModified: "2024-01-15",
				createdBy: "Admin User",
				subject: "Welcome to Our Temple Community!",
				content:
					"Dear {{name}},\n\nWelcome to our temple community! We are delighted to have you join us...",
				variables: ["name", "community", "contact_email"],
			},
			{
				id: 2,
				name: "Event Notification",
				description: "General template for event announcements",
				category: "Events",
				usage: 189,
				lastModified: "2024-01-12",
				createdBy: "Events Team",
				subject: "{{event_name}} - Join Us!",
				content:
					"Dear {{name}},\n\nYou are invited to {{event_name}} on {{event_date}}...",
				variables: ["name", "event_name", "event_date", "event_location"],
			},
			{
				id: 3,
				name: "Donation Receipt",
				description: "Thank you message with donation receipt",
				category: "Donations",
				usage: 456,
				lastModified: "2024-01-10",
				createdBy: "Finance Team",
				subject: "Thank You for Your Generous Donation",
				content:
					"Dear {{donor_name}},\n\nThank you for your generous donation of ${{amount}}...",
				variables: ["donor_name", "amount", "donation_date", "receipt_number"],
			},
			{
				id: 4,
				name: "Volunteer Assignment",
				description: "Notification for volunteer shift assignments",
				category: "Volunteers",
				usage: 123,
				lastModified: "2024-01-08",
				createdBy: "Volunteer Coordinator",
				subject: "Your Volunteer Assignment - {{shift_date}}",
				content:
					"Dear {{volunteer_name}},\n\nYou have been assigned to {{shift_name}} on {{shift_date}}...",
				variables: ["volunteer_name", "shift_name", "shift_date", "shift_time"],
			},
		],
		sms: [
			{
				id: 5,
				name: "Event Reminder",
				description: "Quick reminder for upcoming events",
				category: "Events",
				usage: 567,
				lastModified: "2024-01-14",
				createdBy: "Events Team",
				content:
					"Hi {{name}}! Reminder: {{event_name}} tomorrow at {{time}}. See you there!",
				variables: ["name", "event_name", "time"],
			},
			{
				id: 6,
				name: "Donation Confirmation",
				description: "Quick confirmation for donations",
				category: "Donations",
				usage: 234,
				lastModified: "2024-01-11",
				createdBy: "Finance Team",
				content:
					"Thank you {{donor_name}} for your ${{amount}} donation. Receipt: {{receipt_id}}",
				variables: ["donor_name", "amount", "receipt_id"],
			},
			{
				id: 7,
				name: "Volunteer Shift Reminder",
				description: "Reminder for volunteer shifts",
				category: "Volunteers",
				usage: 89,
				lastModified: "2024-01-09",
				createdBy: "Volunteer Coordinator",
				content:
					"Hi {{name}}! Your {{shift_name}} shift is tomorrow at {{time}}. Thanks!",
				variables: ["name", "shift_name", "time"],
			},
		],
		push: [
			{
				id: 8,
				name: "Puja Alert",
				description: "Notification for puja timings",
				category: "Puja",
				usage: 789,
				lastModified: "2024-01-13",
				createdBy: "Puja Committee",
				title: "{{puja_name}} Starting Soon",
				content: "{{puja_name}} will begin in 15 minutes at the main hall.",
				variables: ["puja_name"],
			},
			{
				id: 9,
				name: "Community Update",
				description: "General community announcements",
				category: "General",
				usage: 345,
				lastModified: "2024-01-07",
				createdBy: "Admin User",
				title: "Community Update",
				content: "{{message}}",
				variables: ["message"],
			},
		],
	};

	const [newTemplate, setNewTemplate] = useState({
		name: "",
		description: "",
		category: "general",
		subject: "",
		content: "",
		variables: [] as string[],
	});

	const [isCreating, setIsCreating] = useState(false);
	const [showPrebuiltModal, setShowPrebuiltModal] = useState(false);

	// Install pre-built templates
	const installPrebuiltTemplates = async () => {
		setIsCreating(true);
		try {
			for (const template of TEMPLE_TEMPLATES) {
				await createTemplateMutation.mutateAsync({
					name: template.name,
					description: template.description,
					category: template.category,
					subject: template.subject,
					content: template.content,
					variables: template.variables,
				});
			}

			toast({
				title: "Templates Installed!",
				description: `Successfully installed ${TEMPLE_TEMPLATES.length} temple email templates.`,
			});

			refetch();
			setShowPrebuiltModal(false);
		} catch (error) {
			toast({
				title: "Installation Failed",
				description: "Failed to install some templates. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsCreating(false);
		}
	};

	const getChannelIcon = (channel: string) => {
		switch (channel) {
			case "email":
				return <Mail className="h-4 w-4" />;
			case "sms":
				return <Smartphone className="h-4 w-4" />;
			case "push":
				return <Bell className="h-4 w-4" />;
			default:
				return null;
		}
	};

	const filteredTemplates = apiTemplates.filter(
		(template) =>
			template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			template.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleCreateTemplate = async () => {
		if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
			toast({
				title: "Missing Information",
				description: "Please fill in template name, subject, and content.",
				variant: "destructive",
			});
			return;
		}

		setIsCreating(true);
		try {
			await createTemplateMutation.mutateAsync(newTemplate);

			toast({
				title: "Template Created!",
				description: "Your email template has been created successfully.",
			});

			setNewTemplate({
				name: "",
				description: "",
				category: "general",
				subject: "",
				content: "",
				variables: [],
			});

			setShowCreateModal(false);
			refetch();
		} catch (error) {
			toast({
				title: "Creation Failed",
				description: "Failed to create template. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Actions */}
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold">Temple Email Templates</h2>
					<p className="text-gray-600">
						Create and manage beautiful email templates for your temple
						community
					</p>
				</div>
				<div className="flex gap-3">
					{apiTemplates.length === 0 && (
						<Button
							variant="outline"
							onClick={() => setShowPrebuiltModal(true)}>
							<Download className="h-4 w-4 mr-2" />
							Install Temple Templates
						</Button>
					)}
					<Button onClick={() => setShowCreateModal(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Create Template
					</Button>
				</div>
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

			{/* Templates Grid */}
			{isLoading ? (
				<div className="flex items-center justify-center h-96">
					<div className="text-center">
						<Loader2 className="w-12 h-12 animate-spin text-temple-saffron mx-auto mb-4" />
						<p className="text-muted-foreground">Loading templates...</p>
					</div>
				</div>
			) : filteredTemplates.length === 0 ? (
				<Card>
					<CardContent className="p-12 text-center">
						<Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-semibold mb-2">No Templates Found</h3>
						<p className="text-muted-foreground mb-6">
							{apiTemplates.length === 0
								? "Get started by installing our pre-built temple templates or creating your own."
								: "No templates match your search criteria."}
						</p>
						<div className="flex gap-3 justify-center">
							{apiTemplates.length === 0 && (
								<Button onClick={() => setShowPrebuiltModal(true)}>
									<Download className="h-4 w-4 mr-2" />
									Install Temple Templates
								</Button>
							)}
							<Button
								variant="outline"
								onClick={() => setShowCreateModal(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Create Template
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredTemplates.map((template) => (
						<Card
							key={template.id}
							className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">{template.name}</CardTitle>
									<Badge variant="outline">{template.category}</Badge>
								</div>
								<p className="text-sm text-gray-600">{template.description}</p>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="text-sm">
										<strong>Subject:</strong> {template.subject}
									</div>

									{template.variables && template.variables.length > 0 && (
										<div>
											<div className="text-sm font-medium mb-2">Variables:</div>
											<div className="flex flex-wrap gap-1">
												{template.variables
													.slice(0, 3)
													.map((variable: string) => (
														<Badge
															key={variable}
															variant="secondary"
															className="text-xs">
															{`{{${variable}}}`}
														</Badge>
													))}
												{template.variables.length > 3 && (
													<Badge variant="secondary" className="text-xs">
														+{template.variables.length - 3} more
													</Badge>
												)}
											</div>
										</div>
									)}

									<div className="flex gap-2 pt-2">
										<Button
											size="sm"
											variant="outline"
											className="flex-1"
											onClick={() => setSelectedTemplate(template)}>
											<Eye className="h-3 w-3 mr-1" />
											View
										</Button>
										<Button size="sm" variant="outline">
											<Copy className="h-3 w-3" />
										</Button>
										<Button size="sm" variant="outline">
											<Edit className="h-3 w-3" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Install Pre-built Templates Modal */}
			<Dialog open={showPrebuiltModal} onOpenChange={setShowPrebuiltModal}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Install Temple Email Templates</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						<p className="text-gray-600">
							Install our professionally designed temple email templates to get
							started quickly. These templates are specifically crafted for
							temple communities and include:
						</p>

						<div className="grid grid-cols-1 gap-4">
							{TEMPLE_TEMPLATES.map((template, index) => (
								<div key={index} className="border rounded-lg p-4">
									<h4 className="font-medium">{template.name}</h4>
									<p className="text-sm text-gray-600 mt-1">
										{template.description}
									</p>
									<Badge variant="outline" className="mt-2">
										{template.category}
									</Badge>
								</div>
							))}
						</div>
					</div>

					<div className="flex justify-between pt-6 border-t">
						<Button
							variant="outline"
							onClick={() => setShowPrebuiltModal(false)}>
							Cancel
						</Button>
						<Button onClick={installPrebuiltTemplates} disabled={isCreating}>
							{isCreating ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Installing...
								</>
							) : (
								<>
									<Download className="w-4 h-4 mr-2" />
									Install {TEMPLE_TEMPLATES.length} Templates
								</>
							)}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Create Template Modal */}
			<Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Create New Template</DialogTitle>
					</DialogHeader>

					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="template-name">Template Name *</Label>
								<Input
									id="template-name"
									value={newTemplate.name}
									onChange={(e) =>
										setNewTemplate({ ...newTemplate, name: e.target.value })
									}
									placeholder="e.g., Welcome New Member"
								/>
							</div>
							<div>
								<Label>Category *</Label>
								<Select
									value={newTemplate.category}
									onValueChange={(value) =>
										setNewTemplate({ ...newTemplate, category: value })
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="welcome">Welcome</SelectItem>
										<SelectItem value="event">Events</SelectItem>
										<SelectItem value="donation">Donations</SelectItem>
										<SelectItem value="volunteer">Volunteers</SelectItem>
										<SelectItem value="prayer">Prayers</SelectItem>
										<SelectItem value="general">General</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div>
							<Label htmlFor="template-description">Description</Label>
							<Textarea
								id="template-description"
								value={newTemplate.description}
								onChange={(e) =>
									setNewTemplate({
										...newTemplate,
										description: e.target.value,
									})
								}
								placeholder="Brief description of the template..."
								rows={2}
							/>
						</div>

						<div>
							<Label htmlFor="template-subject">Subject Line *</Label>
							<Input
								id="template-subject"
								value={newTemplate.subject}
								onChange={(e) =>
									setNewTemplate({
										...newTemplate,
										subject: e.target.value,
									})
								}
								placeholder="e.g., Welcome to {{temple_name}}"
							/>
						</div>

						<div>
							<Label htmlFor="template-content">Email Content (HTML) *</Label>
							<Textarea
								id="template-content"
								value={newTemplate.content}
								onChange={(e) =>
									setNewTemplate({ ...newTemplate, content: e.target.value })
								}
								placeholder="Enter your HTML email content here..."
								rows={12}
							/>
							<p className="text-sm text-gray-500 mt-1">
								Use {{ variable_name }} for dynamic content. HTML is supported
								for rich formatting.
							</p>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Common Variables</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
									{[
										"name",
										"email",
										"temple_name",
										"contact_email",
										"event_name",
										"event_date",
										"amount",
										"date",
									].map((variable) => (
										<Badge
											key={variable}
											variant="outline"
											className="justify-center cursor-pointer hover:bg-gray-100"
											onClick={() =>
												setNewTemplate({
													...newTemplate,
													content: newTemplate.content + `{{${variable}}}`,
												})
											}>
											{`{{${variable}}}`}
										</Badge>
									))}
								</div>
								<p className="text-sm text-gray-500 mt-2">
									Click on a variable to add it to your content
								</p>
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
							<Button onClick={handleCreateTemplate} disabled={isCreating}>
								{isCreating ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									<>
										<CheckCircle className="w-4 h-4 mr-2" />
										Create Template
									</>
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Template Detail Modal */}
			{selectedTemplate && (
				<Dialog
					open={!!selectedTemplate}
					onOpenChange={() => setSelectedTemplate(null)}>
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
									<div className="p-2 bg-gray-50 rounded">
										{selectedTemplate.subject}
									</div>
								</div>
							)}
							<div>
								<Label>Content</Label>
								<div className="p-3 bg-gray-50 rounded whitespace-pre-wrap">
									{selectedTemplate.content}
								</div>
							</div>
							<div>
								<Label>Variables</Label>
								<div className="flex flex-wrap gap-2">
									{selectedTemplate.variables.map((variable: string) => (
										<Badge
											key={variable}
											variant="outline">{`{{${variable}}}`}</Badge>
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
const TemplateGrid: React.FC<{
	templates: any[];
	type: string;
	onEdit: (template: any) => void;
}> = ({ templates, type, onEdit }) => {
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
								<Button
									size="sm"
									variant="outline"
									className="flex-1"
									onClick={() => onEdit(template)}>
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
