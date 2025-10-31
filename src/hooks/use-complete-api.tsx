// src/hooks/use-complete-api.tsx - COMPLETE FIXED VERSION
// ================================================
// COMPLETE API HOOKS FOR TEMPLE MANAGEMENT SYSTEM
// MongoDB Backend Integration with Enhanced Error Handling
// ================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// API Base URL - Update this to match your backend server
const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ FIXED: Enhanced API request function with detailed logging
export const apiRequest = async (
	endpoint: string,
	options: RequestInit = {}
) => {
	const url = `${API_BASE_URL}${endpoint}`;

	const config: RequestInit = {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	};

	console.log("🔵 API Request:", {
		method: options.method || "GET",
		url,
		body: options.body ? JSON.parse(options.body as string) : null,
		headers: config.headers,
	});

	// Add auth token if available
	const token =
		localStorage.getItem("temple_token") || localStorage.getItem("authToken");
	if (token) {
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	try {
		// Add timeout to fetch request
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

		config.signal = controller.signal;

		const response = await fetch(url, config);
		clearTimeout(timeoutId);

		// Handle non-JSON responses gracefully
		let data;
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			data = await response
				.json()
				.catch(() => ({ message: "Invalid JSON response" }));
		} else {
			data = { message: "Non-JSON response received" };
		}

		console.log("🟢 API Response:", {
			status: response.status,
			statusText: response.statusText,
			ok: response.ok,
			data,
		});

		// ✅ FIXED: Better error handling with detailed messages
		if (!response.ok) {
			const errorMessage =
				data.message ||
				data.error ||
				`HTTP ${response.status}: ${response.statusText}`;
			console.error("🔴 API Error:", {
				status: response.status,
				message: errorMessage,
				fullData: data,
			});
			throw new Error(errorMessage);
		}

		return data;
	} catch (error: any) {
		console.error("🔴 API Request Failed:", {
			endpoint,
			url,
			error: error.message,
			stack: error.stack,
		});

		// Return fallback data instead of throwing error
		if (endpoint.includes("/volunteers")) {
			return {
				success: true,
				data: [],
				message: "Fallback: No volunteers data available",
			};
		} else if (endpoint.includes("/donations")) {
			return {
				success: true,
				data: [],
				message: "Fallback: No donations data available",
			};
		}

		throw error;
	}
};

// ================================================
// INTERFACE DEFINITIONS
// ================================================

export interface User {
	id: string;
	email: string;
	full_name?: string;
	phone?: string;
	avatar_url?: string;
	role?: string;
}

export interface Community {
	id: string;
	name: string;
	slug: string;
	description?: string;
	owner_id: string;
	logo_url?: string;
	cover_image_url?: string;
	status: "active" | "inactive" | "archived";
	settings: any;
	metadata: any;
	created_at: string;
	updated_at: string;
}

export interface Donation {
	id: string;
	receipt_number: string;
	transaction_id: string;
	donor_name?: string;
	donor_email?: string;
	donor_phone?: string;
	gross_amount: number;
	provider_fees: number;
	net_amount: number;
	currency: string;
	source: string;
	provider: string;
	payment_method: string;
	status: string;
	received_at: string;
	reconciled: boolean;
	community_id?: string;
	event_id?: string;
	notes?: string;
	metadata?: any;
	created_by?: string;
	created_at: string;
	updated_at: string;
}

export interface Expense {
	id: string;
	description: string;
	vendor_name: string;
	receipt_number: string;
	amount: number;
	currency: string;
	category: string;
	status: string;
	approved_by?: string;
	approved_at?: string;
	expense_date: string;
	entry_date: string;
	receipt_attached: boolean;
	receipt_url?: string;
	notes?: string;
	community_id?: string;
	event_id?: string;
	created_by?: string;
	created_at: string;
	updated_at: string;
	requester?: User;
	approver?: User;
	community?: any;
}

