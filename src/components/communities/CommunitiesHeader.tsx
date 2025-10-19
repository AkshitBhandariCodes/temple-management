import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, Search } from "lucide-react";
import { Community } from "./types";
import { useAuth } from "@/hooks/use-auth";

interface CommunitiesHeaderProps {
	onCreateCommunity: () => void;
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusFilterChange: (value: string) => void;
	ownerFilter: string;
	onOwnerFilterChange: (value: string) => void;
	communities: Community[];
}

export const CommunitiesHeader = ({
	onCreateCommunity,
	searchTerm,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	ownerFilter,
	onOwnerFilterChange,
	communities,
}: CommunitiesHeaderProps) => {
	const { userRoles } = useAuth();
	const canCreate = userRoles.some((r) =>
		[
			"super_admin",
			"chairman",
			"board",
			"community_owner",
			"temple_admin",
			"user",
		].includes(r)
	);
	const uniqueOwners = Array.from(
		new Set(communities.map((c) => c.owner.name))
	);

	return (
		<div className="space-y-4">
			{/* Page Title and Action Buttons */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Communities Management
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage temple communities, their members, and activities
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-2">
					<Button variant="outline" className="flex items-center gap-2">
						<Upload className="w-4 h-4" />
						Import Members
					</Button>
					{canCreate && (
						<Button
							onClick={onCreateCommunity}
							className="flex items-center gap-2">
							<Plus className="w-4 h-4" />
							Create New Community
						</Button>
					)}
				</div>
			</div>

			{/* Search and Filter Bar */}
			<div className="flex flex-col lg:flex-row gap-4 p-4 bg-card rounded-lg border">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input
						placeholder="Search by community name or description..."
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10"
					/>
				</div>

				<div className="flex flex-col sm:flex-row gap-2">
					<Select value={statusFilter} onValueChange={onStatusFilterChange}>
						<SelectTrigger className="w-full sm:w-[140px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="inactive">Inactive</SelectItem>
							<SelectItem value="archived">Archived</SelectItem>
						</SelectContent>
					</Select>

					<Select value={ownerFilter} onValueChange={onOwnerFilterChange}>
						<SelectTrigger className="w-full sm:w-[160px]">
							<SelectValue placeholder="Owner" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Owners</SelectItem>
							{uniqueOwners.map((owner) => (
								<SelectItem key={owner} value={owner}>
									{owner}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
};
