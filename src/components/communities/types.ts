export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive" | "Archived";
  logo: string;
  owner: User;
  memberCount: number;
  leadCount: number;
  activeEvents: number;
  pendingTasks: number;
  lastActivity: string;
  totalDonations: number;
  pendingBudgetRequests: number;
  createdAt: string;
}

export interface CommunityMember {
  id: string;
  user: User;
  role: "Lead" | "Member";
  joinDate: string;
  status: "Active" | "Inactive";
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "Draft" | "Published" | "Cancelled";
  attendeeCount: number;
  type: "Festival" | "Meeting" | "Workshop" | "Other";
}

export interface CommunityTask {
  id: string;
  title: string;
  description: string;
  assignee: User;
  status: "Todo" | "Done";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  attachments: number;
}

export interface CommunityActivity {
  id: string;
  type: "member_joined" | "event_created" | "task_completed" | "donation_received" | "other";
  description: string;
  user: User;
  timestamp: string;
}

export interface FinancialSummary {
  totalInflow: number;
  totalOutflow: number;
  netBalance: number;
  monthlyDonations: Array<{ month: string; amount: number }>;
  expenseBreakdown: Array<{ category: string; amount: number }>;
}