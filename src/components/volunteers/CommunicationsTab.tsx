import { useState } from "react";
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
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
	MessageSquare,
	Send,
	Users,
	Mail,
	Calendar,
	Eye,
	Edit,
	Copy,
	Plus,
	Filter,
	Download,
	BarChart3,
	Loader2,
	CheckCircle,
	XCircle,
	Clock,
} from "lucide-react";
import { format } from "date-fns";
import {
	useEmailCommunications,
	useEmailTemplates,
	useSendBulkEmailToVolunteers,
	useVolunteers,
	useCommunities,
} from "@/hooks/use-complete-api";
import { useToast } from "@/hooks/use-toast";

export const CommunicationsTab = () => {
	const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
	const [messageSubject, setMessageSubject] = useState("");
	const [messageContent, setMessageContent] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState("");
	const [senderEmail, setSenderEmail] = useState("admin@temple.com");
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

	const { toast } = useToast();

	// Fetch real data from API
	const { data: emailsData, isLoading: emailsLoading } = useEmailCommunications(
		{ limit: 100 }
	);
	const { data: templatesData, isLoading: templatesLoading } =
		useEmailTemplates({ limit: 100 });
	const { data: volunteersData } = useVolunteers({
		status: "active",
		limit: 1000,
	});
	const { data: communitiesData } = useCommunities({ limit: 100 });

	// Mutations
	const sendBulkEmailMutation = useSendBulkEmailToVolunteers();

	const emails = emailsData?.data || [];
	const templates = templatesData?.data || [];
	const volunteers = volunteersData?.data || [];
	const communities = communitiesData?.data || [];

	// Calculate audience options from real volunteer data
	const audienceOptions = [
		{ id: "all", label: "All Volunteers", count: volunteers.length },
		{
			id: "active",
			label: "Active Volunteers",
			count: volunteers.filter((v) => v.status === "active").length,
		},
		{
			id: "new",
			label: "New Volunteers (Last 30 days)",
			count: volunteers.filter((v) => {
				const createdDate = new Date(v.created_at);
				const thirtyDaysAgo = new Date();
				thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
				return createdDate >= thirtyDaysAgo;
			}).length,
		},
		...Array.from(new Set(volunteers.flatMap((v) => v.skills || []))).map(
			(skill) => ({
				id: `skill_${skill}`,
				label: `${skill} Volunteers`,
				count: volunteers.filter((v) => v.skills?.includes(skill)).length,
			})
		),
	];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "sent":
				return (
					<Badge className="bg-green-100 text-green-800">
						<CheckCircle className="w-3 h-3 mr-1" />
						Sent
					</Badge>
				);
			case "sending":
				return (
					<Badge className="bg-blue-100 text-blue-800">
						<Clock className="w-3 h-3 mr-1" />
						Sending
					</Badge>
				);
			case "scheduled":
				return (
					<Badge className="bg-yellow-100 text-yellow-800">
						<Clock className="w-3 h-3 mr-1" />
						Scheduled
					</Badge>
				);
			case "failed":
				return (
					<Badge className="bg-red-100 text-red-800">
						<XCircle className="w-3 h-3 mr-1" />
						Failed
					</Badge>
				);
			case "draft":
				return (
					<Badge variant="secondary">
						<Edit className="w-3 h-3 mr-1" />
						Draft
					</Badge>
				);
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const handleAudienceChange = (audienceId: string, checked: boolean) => {
		if (checked) {
			setSelectedAudience([...selectedAudience, audienceId]);
		} else {
			setSelectedAudience(selectedAudience.filter((id) => id !== audienceId));
		}
	};

	const getTotalRecipients = () => {
		return selectedAudience.reduce((total, audienceId) => {
			const audience = audienceOptions.find((opt) => opt.id === audienceId);
			return total + (audience?.count || 0);
		}, 0);
	};

	const handleSendEmail = async () => {
		if (!messageSubject || !messageContent || selectedAudience.length === 0) {
			toast({
				title: "Missing Information",
				description:
					"Please fill in subject, content, and select at least one audience.",
				variant: "destructive",
			});
			return;
		}

		try {
			// Create volunteer filter based on selected audience
			const volunteerFilter: any = {};

			if (selectedAudience.includes("all")) {
				// No filter needed for all volunteers
			} else if (selectedAudience.some((id) => id.startsWith("skill_"))) {
				const skills = selectedAudience
					.filter((id) => id.startsWith("skill_"))
					.map((id) => id.replace("skill_", ""));
				volunteerFilter.skills = skills[0]; // API supports single skill filter
			}

			await sendBulkEmailMutation.mutateAsync({
				sender_email: senderEmail,
				volunteer_filter: volunteerFilter,
				subject: messageSubject,
				content: messageContent,
				template_id: selectedTemplate || undefined,
			});

			// Reset form
			setMessageSubject("");
			setMessageContent("");
			setSelectedAudience([]);
			setSelectedTemplate("");
		} catch (error) {
			console.error("Failed to send email:", error);
		}
	};

	const handleTemplateSelect = (templateId: string) => {
		const template = templates.find((t) => t.id === templateId);
		if (template) {
			setMessageSubject(template.subject);
			setMessageContent(template.content);
			setSelectedTemplate(templateId);
		}
	};

	return (
		<div className="space-y-6">
			<Tabs defaultValue="compose" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="compose">Compose Email</TabsTrigger>
					<TabsTrigger value="history">Email History</TabsTrigger>
					<TabsTrigger value="templates">Email Templates</TabsTrigger>
				</TabsList>

				<TabsContent value="compose" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Mail className="w-5 h-5" />
								<span>Send Email to Volunteers</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Sender Information */}
							<div className="space-y-2">
								<Label htmlFor="sender">From Email Address</Label>
								<Input
									id="sender"
									type="email"
									value={senderEmail}
									onChange={(e) => setSenderEmail(e.target.value)}
									placeholder="admin@temple.com"
								/>
							</div>

							{/* Audience Selection */}
							<div className="space-y-4">
								<Label className="text-base font-medium">
									Select Recipients
								</Label>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
									{audienceOptions.map((option) => (
										<div
											key={option.id}
											className="flex items-center space-x-3 p-3 border rounded-lg">
											<Checkbox
												id={option.id}
												checked={selectedAudience.includes(option.id)}
												onCheckedChange={(checked) =>
													handleAudienceChange(option.id, checked as boolean)
												}
											/>
											<div className="flex-1">
												<Label
													htmlFor={option.id}
													className="font-medium cursor-pointer">
													{option.label}
												</Label>
												<p className="text-sm text-muted-foreground">
													{option.count} volunteers
												</p>
											</div>
										</div>
									))}
								</div>
								{selectedAudience.length > 0 && (
									<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
										<p className="text-sm text-blue-800">
											<strong>{getTotalRecipients()}</strong> volunteers will
											receive this email
										</p>
									</div>
								)}
							</div>

							{/* Template Selection */}
							<div className="space-y-2">
								<Label htmlFor="template">Use Email Template (Optional)</Label>
								<Select
									value={selectedTemplate}
									onValueChange={handleTemplateSelect}>
									<SelectTrigger>
										<SelectValue placeholder="Select a template" />
									</SelectTrigger>
									<SelectContent>
										{templates.map((template) => (
											<SelectItem key={template.id} value={template.id}>
												{template.name} - {template.category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Email Content */}
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="subject">Subject Line</Label>
									<Input
										id="subject"
										value={messageSubject}
										onChange={(e) => setMessageSubject(e.target.value)}
										placeholder="Enter email subject"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="content">Email Content</Label>
									<Textarea
										id="content"
										value={messageContent}
										onChange={(e) => setMessageContent(e.target.value)}
										placeholder="Enter your email content here..."
										rows={10}
									/>
									<p className="text-xs text-muted-foreground">
										You can use variables like {"{volunteer_name}"},{" "}
										{"{community_name}"} in your content.
									</p>
								</div>
							</div>

							<div className="flex justify-end space-x-2">
								<Button
									variant="outline"
									onClick={() => {
										setMessageSubject("");
										setMessageContent("");
										setSelectedAudience([]);
										setSelectedTemplate("");
									}}>
									Clear Form
								</Button>
								<Button
									onClick={handleSendEmail}
									disabled={sendBulkEmailMutation.isPending}
									className="bg-blue-600 hover:bg-blue-700">
									{sendBulkEmailMutation.isPending ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Sending...
										</>
									) : (
										<>
											<Send className="w-4 h-4 mr-2" />
											Send Email
										</>
									)}
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
									<span>Email History</span>
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
							{emailsLoading ? (
								<div className="flex items-center justify-center h-32">
									<Loader2 className="w-8 h-8 animate-spin" />
								</div>
							) : emails.length === 0 ? (
								<div className="text-center py-8">
									<Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-lg font-medium">No emails sent yet</p>
									<p className="text-sm text-muted-foreground">
										Start by composing your first email to volunteers
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{emails.map((email) => (
										<div key={email.id} className="border rounded-lg p-4">
											<div className="flex items-start justify-between mb-3">
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-1">
														<h3 className="font-semibold">{email.subject}</h3>
														{getStatusBadge(email.status)}
													</div>
													<p className="text-sm text-muted-foreground mb-2">
														{email.content.substring(0, 100)}...
													</p>
													<div className="flex items-center space-x-4 text-sm text-muted-foreground">
														<div className="flex items-center space-x-1">
															<Users className="w-4 h-4" />
															<span>
																{email.recipient_emails?.length || 0} recipients
															</span>
														</div>
														<div className="flex items-center space-x-1">
															<Calendar className="w-4 h-4" />
															<span>
																{format(
																	new Date(email.created_at),
																	"MMM dd, yyyy 'at' HH:mm"
																)}
															</span>
														</div>
														<div className="flex items-center space-x-1">
															<Mail className="w-4 h-4" />
															<span>From: {email.sender_email}</span>
														</div>
													</div>
												</div>
												<Button variant="outline" size="sm">
													<Eye className="w-4 h-4" />
												</Button>
											</div>

											{email.delivery_status && (
												<div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t">
													<div className="text-center">
														<div className="text-lg font-semibold">
															{email.recipient_emails?.length || 0}
														</div>
														<div className="text-xs text-muted-foreground">
															Recipients
														</div>
													</div>
													<div className="text-center">
														<div className="text-lg font-semibold text-green-600">
															{email.status === "sent" ? "100%" : "0%"}
														</div>
														<div className="text-xs text-muted-foreground">
															Delivered
														</div>
													</div>
													<div className="text-center">
														<div className="text-lg font-semibold text-blue-600">
															-
														</div>
														<div className="text-xs text-muted-foreground">
															Opened
														</div>
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="templates" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Copy className="w-5 h-5" />
									<span>Email Templates</span>
								</div>
								<Button className="bg-blue-600 hover:bg-blue-700">
									<Plus className="w-4 h-4 mr-2" />
									Create Template
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{templatesLoading ? (
								<div className="flex items-center justify-center h-32">
									<Loader2 className="w-8 h-8 animate-spin" />
								</div>
							) : templates.length === 0 ? (
								<div className="text-center py-8">
									<Copy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-lg font-medium">
										No templates created yet
									</p>
									<p className="text-sm text-muted-foreground">
										Create reusable email templates for common communications
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{templates.map((template) => (
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
													Used {template.usage_count} times
												</div>
												<div className="flex items-center space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleTemplateSelect(template.id)}>
														<Copy className="w-4 h-4 mr-1" />
														Use
													</Button>
													<Button variant="outline" size="sm">
														<Edit className="w-4 h-4" />
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};