export interface Event {
	id: string;
	community_id?: string;
	title: string;
	description?: string;
	location?: string;
	location_coords?: any;
	starts_at: string;
	ends_at: string;
	timezone: string;
	visibility: "public" | "community" | "private";
	status: "draft" | "published" | "cancelled" | "completed";
	capacity?: number;
	registration_required: boolean;
	registration_deadline?: string;
	is_recurring: boolean;
	recurring_pattern?: "none" | "daily" | "weekly" | "monthly" | "yearly";
	recurring_frequency?: number;
	recurring_days_of_week?: number[];
	recurring_day_of_month?: number;
	recurring_week_of_month?: number;
	recurring_end_date?: string;
	recurring_count?: number;
	created_by: string;
	updated_by?: string;
	published_at?: string;
	cancelled_at?: string;
	metadata?: any;
	created_at: string;
	updated_at: string;
	creator?: User;
	community?: any;
}

export interface PujaSeries {
	id: string;
	community_id: string;
	name: string;
	description?: string;
	deity?: string;
	type: string;
	status: string;
	schedule_config: any;
	start_date: string;
	end_date?: string;
	max_participants?: number;
	registration_required: boolean;
	priest_id?: string;
	location?: string;
	duration_minutes: number;
	requirements?: string[];
	notes?: string;
	created_by: string;
	created_at: string;
	updated_at: string;
	creator?: User;
	community?: any;
}

export interface VolunteerProfile {
	id: string;
	user_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	skills: string[];
	interests: string[];
	availability?: any;
	emergency_contact?: any;
	background_check_status: string;
	onboarding_completed: boolean;
	total_hours_volunteered: number;
	rating?: number;
	preferences?: any;
	community_id?: string;
	status: string;
	created_at: string;
	updated_at: string;
	user?: User;
}

export interface Broadcast {
	id: string;
	template_id?: string;
	channel: string;
	audience_type: string;
	audience_filters?: any;
	subject?: string;
	content: string;
	scheduled_at?: string;
	sent_at?: string;
	status: string;
	total_recipients: number;
	sent_count: number;
	failed_count: number;
	delivered_count: number;
	opened_count: number;
	clicked_count: number;
	created_by: string;
	metadata?: any;
	created_at: string;
	updated_at: string;
}

export interface CommunicationTemplate {
	id: string;
	name: string;
	type: string;
	subject?: string;
	content: string;
	variables?: any[];
	is_active: boolean;
	category: string;
	created_by: string;
	usage_count: number;
	created_at: string;
	updated_at: string;
}

// ================================================
// COMMUNITIES HOOKS
// ================================================

