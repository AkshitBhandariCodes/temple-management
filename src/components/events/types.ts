export interface Event {
  id: string;
  title: string;
  description: string;
  communityId: string;
  communityName: string;
  location: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  allDay: boolean;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  visibility: 'public' | 'community' | 'private';
  registrationRequired: boolean;
  capacity?: number;
  currentRegistrations: number;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  tasks: Task[];
  imageUrl?: string;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  frequency: number;
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  weekOfMonth?: number; // 1-4
  endType: 'never' | 'date' | 'count';
  endDate?: Date;
  endCount?: number;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  attachments: Attachment[];
  comments: Comment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export type ViewMode = 'calendar' | 'list' | 'kanban';

export interface EventFilters {
  search: string;
  dateRange: {
    from?: Date;
    to?: Date;
  };
  communityId?: string;
  status?: Event['status'];
  eventType?: 'one-time' | 'recurring';
}