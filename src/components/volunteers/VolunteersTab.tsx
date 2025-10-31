import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Search,
	Filter,
	Eye,
	Edit,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Star,
	CheckCircle,
	XCircle,
	Clock,
	MoreHorizontal,
	Loader2,
	Users,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVolunteers } from "@/hooks/use-complete-api";

export const VolunteersTab = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [skillsFilter, setSkillsFilter] = useState("all");
	const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);

	// Fetch real volunteer data
	const {
		data: volunteersData,
		isLoading,
		error,
	} = useVolunteers({
		limit: 1000,
	});

	const volunteers = volunteersData?.data || [];

	const filteredVolunteers = volunteers.filter((volunteer) => {
		const fullName = `${volunteer.first_name || ""} ${
			volunteer.last_name || ""
		}`.trim();
		const matchesSearch =
			fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || volunteer.status === statusFilter;
		const matchesSkills =
			skillsFilter === "all" || volunteer.skills?.includes(skillsFilter);

		return matchesSearch && matchesStatus && matchesSkills;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return <Badge className="bg-green-100 text-green-800">Active</Badge>;
			case "inactive":
				return (
					<Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
				);
			case "pending":
				return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
			case "suspended":
				return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
			default:
				return <Badge variant="secondary">{status || "Unknown"}</Badge>;
		}
	};

	const formatHours = (hours: number) => {
		return `${hours} hrs`;
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<p className="text-muted-foreground">Failed to load volunteers</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header and Controls */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<h2 className="text-2xl font-bold">Volunteers Management</h2>
					<Badge variant="secondary" className="text-sm">
						{filteredVolunteers.length} volunteers
					</Badge>
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center space-x-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search volunteers..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="suspended">Suspended</SelectItem>
							</SelectContent>
						</Select>
						<Select value={skillsFilter} onValueChange={setSkillsFilter}>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Skills" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Skills</SelectItem>
								<SelectItem value="Temple Services">Temple Services</SelectItem>
								<SelectItem value="Event Management">
									Event Management
								</SelectItem>
								<SelectItem value="Communication">Communication</SelectItem>
								<SelectItem value="Technical Support">
									Technical Support
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Volunteers Table */}
			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Volunteer</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Skills</TableHead>
								<TableHead>Hours</TableHead>
								<TableHead>Rating</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredVolunteers.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center py-8">
										<div className="flex items-center justify-center">
											<Users className="w-12 h-12 text-muted-foreground mr-4" />
											<div>
												<p className="text-lg font-medium">
													No volunteers found
												</p>
												<p className="text-sm text-muted-foreground">
													{searchTerm ||
													statusFilter !== "all" ||
													skillsFilter !== "all"
														? "Try adjusting your filters"
														: "No volunteers have registered yet"}
												</p>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredVolunteers.map((volunteer) => (
									<TableRow key={volunteer.id}>
										<TableCell>
											<div className="flex items-center space-x-3">
												<Avatar className="w-10 h-10">
													<AvatarFallback>
														{`${volunteer.first_name?.charAt(0) || ""}${
															volunteer.last_name?.charAt(0) || ""
														}`.toUpperCase() || "UN"}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">
														{`${volunteer.first_name || ""} ${
															volunteer.last_name || ""
														}`.trim() || "Unknown"}
													</p>
													<p className="text-sm text-muted-foreground">
														{volunteer.email}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>{getStatusBadge(volunteer.status)}</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{volunteer.skills?.slice(0, 2).map((skill: string) => (
													<Badge
														key={skill}
														variant="outline"
														className="text-xs">
														{skill}
													</Badge>
												))}
												{volunteer.skills?.length > 2 && (
													<Badge variant="outline" className="text-xs">
														+{volunteer.skills.length - 2}
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-1">
												<Clock className="w-4 h-4 text-muted-foreground" />
												<span>
													{formatHours(volunteer.total_hours_volunteered || 0)}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-1">
												<Star className="w-4 h-4 text-yellow-500 fill-current" />
												<span>{volunteer.rating || "N/A"}</span>
											</div>
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<MoreHorizontal className="w-4 h-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() => setSelectedVolunteer(volunteer)}>
														<Eye className="w-4 h-4 mr-2" />
														View Details
													</DropdownMenuItem>
													<DropdownMenuItem>
														<Edit className="w-4 h-4 mr-2" />
														Edit Profile
													</DropdownMenuItem>
													<DropdownMenuItem>
														<Mail className="w-4 h-4 mr-2" />
														Send Message
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Volunteer Details Dialog */}
			{selectedVolunteer && (
				<Dialog
					open={!!selectedVolunteer}
					onOpenChange={() => setSelectedVolunteer(null)}>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Volunteer Details</DialogTitle>
						</DialogHeader>
						<div className="space-y-6">
							<div className="flex items-center space-x-4">
								<Avatar className="w-16 h-16">
									<AvatarFallback className="text-lg">
										{`${selectedVolunteer.first_name?.charAt(0) || ""}${
											selectedVolunteer.last_name?.charAt(0) || ""
										}`.toUpperCase() || "UN"}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="text-lg font-semibold">
										{`${selectedVolunteer.first_name || ""} ${
											selectedVolunteer.last_name || ""
										}`.trim() || "Unknown"}
									</h3>
									<p className="text-muted-foreground">
										{selectedVolunteer.email}
									</p>
									<div className="flex items-center space-x-2 mt-1">
										{getStatusBadge(selectedVolunteer.status)}
										<Badge variant="outline">
											{formatHours(
												selectedVolunteer.total_hours_volunteered || 0
											)}{" "}
											contributed
										</Badge>
									</div>
								</div>
							</div>

							<Tabs defaultValue="profile" className="w-full">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="profile">Profile</TabsTrigger>
									<TabsTrigger value="skills">Skills & Interests</TabsTrigger>
									<TabsTrigger value="activity">Activity</TabsTrigger>
								</TabsList>

								<TabsContent value="profile" className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label className="text-sm font-medium">Phone</Label>
											<p className="text-sm">
												{selectedVolunteer.phone || "Not provided"}
											</p>
										</div>
										<div>
											<Label className="text-sm font-medium">Email</Label>
											<p className="text-sm">
												{selectedVolunteer.email || "Not provided"}
											</p>
										</div>
										<div>
											<Label className="text-sm font-medium">Status</Label>
											<p className="text-sm">
												{selectedVolunteer.status || "Unknown"}
											</p>
										</div>
										<div>
											<Label className="text-sm font-medium">Total Hours</Label>
											<p className="text-sm">
												{formatHours(
													selectedVolunteer.total_hours_volunteered || 0
												)}
											</p>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="skills" className="space-y-4">
									<div>
										<Label className="text-sm font-medium">Skills</Label>
										<div className="flex flex-wrap gap-2 mt-2">
											{selectedVolunteer.skills?.map((skill: string) => (
												<Badge key={skill} variant="outline">
													{skill}
												</Badge>
											)) || (
												<p className="text-sm text-muted-foreground">
													No skills listed
												</p>
											)}
										</div>
									</div>
									<div>
										<Label className="text-sm font-medium">Interests</Label>
										<div className="flex flex-wrap gap-2 mt-2">
											{selectedVolunteer.interests?.map((interest: string) => (
												<Badge key={interest} variant="outline">
													{interest}
												</Badge>
											)) || (
												<p className="text-sm text-muted-foreground">
													No interests listed
												</p>
											)}
										</div>
									</div>
								</TabsContent>

								<TabsContent value="activity" className="space-y-4">
									<div className="grid grid-cols-3 gap-4">
										<div className="text-center p-4 border rounded-lg">
											<p className="text-2xl font-bold">
												{selectedVolunteer.total_hours_volunteered || 0}
											</p>
											<p className="text-sm text-muted-foreground">
												Total Hours
											</p>
										</div>
										<div className="text-center p-4 border rounded-lg">
											<p className="text-2xl font-bold">
												{selectedVolunteer.total_hours_volunteered
													? Math.floor(
															selectedVolunteer.total_hours_volunteered / 4
													  )
													: 0}
											</p>
											<p className="text-sm text-muted-foreground">
												Shifts Completed
											</p>
										</div>
										<div className="text-center p-4 border rounded-lg">
											<p className="text-2xl font-bold">
												{selectedVolunteer.rating || "N/A"}
											</p>
											<p className="text-sm text-muted-foreground">
												Average Rating
											</p>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};
