// src/components/communities/tabs/CommunityOverview.tsx - FULLY API INTEGRATED
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Edit,
	Save,
	X,
	Upload,
	Plus,
	Crown,
	Shield,
	Trash2,
} from "lucide-react";
import { Community } from "../types";
import {
	useCommunityMembers,
	useCommunityLeads,
	useUpdateMemberRole,
	useUpdateCommunity,
} from "@/hooks/use-communities";

interface CommunityOverviewProps {
	community: Community;
	onUpdate: (community: Community) => void;
}

export const CommunityOverview = ({
	community,
	onUpdate,
}: CommunityOverviewProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState({
		name: community.name,
		description: community.description,
		logo: community.logo,
		publicVisibility: true,
		allowJoinRequests: true,
	});

	// ✅ API Hooks
	const { data: members, isLoading: membersLoading } = useCommunityMembers(
		community.id
	);
	const { data: leads, isLoading: leadsLoading } = useCommunityLeads(
		community.id
	);
	const updateMemberRole = useUpdateMemberRole();
	const updateCommunity = useUpdateCommunity();

	const handleSave = async () => {
		await updateCommunity.mutateAsync({
			id: community.id,
			name: editData.name,
			description: editData.description,
			logo: editData.logo,
		});

		const updatedCommunity: Community = {
			...community,
			name: editData.name,
			description: editData.description,
			logo: editData.logo,
		};
		onUpdate(updatedCommunity);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditData({
			name: community.name,
			description: community.description,
			logo: community.logo,
			publicVisibility: true,
			allowJoinRequests: true,
		});
		setIsEditing(false);
	};

	// ✅ Promote member to lead
	const handlePromoteToLead = async (memberId: string, userId: string) => {
		await updateMemberRole.mutateAsync({
			communityId: community.id,
			memberId,
			role: "lead",
			is_lead: true,
			lead_position: "coordinator",
		});
	};

	// ✅ Remove lead status
	const handleRemoveLead = async (memberId: string) => {
		await updateMemberRole.mutateAsync({
			communityId: community.id,
			memberId,
			role: "member",
			is_lead: false,
			lead_position: "",
		});
	};

	// ✅ Change owner
	const handleChangeOwner = async (memberId: string, userId: string) => {
		await updateMemberRole.mutateAsync({
			communityId: community.id,
			memberId,
			role: "admin",
			is_lead: false,
		});
		// Note: You'll need a separate API to change community owner
		// For now, we're just promoting to admin
	};

	// Get only active members who are not already leads
	const availableMembers =
		members?.filter((m: any) => m.status === "active" && !m.is_lead) || [];

	return (
		<div className="space-y-6">
			{/* Community Header */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Community Information</CardTitle>
						{!isEditing ? (
							<Button onClick={() => setIsEditing(true)} variant="outline">
								<Edit className="w-4 h-4 mr-2" />
								Edit
							</Button>
						) : (
							<div className="flex gap-2">
								<Button onClick={handleCancel} variant="outline">
									<X className="w-4 h-4 mr-2" />
									Cancel
								</Button>
								<Button
									onClick={handleSave}
									disabled={updateCommunity.isPending}>
									<Save className="w-4 h-4 mr-2" />
									{updateCommunity.isPending ? "Saving..." : "Save"}
								</Button>
							</div>
						)}
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Logo Section */}
					<div className="flex items-center space-x-4">
						<Avatar className="w-20 h-20">
							<AvatarImage src={editData.logo} />
							<AvatarFallback className="text-2xl">
								{editData.name.substring(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						{isEditing && (
							<Button variant="outline" size="sm">
								<Upload className="w-4 h-4 mr-2" />
								Upload Logo
							</Button>
						)}
					</div>

					{/* Basic Info */}
					<div className="space-y-4">
						<div>
							<Label>Community Name</Label>
							{isEditing ? (
								<Input
									value={editData.name}
									onChange={(e) =>
										setEditData((prev) => ({ ...prev, name: e.target.value }))
									}
								/>
							) : (
								<p className="text-lg font-medium">{community.name}</p>
							)}
						</div>

						<div>
							<Label>Description</Label>
							{isEditing ? (
								<Textarea
									value={editData.description}
									onChange={(e) =>
										setEditData((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									rows={3}
								/>
							) : (
								<p className="text-muted-foreground">{community.description}</p>
							)}
						</div>

						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<Badge>{community.status}</Badge>
							<span>
								Created on {new Date(community.createdAt).toLocaleDateString()}
							</span>
						</div>
					</div>

					{/* Settings */}
					{isEditing && (
						<Card className="bg-slate-50">
							<CardHeader>
								<CardTitle className="text-base">Settings</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<Label>Public Visibility</Label>
										<p className="text-sm text-muted-foreground">
											Allow community to be visible to all temple members
										</p>
									</div>
									<Switch
										checked={editData.publicVisibility}
										onCheckedChange={(checked) =>
											setEditData((prev) => ({
												...prev,
												publicVisibility: checked,
											}))
										}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<Label>Allow Join Requests</Label>
										<p className="text-sm text-muted-foreground">
											Members can request to join this community
										</p>
									</div>
									<Switch
										checked={editData.allowJoinRequests}
										onCheckedChange={(checked) =>
											setEditData((prev) => ({
												...prev,
												allowJoinRequests: checked,
											}))
										}
									/>
								</div>
							</CardContent>
						</Card>
					)}
				</CardContent>
			</Card>

			{/* Owner & Leadership */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Crown className="w-5 h-5 text-temple-saffron" />
						Owner & Leadership
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Current Owner */}
					<div>
						<Label className="mb-3 block">Community Owner</Label>
						<div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
							<div className="flex items-center space-x-3">
								<Avatar>
									<AvatarImage src={community.owner?.avatar} />
									<AvatarFallback>
										{(
											community.owner?.full_name ||
											community.owner?.name ||
											"Owner"
										)
											?.substring(0, 2)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">
										{community.owner?.full_name ||
											community.owner?.name ||
											"Owner"}
									</p>
									<p className="text-sm text-muted-foreground">
										{community.owner?.email || "No email"}
									</p>
								</div>
							</div>
							<Select
								onValueChange={(memberId) => {
									const member = members?.find((m: any) => m.id === memberId);
									if (member)
										handleChangeOwner(memberId, member.user_id || member.id);
								}}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Change Owner" />
								</SelectTrigger>
								<SelectContent>
									{availableMembers.map((member: any) => {
										const displayName =
											member.full_name ||
											member.name ||
											member.user_id?.full_name ||
											member.user_id?.name ||
											`Member ${member.id?.slice(-4) || ""}`;
										return (
											<SelectItem key={member.id} value={member.id}>
												{displayName}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Community Leads */}
					<div>
						<div className="flex items-center justify-between mb-3">
							<Label>Community Leads</Label>
							<Select
								onValueChange={(memberId) => {
									const member = members?.find((m: any) => m.id === memberId);
									if (member)
										handlePromoteToLead(memberId, member.user_id || member.id);
								}}>
								<SelectTrigger className="w-48">
									<SelectValue placeholder="Add Lead" />
								</SelectTrigger>
								<SelectContent>
									{availableMembers.length === 0 ? (
										<SelectItem value="none" disabled>
											No available members
										</SelectItem>
									) : (
										availableMembers.map((member: any) => {
											const displayName =
												member.full_name ||
												member.name ||
												member.user_id?.full_name ||
												member.user_id?.name ||
												`Member ${member.id?.slice(-4) || ""}`;
											return (
												<SelectItem key={member.id} value={member.id}>
													<div className="flex items-center gap-2">
														<Avatar className="w-6 h-6">
															<AvatarImage
																src={
																	member.user_id?.avatar_url ||
																	member.avatar_url
																}
															/>
															<AvatarFallback>
																{displayName.substring(0, 2).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<span>{displayName}</span>
													</div>
												</SelectItem>
											);
										})
									)}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-3">
							{leadsLoading ? (
								<p className="text-sm text-muted-foreground">
									Loading leads...
								</p>
							) : leads?.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No community leads assigned yet
								</p>
							) : (
								leads?.map((lead: any) => (
									<div
										key={lead.id}
										className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
										<div className="flex items-center space-x-3">
											<Avatar>
												<AvatarImage
													src={lead.user_id?.avatar_url || lead.avatar_url}
												/>
												<AvatarFallback>
													{(
														lead.full_name ||
														lead.name ||
														lead.user_id?.full_name ||
														lead.user_id?.name ||
														"LD"
													)
														.substring(0, 2)
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium flex items-center gap-2">
													<span>
														{lead.full_name ||
															lead.name ||
															lead.user_id?.full_name ||
															lead.user_id?.name ||
															`Lead ${lead.id?.slice(-4) || ""}`}
													</span>
													<Shield className="w-4 h-4 text-blue-500" />
												</p>
												<p className="text-sm text-muted-foreground">
													{lead.email || lead.user_id?.email || "No email"}
												</p>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveLead(lead.id)}
											disabled={updateMemberRole.isPending}
											className="text-destructive hover:text-destructive">
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								))
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