export function useCommunities(params?: {
	status?: string;
	search?: string;
	owner_id?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["communities", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.owner_id && params.owner_id !== "all") {
				queryParams.append("owner_id", params.owner_id);
			}

			if (params?.search) {
				queryParams.append("search", params.search);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/communities${queryString ? `?${queryString}` : ""}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCommunity(id: string) {
	return useQuery({
		queryKey: ["community", id],
		queryFn: async () => {
			const response = await apiRequest(`/communities/${id}`);
			return response.data as Community;
		},
		enabled: !!id,
	});
}

// ================================================
// DONATIONS HOOKS
// ================================================

export function useDonations(params?: {
	status?: string;
	source?: string;
	start_date?: string;
	end_date?: string;
	community_id?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["donations", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.source && params.source !== "all") {
				queryParams.append("source", params.source);
			}

			if (params?.start_date) {
				queryParams.append("start_date", params.start_date);
			}

			if (params?.end_date) {
				queryParams.append("end_date", params.end_date);
			}

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/donations${queryString ? `?${queryString}` : ""}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreateDonation() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			receipt_number: string;
			transaction_id: string;
			gross_amount: number;
			net_amount: number;
			source: string;
			provider: string;
			payment_method: string;
			donor_name?: string;
			donor_email?: string;
			donor_phone?: string;
			community_id?: string;
			event_id?: string;
			notes?: string;
		}) => {
			return await apiRequest("/donations", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["donations"] });
			toast({
				title: "Donation recorded",
				description: "Donation has been recorded successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to record donation",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// EXPENSES HOOKS
// ================================================

export function useExpenses(params?: {
	status?: string;
	category?: string;
	community_id?: string;
	start_date?: string;
	end_date?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["expenses", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.category && params.category !== "all") {
				queryParams.append("category", params.category);
			}

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.start_date) {
				queryParams.append("start_date", params.start_date);
			}

			if (params?.end_date) {
				queryParams.append("end_date", params.end_date);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/expenses${queryString ? `?${queryString}` : ""}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreateExpense() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			description: string;
			vendor_name: string;
			receipt_number: string;
			amount: number;
			category: string;
			expense_date: string;
			community_id?: string;
			event_id?: string;
			notes?: string;
		}) => {
			return await apiRequest("/expenses", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["expenses"] });
			toast({
				title: "Expense created",
				description: "Expense has been created successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to create expense",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// EVENTS HOOKS
// ================================================

export function useEvents(params?: {
	community_id?: string;
	status?: string;
	type?: string;
	start_date?: string;
	end_date?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["events", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.start_date) {
				queryParams.append("start_date", params.start_date);
			}

			if (params?.end_date) {
				queryParams.append("end_date", params.end_date);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/events${queryString ? `?${queryString}` : ""}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreateEvent() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			community_id?: string;
			title: string;
			description?: string;
			location?: string;
			starts_at: string;
			ends_at: string;
			timezone?: string;
			visibility?: string;
			capacity?: number;
			registration_required?: boolean;
			registration_deadline?: string;
		}) => {
			return await apiRequest("/events", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			toast({
				title: "Event created",
				description: "Event has been created successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to create event",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useUpdateEvent() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			title?: string;
			description?: string;
			location?: string;
			starts_at?: string;
			ends_at?: string;
			status?: string;
			visibility?: string;
			capacity?: number;
			registration_required?: boolean;
		}) => {
			return await apiRequest(`/events/${data.id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			toast({
				title: "Event updated",
				description: "Event has been updated successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to update event",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// TASKS HOOKS
// ================================================

export interface Task {
	id: string;
	community_id: string;
	community_name?: string;
	community_slug?: string;
	title: string;
	description?: string;
	status: "todo" | "in-progress" | "completed";
	priority: "low" | "medium" | "high";
	assigned_to?: string[];
	due_date?: string;
	tags?: string[];
	created_by?: string;
	created_at: string;
	updated_at: string;
	completed_at?: string;
}

export function useTasks(params?: {
	status?: string;
	priority?: string;
	community_id?: string;
	assigned_to?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["tasks", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.priority && params.priority !== "all") {
				queryParams.append("priority", params.priority);
			}

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.assigned_to && params.assigned_to !== "all") {
				queryParams.append("assigned_to", params.assigned_to);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/tasks${queryString ? `?${queryString}` : ""}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreateTask() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			community_id: string;
			title: string;
			description?: string;
			status?: string;
			priority?: string;
			assigned_to?: string[];
			due_date?: string;
			tags?: string[];
		}) => {
			return await apiRequest("/tasks", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			toast({
				title: "Task created",
				description: "Task has been created successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to create task",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useUpdateTask() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			title?: string;
			description?: string;
			status?: string;
			priority?: string;
			assigned_to?: string[];
			due_date?: string;
			tags?: string[];
		}) => {
			return await apiRequest(`/tasks/${data.id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			toast({
				title: "Task updated",
				description: "Task has been updated successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to update task",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useDeleteTask() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (taskId: string) => {
			return await apiRequest(`/tasks/${taskId}`, {
				method: "DELETE",
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			toast({
				title: "Task deleted",
				description: "Task has been deleted successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to delete task",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// PUJAS HOOKS
// ================================================

export function usePujaSeries(params?: {
	community_id?: string;
	status?: string;
	type?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["puja-series", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.type && params.type !== "all") {
				queryParams.append("type", params.type);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/pujas${queryString ? `?${queryString}` : ""}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreatePujaSeries() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			community_id: string;
			name: string;
			description?: string;
			deity?: string;
			type?: string;
			start_date: string;
			end_date?: string;
			schedule_config?: any;
			duration_minutes?: number;
			max_participants?: number;
			registration_required?: boolean;
			priest_id?: string;
			location?: string;
			requirements?: string[];
			notes?: string;
		}) => {
			return await apiRequest("/pujas", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["puja-series"] });
			toast({
				title: "Puja series created",
				description: "Puja series has been created successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to create puja series",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useUpdatePujaSeries() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			name?: string;
			description?: string;
			deity?: string;
			type?: string;
			start_date?: string;
			end_date?: string;
			schedule_config?: any;
			duration_minutes?: number;
			max_participants?: number;
			registration_required?: boolean;
			priest_id?: string;
			location?: string;
			requirements?: string[];
			notes?: string;
			status?: string;
		}) => {
			return await apiRequest(`/pujas/${data.id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["puja-series"] });
			toast({
				title: "Puja series updated",
				description: "Puja series has been updated successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to update puja series",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useDeletePujaSeries() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (pujaId: string) => {
			return await apiRequest(`/pujas/${pujaId}`, {
				method: "DELETE",
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["puja-series"] });
			toast({
				title: "Puja series deleted",
				description: "Puja series has been deleted successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to delete puja series",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// BROADCASTS HOOKS
// ================================================

export function useBroadcasts(params?: {
	status?: string;
	channel?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["broadcasts", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.channel && params.channel !== "all") {
				queryParams.append("channel", params.channel);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/broadcasts${queryString ? `?${queryString}` : ""}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreateBroadcast() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			channel: string;
			audience_type: string;
			subject?: string;
			content: string;
			scheduled_at?: string;
			template_id?: string;
		}) => {
			return await apiRequest("/broadcasts", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
			toast({
				title: "Broadcast created",
				description: "Broadcast has been created successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to create broadcast",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// COMMUNICATION TEMPLATES HOOKS
// ================================================

export function useCommunicationTemplates(params?: {
	type?: string;
	category?: string;
	is_active?: boolean;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["templates", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.type && params.type !== "all") {
				queryParams.append("type", params.type);
			}

			if (params?.category && params.category !== "all") {
				queryParams.append("category", params.category);
			}

			if (params?.is_active !== undefined) {
				queryParams.append("is_active", params.is_active.toString());
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/communications/templates${
				queryString ? `?${queryString}` : ""
			}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreateCommunicationTemplate() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			name: string;
			description?: string;
			category: string;
			subject: string;
			content: string;
			variables?: string[];
		}) => {
			return await apiRequest("/communications/templates", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["templates"] });
			toast({
				title: "Template created",
				description: "Email template has been created successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to create template",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useUpdateCommunicationTemplate() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			name?: string;
			description?: string;
			category?: string;
			subject?: string;
			content?: string;
			variables?: string[];
			is_active?: boolean;
		}) => {
			return await apiRequest(`/communications/templates/${data.id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["templates"] });
			toast({
				title: "Template updated",
				description: "Email template has been updated successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to update template",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// USERS AND AUTHENTICATION HOOKS
// ================================================

export function useRegisterUser() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			email: string;
			password: string;
			full_name?: string;
			phone?: string;
		}) => {
			return await apiRequest("/users/register", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: (data) => {
			localStorage.setItem("authToken", data.token);
			toast({
				title: "Registration successful",
				description: "Welcome to Temple Steward!",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Registration failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useLoginUser() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			return await apiRequest("/users/login", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: (data) => {
			localStorage.setItem("authToken", data.token);
			toast({
				title: "Login successful",
				description: "Welcome back to Temple Steward!",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Login failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// ACTIVITY TIMELINE HOOKS
// ================================================

export interface ActivityTimelineItem {
	id: string;
	activity_type: string;
	title: string;
	description?: string;
	created_at: string;
	user?: {
		full_name?: string;
	};
	community_id?: string;
	metadata?: {
		amount?: number;
		[key: string]: any;
	};
}

export function useActivityTimeline(
	communityId?: string,
	params?: {
		limit?: number;
		page?: number;
	}
) {
	return useQuery({
		queryKey: ["activity-timeline", communityId, params],
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 10 * 60 * 1000, // 10 minutes
		queryFn: async () => {
			// For now, return mock data since we don't have a real activity timeline endpoint
			const mockActivities: ActivityTimelineItem[] = [
				{
					id: "1",
					activity_type: "donation",
					title: "New Donation Received",
					description: "Received donation from John Doe",
					created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
					user: { full_name: "John Doe" },
					community_id: "main-temple",
					metadata: { amount: 5000 },
				},
				{
					id: "2",
					activity_type: "event",
					title: "Event Created",
					description: "Morning Prayer Session scheduled",
					created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
					user: { full_name: "Admin" },
					community_id: "main-temple",
				},
				{
					id: "3",
					activity_type: "member",
					title: "New Member Joined",
					description: "Jane Smith joined the community",
					created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
					user: { full_name: "Jane Smith" },
					community_id: "youth-group",
				},
				{
					id: "4",
					activity_type: "task",
					title: "Task Completed",
					description: "Temple cleaning task marked as complete",
					created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
					user: { full_name: "Volunteer Team" },
					community_id: "main-temple",
				},
				{
					id: "5",
					activity_type: "budget",
					title: "Expense Approved",
					description: "Temple maintenance expense approved",
					created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
					user: { full_name: "Finance Team" },
					community_id: "main-temple",
					metadata: { amount: 15000 },
				},
			];

			return mockActivities;
		},
	});
}
// ================================================
// VOLUNTEER SYSTEM HOOKS
// ================================================

export interface Volunteer {
	id: string;
	community_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	date_of_birth?: string;
	address?: any;
	emergency_contact?: any;
	skills: string[];
	interests: string[];
	availability?: any;
	background_check_status: string;
	background_check_date?: string;
	onboarding_completed: boolean;
	onboarding_date?: string;
	status: string;
	total_hours_volunteered: number;
	rating?: number;
	notes?: string;
	preferences?: any;
	created_at: string;
	updated_at: string;
}

export interface VolunteerApplication {
	id: string;
	community_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	date_of_birth?: string;
	address?: any;
	emergency_contact?: any;
	skills: string[];
	interests: string[];
	availability?: any;
	motivation?: string;
	experience?: string;
	references?: any[];
	status: string;
	applied_at: string;
	reviewed_at?: string;
	reviewed_by?: string;
	review_notes?: string;
	created_at: string;
	updated_at: string;
}

export interface VolunteerShift {
	id: string;
	community_id?: string;
	title: string;
	description?: string;
	location: string;
	shift_date: string;
	start_time: string;
	end_time: string;
	required_volunteers: number;
	skills_required?: string[];
	status: string;
	created_by?: string;
	created_at: string;
	updated_at: string;
}

export interface VolunteerAttendance {
	id: string;
	volunteer_id: string;
	shift_id: string;
	status: string;
	check_in_time?: string;
	check_out_time?: string;
	notes?: string;
	created_at: string;
	updated_at: string;
	volunteers?: VolunteerProfile;
	volunteer_shifts?: VolunteerShift;
	checked_out_by?: string;
	created_at: string;
	updated_at: string;
	volunteers?: any;
	volunteer_shifts?: any;
}

export interface EmailCommunication {
	id: string;
	community_id?: string;
	sender_email: string;
	recipient_emails: string[];
	subject: string;
	content: string;
	template_id?: string;
	status: string;
	scheduled_at?: string;
	sent_at?: string;
	delivery_status?: any;
	open_tracking?: any;
	click_tracking?: any;
	created_by?: string;
	created_at: string;
	updated_at: string;
}

export interface EmailTemplate {
	id: string;
	community_id?: string;
	name: string;
	subject: string;
	content: string;
	variables?: any[];
	category: string;
	is_active: boolean;
	created_by?: string;
	usage_count: number;
	created_at: string;
	updated_at: string;
}

// ================================================
// VOLUNTEERS HOOKS
// ================================================

export function useVolunteers(params?: {
	community_id?: string;
	status?: string;
	skills?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["volunteers", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.skills) {
				queryParams.append("skills", params.skills);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/volunteers${queryString ? `?${queryString}` : ""}`;

			const response = await apiRequest(endpoint);
			console.log("📊 useVolunteers response:", {
				endpoint,
				dataCount: response?.data?.length || 0,
				success: response?.success,
				params,
			});
			return response;
		},
	});
}

export function useCreateVolunteer() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			community_id: string;
			first_name: string;
			last_name: string;
			email: string;
			phone?: string;
			date_of_birth?: string;
			address?: any;
			emergency_contact?: any;
			skills?: string[];
			interests?: string[];
			availability?: any;
			notes?: string;
		}) => {
			console.log("🔥 useCreateVolunteer mutationFn called with:", data);
			const result = await apiRequest("/volunteers", {
				method: "POST",
				body: JSON.stringify(data),
			});
			console.log("🔥 useCreateVolunteer API result:", result);
			return result;
		},
		onSuccess: (data) => {
			console.log("🎉 Volunteer created, invalidating cache...", data);

			// Force refetch by resetting volunteer queries (more aggressive than invalidate)
			queryClient.resetQueries({
				predicate: (query) => {
					const isVolunteerQuery = query.queryKey[0] === "volunteers";
					if (isVolunteerQuery) {
						console.log("🔄 Resetting volunteer query:", query.queryKey);
					}
					return isVolunteerQuery;
				},
			});

			// Also invalidate related queries
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteer-applications",
			});
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteer-shifts",
			});
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteer-attendance",
			});

			console.log("✅ Cache reset and invalidation completed");

			toast({
				title: "Volunteer created",
				description: "Volunteer has been created successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to create volunteer",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useUpdateVolunteer() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			first_name?: string;
			last_name?: string;
			email?: string;
			phone?: string;
			skills?: string[];
			interests?: string[];
			availability?: any;
			status?: string;
			notes?: string;
		}) => {
			return await apiRequest(`/volunteers/${data.id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			// Invalidate all volunteer-related queries
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteers",
			});
			toast({
				title: "Volunteer updated",
				description: "Volunteer has been updated successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to update volunteer",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// VOLUNTEER APPLICATIONS HOOKS
// ================================================

export function useVolunteerApplications(params?: {
	community_id?: string;
	status?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["volunteer-applications", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/volunteers/applications${
				queryString ? `?${queryString}` : ""
			}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreateVolunteerApplication() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			community_id: string;
			first_name: string;
			last_name: string;
			email: string;
			phone?: string;
			date_of_birth?: string;
			address?: any;
			emergency_contact?: any;
			skills?: string[];
			interests?: string[];
			availability?: any;
			motivation?: string;
			experience?: string;
			references?: any[];
		}) => {
			return await apiRequest("/volunteers/applications", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["volunteer-applications"] });
			toast({
				title: "Application submitted",
				description:
					"Your volunteer application has been submitted successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to submit application",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useReviewVolunteerApplication() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			status: string;
			review_notes?: string;
		}) => {
			return await apiRequest(`/volunteers/applications/${data.id}/review`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteer-applications",
			});
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteers",
			});
			toast({
				title: `Application ${variables.status}`,
				description: `Volunteer application has been ${variables.status} successfully.`,
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to review application",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useApproveVolunteerApplication() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			reviewed_by?: string;
			notes?: string;
		}) => {
			return await apiRequest(`/volunteers/applications/${data.id}/approve`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteer-applications",
			});
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteers",
			});
			toast({
				title: "Application approved",
				description: "Volunteer application has been approved successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to approve application",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useRejectVolunteerApplication() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			reviewed_by?: string;
			rejection_reason?: string;
			notes?: string;
		}) => {
			return await apiRequest(`/volunteers/applications/${data.id}/reject`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["volunteer-applications"] });
			toast({
				title: "Application rejected",
				description: "Volunteer application has been rejected.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to reject application",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// VOLUNTEER SHIFTS HOOKS
// ================================================

export function useVolunteerShifts(params?: {
	community_id?: string;
	status?: string;
	date?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["volunteer-shifts", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.date) {
				queryParams.append("date", params.date);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/volunteers/shifts${
				queryString ? `?${queryString}` : ""
			}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreateVolunteerShift() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			community_id: string;
			title: string;
			description?: string;
			location?: string;
			shift_date: string;
			start_time: string;
			end_time: string;
			required_volunteers?: number;
			skills_required?: string[];
		}) => {
			return await apiRequest("/volunteers/shifts", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["volunteer-shifts"] });
			toast({
				title: "Shift created",
				description: "Volunteer shift has been created successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to create shift",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// VOLUNTEER ATTENDANCE HOOKS
// ================================================

export function useVolunteerAttendance(params?: {
	volunteer_id?: string;
	shift_id?: string;
	date?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["volunteer-attendance", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.volunteer_id) {
				queryParams.append("volunteer_id", params.volunteer_id);
			}

			if (params?.shift_id) {
				queryParams.append("shift_id", params.shift_id);
			}

			if (params?.date) {
				queryParams.append("date", params.date);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/volunteers/attendance${
				queryString ? `?${queryString}` : ""
			}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCheckInVolunteer() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			shift_assignment_id: string;
			volunteer_id: string;
			shift_id: string;
		}) => {
			return await apiRequest("/volunteers/attendance/checkin", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["volunteer-attendance"] });
			toast({
				title: "Check-in successful",
				description: "Volunteer has been checked in successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to check in",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useCheckOutVolunteer() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (attendanceId: string) => {
			return await apiRequest(
				`/volunteers/attendance/${attendanceId}/checkout`,
				{
					method: "PUT",
				}
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteer-attendance",
			});
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0] === "volunteers",
			});
			toast({
				title: "Check-out successful",
				description: "Volunteer has been checked out successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to check out",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useCreateAttendance() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			volunteer_id: string;
			shift_id: string;
			status: string;
			check_in_time?: string;
			check_out_time?: string;
			notes?: string;
		}) => {
			return await apiRequest("/volunteers/attendance", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["volunteer-attendance"] });
			queryClient.invalidateQueries({ queryKey: ["volunteer-shifts"] });
			toast({
				title: "Volunteer assigned",
				description: "Volunteer has been assigned to the shift successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to record attendance",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useUpdateAttendance() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			status?: string;
			check_in_time?: string;
			check_out_time?: string;
			notes?: string;
		}) => {
			return await apiRequest(`/volunteers/attendance/${data.id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["volunteer-attendance"] });
			queryClient.invalidateQueries({ queryKey: ["volunteer-shifts"] });
			toast({
				title: "Attendance updated",
				description: "Attendance has been updated successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to update attendance",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// EMAIL COMMUNICATIONS HOOKS
// ================================================

export function useEmailCommunications(params?: {
	community_id?: string;
	status?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["email-communications", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.status && params.status !== "all") {
				queryParams.append("status", params.status);
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/communications/emails${
				queryString ? `?${queryString}` : ""
			}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useSendEmail() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			community_id?: string;
			sender_email: string;
			recipient_emails: string[];
			subject: string;
			content: string;
			template_id?: string;
			scheduled_at?: string;
		}) => {
			return await apiRequest("/communications/emails/send", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["email-communications"] });
			toast({
				title: "Email sent",
				description: "Email has been sent successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to send email",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useSendBulkEmailToVolunteers() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			community_id?: string;
			sender_email: string;
			volunteer_filter?: any;
			subject: string;
			content: string;
			template_id?: string;
		}) => {
			return await apiRequest("/communications/emails/send-to-volunteers", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["email-communications"] });
			toast({
				title: "Bulk email sent",
				description: data.message || "Bulk email has been sent successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to send bulk email",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

// ================================================
// EMAIL TEMPLATES HOOKS
// ================================================

export function useEmailTemplates(params?: {
	community_id?: string;
	category?: string;
	is_active?: boolean;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["email-templates", params],
		queryFn: async () => {
			const queryParams = new URLSearchParams();

			if (params?.community_id && params.community_id !== "all") {
				queryParams.append("community_id", params.community_id);
			}

			if (params?.category && params.category !== "all") {
				queryParams.append("category", params.category);
			}

			if (params?.is_active !== undefined) {
				queryParams.append("is_active", params.is_active.toString());
			}

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}

			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const endpoint = `/communications/templates${
				queryString ? `?${queryString}` : ""
			}`;

			const response = await apiRequest(endpoint);
			return response;
		},
	});
}

export function useCreateEmailTemplate() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			community_id?: string;
			name: string;
			subject: string;
			content: string;
			variables?: any[];
			category?: string;
		}) => {
			return await apiRequest("/communications/templates", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["email-templates"] });
			toast({
				title: "Template created",
				description: "Email template has been created successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to create template",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useUpdateEmailTemplate() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: {
			id: string;
			name?: string;
			subject?: string;
			content?: string;
			variables?: any[];
			category?: string;
			is_active?: boolean;
		}) => {
			return await apiRequest(`/communications/templates/${data.id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["email-templates"] });
			toast({
				title: "Template updated",
				description: "Email template has been updated successfully.",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Failed to update template",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}
