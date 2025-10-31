import React, { useState } from "react";
import { X, User, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateVolunteer, useCommunities } from "@/hooks/use-complete-api";
import { useToast } from "@/hooks/use-toast";

interface AddVolunteerModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

const SKILL_OPTIONS = [
	"Temple Services",
	"Event Management",
	"Kitchen Services",
	"Teaching",
	"Music & Arts",
	"Security",
	"Maintenance",
	"Communication",
	"Technical Support",
	"Youth Programs",
	"Elder Care",
	"Fundraising",
	"Photography",
	"Decoration",
	"Transportation",
];

const INTEREST_OPTIONS = [
	"Religious Ceremonies",
	"Cultural Events",
	"Community Service",
	"Education",
	"Youth Activities",
	"Senior Programs",
	"Festival Organization",
	"Charity Work",
	"Environmental Projects",
	"Health & Wellness",
	"Arts & Crafts",
	"Music & Dance",
	"Sports & Recreation",
	"Technology",
	"Administration",
];

export default function AddVolunteerModal({
	isOpen,
	onClose,
	onSuccess,
}: AddVolunteerModalProps) {
	const { toast } = useToast();
	const { data: communitiesData } = useCommunities();
	const createVolunteerMutation = useCreateVolunteer();

	console.log("🔧 Mutation hook state:", {
		isPending: createVolunteerMutation.isPending,
		isError: createVolunteerMutation.isError,
		error: createVolunteerMutation.error,
		mutateAsync: typeof createVolunteerMutation.mutateAsync,
	});

	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		date_of_birth: "",
		community_id: "",
		address: {
			street: "",
			city: "",
			state: "",
			zip: "",
		},
		emergency_contact: {
			name: "",
			phone: "",
			relationship: "",
		},
		skills: [] as string[],
		interests: [] as string[],
		availability: {
			weekdays: [] as string[],
			times: [] as string[],
		},
		notes: "",
	});

	const communities = communitiesData?.data || [];

	console.log("🏘️ Communities data:", {
		communitiesData,
		communitiesCount: communities.length,
		communities: communities.map((c) => ({ id: c.id, name: c.name })),
	});

	const handleInputChange = (field: string, value: any) => {
		if (field.includes(".")) {
			const [parent, child] = field.split(".");
			setFormData((prev) => ({
				...prev,
				[parent]: {
					...prev[parent as keyof typeof prev],
					[child]: value,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[field]: value,
			}));
		}
	};

	const handleSkillChange = (skill: string, checked: boolean) => {
		setFormData((prev) => ({
			...prev,
			skills: checked
				? [...prev.skills, skill]
				: prev.skills.filter((s) => s !== skill),
		}));
	};

	const handleInterestChange = (interest: string, checked: boolean) => {
		setFormData((prev) => ({
			...prev,
			interests: checked
				? [...prev.interests, interest]
				: prev.interests.filter((i) => i !== interest),
		}));
	};

	const handleAvailabilityChange = (
		type: "weekdays" | "times",
		value: string,
		checked: boolean
	) => {
		setFormData((prev) => ({
			...prev,
			availability: {
				...prev.availability,
				[type]: checked
					? [...prev.availability[type], value]
					: prev.availability[type].filter((item) => item !== value),
			},
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Add alert to verify form submission is triggered
		alert("Form submitted! Check console for details.");

		console.log("🔥 Form submitted with data:", formData);
		console.log("🔥 Validation check:", {
			first_name: !!formData.first_name,
			last_name: !!formData.last_name,
			email: !!formData.email,
			community_id: !!formData.community_id,
			community_id_value: formData.community_id,
		});

		if (
			!formData.first_name ||
			!formData.last_name ||
			!formData.email ||
			!formData.community_id
		) {
			console.log("❌ Validation failed - missing required fields");
			toast({
				title: "Missing fields",
				description:
					"Please fill in first name, last name, email, and community.",
				variant: "destructive",
			});
			return;
		}

		console.log("✅ Validation passed, proceeding with creation");

		try {
			const volunteerData = {
				first_name: formData.first_name,
				last_name: formData.last_name,
				email: formData.email,
				phone: formData.phone,
				community_id: formData.community_id,
				skills: formData.skills,
				interests: formData.interests,
				notes: formData.notes,
			};

			// TODO: Add these fields after running the database migration:
			// date_of_birth: formData.date_of_birth,
			// address: formData.address,
			// emergency_contact: formData.emergency_contact,
			// availability: formData.availability,

			console.log("🚀 Creating volunteer with complete data:", volunteerData);

			console.log("🔥 About to call createVolunteerMutation.mutateAsync");
			console.log("🔥 Mutation state:", {
				isLoading: createVolunteerMutation.isPending,
				isError: createVolunteerMutation.isError,
				error: createVolunteerMutation.error,
			});

			const result = await createVolunteerMutation.mutateAsync(volunteerData);
			console.log("🔥 Mutation completed with result:", result);

			console.log("✅ Volunteer created successfully:", result);

			// Add a small delay to ensure cache invalidation completes
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Reset form and close modal
			setFormData({
				first_name: "",
				last_name: "",
				email: "",
				phone: "",
				date_of_birth: "",
				community_id: "",
				address: { street: "", city: "", state: "", zip: "" },
				emergency_contact: { name: "", phone: "", relationship: "" },
				skills: [],
				interests: [],
				availability: { weekdays: [], times: [] },
				notes: "",
			});

			// Call success callback to switch to volunteers tab
			if (onSuccess) {
				onSuccess();
			}

			onClose();
		} catch (error) {
			console.error("❌ Failed to create volunteer:", error);
			console.error("❌ Error details:", {
				message: error.message,
				stack: error.stack,
				response: error.response,
			});

			// Show error toast
			toast({
				title: "Failed to create volunteer",
				description: error.message || "An unexpected error occurred",
				variant: "destructive",
			});
		}
	};

	if (!isOpen) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Add New Volunteer
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Basic Information</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="first_name">First Name *</Label>
								<Input
									id="first_name"
									value={formData.first_name}
									onChange={(e) =>
										handleInputChange("first_name", e.target.value)
									}
									placeholder="Enter first name"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="last_name">Last Name *</Label>
								<Input
									id="last_name"
									value={formData.last_name}
									onChange={(e) =>
										handleInputChange("last_name", e.target.value)
									}
									placeholder="Enter last name"
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email Address *</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									placeholder="volunteer@example.com"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone">Phone Number</Label>
								<Input
									id="phone"
									type="tel"
									value={formData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									placeholder="+1 (555) 123-4567"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="date_of_birth">Date of Birth</Label>
								<Input
									id="date_of_birth"
									type="date"
									value={formData.date_of_birth}
									onChange={(e) =>
										handleInputChange("date_of_birth", e.target.value)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="community">Community *</Label>
								<Select
									value={formData.community_id}
									onValueChange={(value) =>
										handleInputChange("community_id", value)
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select community" />
									</SelectTrigger>
									<SelectContent>
										{communities.map((community) => (
											<SelectItem key={community.id} value={community.id}>
												{community.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Address Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Address</h3>

						<div className="space-y-2">
							<Label htmlFor="street">Street Address</Label>
							<Input
								id="street"
								value={formData.address.street}
								onChange={(e) =>
									handleInputChange("address.street", e.target.value)
								}
								placeholder="123 Main Street"
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="city">City</Label>
								<Input
									id="city"
									value={formData.address.city}
									onChange={(e) =>
										handleInputChange("address.city", e.target.value)
									}
									placeholder="City"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="state">State</Label>
								<Input
									id="state"
									value={formData.address.state}
									onChange={(e) =>
										handleInputChange("address.state", e.target.value)
									}
									placeholder="State"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="zip">ZIP Code</Label>
								<Input
									id="zip"
									value={formData.address.zip}
									onChange={(e) =>
										handleInputChange("address.zip", e.target.value)
									}
									placeholder="12345"
								/>
							</div>
						</div>
					</div>

					{/* Emergency Contact */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Emergency Contact</h3>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="emergency_name">Contact Name</Label>
								<Input
									id="emergency_name"
									value={formData.emergency_contact.name}
									onChange={(e) =>
										handleInputChange("emergency_contact.name", e.target.value)
									}
									placeholder="Emergency contact name"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="emergency_phone">Contact Phone</Label>
								<Input
									id="emergency_phone"
									type="tel"
									value={formData.emergency_contact.phone}
									onChange={(e) =>
										handleInputChange("emergency_contact.phone", e.target.value)
									}
									placeholder="+1 (555) 123-4567"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="relationship">Relationship</Label>
								<Input
									id="relationship"
									value={formData.emergency_contact.relationship}
									onChange={(e) =>
										handleInputChange(
											"emergency_contact.relationship",
											e.target.value
										)
									}
									placeholder="e.g., Spouse, Parent"
								/>
							</div>
						</div>
					</div>

					{/* Skills */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Skills</h3>
						<div className="grid grid-cols-3 gap-4 max-h-40 overflow-y-auto">
							{SKILL_OPTIONS.map((skill) => (
								<div key={skill} className="flex items-center space-x-2">
									<Checkbox
										id={`skill-${skill}`}
										checked={formData.skills.includes(skill)}
										onCheckedChange={(checked) =>
											handleSkillChange(skill, checked as boolean)
										}
									/>
									<Label
										htmlFor={`skill-${skill}`}
										className="text-sm cursor-pointer">
										{skill}
									</Label>
								</div>
							))}
						</div>
					</div>

					{/* Interests */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Interests</h3>
						<div className="grid grid-cols-3 gap-4 max-h-40 overflow-y-auto">
							{INTEREST_OPTIONS.map((interest) => (
								<div key={interest} className="flex items-center space-x-2">
									<Checkbox
										id={`interest-${interest}`}
										checked={formData.interests.includes(interest)}
										onCheckedChange={(checked) =>
											handleInterestChange(interest, checked as boolean)
										}
									/>
									<Label
										htmlFor={`interest-${interest}`}
										className="text-sm cursor-pointer">
										{interest}
									</Label>
								</div>
							))}
						</div>
					</div>

					{/* Availability */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Availability</h3>

						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label>Available Days</Label>
								<div className="space-y-2">
									{[
										"Monday",
										"Tuesday",
										"Wednesday",
										"Thursday",
										"Friday",
										"Saturday",
										"Sunday",
									].map((day) => (
										<div key={day} className="flex items-center space-x-2">
											<Checkbox
												id={`day-${day}`}
												checked={formData.availability.weekdays.includes(day)}
												onCheckedChange={(checked) =>
													handleAvailabilityChange(
														"weekdays",
														day,
														checked as boolean
													)
												}
											/>
											<Label
												htmlFor={`day-${day}`}
												className="text-sm cursor-pointer">
												{day}
											</Label>
										</div>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Label>Available Times</Label>
								<div className="space-y-2">
									{["Morning", "Afternoon", "Evening", "Night"].map((time) => (
										<div key={time} className="flex items-center space-x-2">
											<Checkbox
												id={`time-${time}`}
												checked={formData.availability.times.includes(time)}
												onCheckedChange={(checked) =>
													handleAvailabilityChange(
														"times",
														time,
														checked as boolean
													)
												}
											/>
											<Label
												htmlFor={`time-${time}`}
												className="text-sm cursor-pointer">
												{time}
											</Label>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Notes */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Additional Notes</h3>
						<div className="space-y-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								value={formData.notes}
								onChange={(e) => handleInputChange("notes", e.target.value)}
								placeholder="Any additional information about the volunteer..."
								rows={3}
							/>
						</div>
					</div>

					{/* Form Actions */}
					<div className="flex justify-end space-x-2 pt-4 border-t">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={async () => {
								console.log("🧪 Testing direct API call...");
								try {
									const testData = {
										first_name: "Test",
										last_name: "Direct",
										email: `test.direct.${Date.now()}@example.com`,
										phone: "+1-555-TEST",
										community_id: "5cf9beff-483d-43f0-8ca3-9fba851b283a",
										skills: ["Testing"],
										interests: ["API Testing"],
										notes: "Direct API test",
									};
									const result = await createVolunteerMutation.mutateAsync(
										testData
									);
									console.log("🧪 Direct API test result:", result);
									alert("Direct API test successful!");
								} catch (error) {
									console.error("🧪 Direct API test failed:", error);
									alert(`Direct API test failed: ${error.message}`);
								}
							}}>
							Test API
						</Button>
						<Button
							type="submit"
							disabled={createVolunteerMutation.isPending}
							className="min-w-[120px]">
							{createVolunteerMutation.isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Adding...
								</>
							) : (
								"Add Volunteer"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
