import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Index from "./pages/Index";
import Devotees from "./pages/Devotees";
import Events from "./pages/Events";
import Donations from "./pages/Donations";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import NotFound from "./pages/NotFound";
import { Finance } from "./pages/Finance";
import Volunteers from "./pages/Volunteers";
import { ReportsAnalyticsPage } from "./pages/ReportsAnalyticsPage";
import Settings from "./pages/Settings";
import Pujas from "./pages/Pujas";
import Communications from "./pages/Communications";
import PujasPage from "./pages/PujasPage";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			cacheTime: 10 * 60 * 1000, // 10 minutes
			retry: 1, // Only retry once
			refetchOnWindowFocus: false, // Don't refetch on window focus
			refetchOnMount: true, // Refetch on mount
			refetchOnReconnect: false, // Don't refetch on reconnect
		},
	},
});

// ✅ Protected Route Component - Requires Authentication
function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	console.log("🔒 ProtectedRoute - loading:", loading, "user:", user?.email);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		console.log("❌ No user, redirecting to /auth");
		return <Navigate to="/auth" replace />;
	}

	console.log("✅ User authenticated, rendering protected content");
	return <AdminLayout>{children}</AdminLayout>;
}

// ✅ Public Route Component - For Auth Page Only
function PublicRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	// If already logged in, redirect to dashboard
	if (user) {
		console.log("✅ User already logged in, redirecting to /");
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
}

function AppRoutes() {
	return (
		<Routes>
			{/* Public Route - Auth Page */}
			<Route
				path="/auth"
				element={
					<PublicRoute>
						<AuthForm />
					</PublicRoute>
				}
			/>

			{/* Protected Routes - Require Authentication */}
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<Index />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/devotees"
				element={
					<ProtectedRoute>
						<Devotees />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/events"
				element={
					<ProtectedRoute>
						<Events />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/donations"
				element={
					<ProtectedRoute>
						<Donations />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/communities"
				element={
					<ProtectedRoute>
						<Communities />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/communities/:id"
				element={
					<ProtectedRoute>
						<CommunityDetail />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/finance"
				element={
					<ProtectedRoute>
						<Finance />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/volunteers"
				element={
					<ProtectedRoute>
						<Volunteers />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/reports"
				element={
					<ProtectedRoute>
						<ReportsAnalyticsPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/settings"
				element={
					<ProtectedRoute>
						<Settings />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/pujas"
				element={
					<ProtectedRoute>
						<Pujas />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/pujas-list"
				element={
					<ProtectedRoute>
						<PujasPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/communications"
				element={
					<ProtectedRoute>
						<Communications />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin"
				element={
					<ProtectedRoute>
						<AdminPage />
					</ProtectedRoute>
				}
			/>

			{/* 404 Page */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true,
				}}>
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
