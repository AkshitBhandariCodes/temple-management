import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Users,
	Calendar,
	Heart,
	IndianRupee,
	HandHeart,
	MessageSquare,
	BarChart3,
	Settings,
	Shield,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
	open: boolean;
	onClose: () => void;
}

const navigation = [
	{ name: "Dashboard", href: "/", icon: LayoutDashboard },
	{ name: "Communities", href: "/communities", icon: Users },
	{ name: "Events & Tasks", href: "/events", icon: Calendar },
	{ name: "Finance", href: "/finance", icon: IndianRupee },
	{ name: "Pujas", href: "/pujas", icon: HandHeart },
	{ name: "Volunteers", href: "/volunteers", icon: Heart },
	{ name: "Communications", href: "/communications", icon: MessageSquare },
	{ name: "Reports", href: "/reports", icon: BarChart3 },
	{ name: "Admin", href: "/admin", icon: Shield },
	{ name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = ({ open, onClose }: SidebarProps) => {
	return (
		<>
			{/* Mobile Overlay */}
			{open && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed top-0 left-0 z-40 h-screen transition-transform duration-300",
					"w-64 bg-card border-r border-border",
					"lg:translate-x-0",
					open ? "translate-x-0" : "-translate-x-full"
				)}>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-border">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-gradient-to-br from-temple-saffron to-temple-gold rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">🕉</span>
							</div>
							<div>
								<h2 className="font-bold text-foreground">Temple Admin</h2>
								<p className="text-xs text-muted-foreground">
									Management Portal
								</p>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="lg:hidden"
							onClick={onClose}>
							<X className="h-5 w-5" />
						</Button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 overflow-y-auto p-4 space-y-1">
						{navigation.map((item) => (
							<NavLink
								key={item.name}
								to={item.href}
								onClick={onClose}
								className={({ isActive }) =>
									cn(
										"flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
										"text-sm font-medium",
										isActive
											? "bg-temple-saffron/10 text-temple-saffron"
											: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
									)
								}>
								<item.icon className="h-5 w-5" />
								<span>{item.name}</span>
							</NavLink>
						))}
					</nav>

					{/* Footer */}
					<div className="p-4 border-t border-border">
						<p className="text-xs text-muted-foreground text-center">
							© 2025 Temple Steward
						</p>
					</div>
				</div>
			</aside>
		</>
	);
};
