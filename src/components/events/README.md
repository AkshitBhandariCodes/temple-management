# Events & Tasks Management Module

A comprehensive React component for managing temple events, recurring patterns, and associated tasks across all communities.

## Features

### 🗓️ Multiple View Modes
- **Calendar View**: Monthly grid layout with event cards
- **List View**: Detailed table with bulk actions
- **Kanban View**: Status-based board (Draft/Published/Cancelled)

### 🔍 Advanced Filtering
- Search by title, description, location
- Date range filtering
- Community-based filtering
- Status and event type filters

### 📅 Event Management
- Create one-time and recurring events
- Rich event details with location, capacity, registration
- Status management (Draft/Published/Cancelled/Completed)
- Community assignment and visibility controls

### 🔄 Recurring Events
- Support for Daily, Weekly, Monthly, Yearly patterns
- Flexible frequency settings
- End conditions (Never, By Date, After Count)
- Exception handling for specific occurrences

### ✅ Task Management
- Event-specific task assignment
- Priority levels (Low/Medium/High)
- Status tracking (Todo/In Progress/Done)
- Due date management
- File attachments and comments
- Task completion tracking

### 👥 Collaboration Features
- Task assignment to community members
- Comment threads on tasks
- File attachments with upload/download
- Activity logging and history

## Component Structure

```
src/components/events/
├── EventsTasksManagement.tsx    # Main container component
├── EventsHeader.tsx             # Header with view toggles and actions
├── EventsFilters.tsx            # Search and filter controls
├── types.ts                     # TypeScript interfaces
├── mockData.ts                  # Sample data for development
├── views/
│   ├── CalendarView.tsx         # Monthly calendar grid
│   ├── ListView.tsx             # Detailed table view
│   └── KanbanView.tsx           # Status-based board
├── modals/
│   ├── CreateEventModal.tsx     # Event creation form
│   ├── EventDetailModal.tsx     # Event details and editing
│   └── TaskDetailModal.tsx      # Task management interface
└── README.md                    # This file
```

## Usage

```tsx
import { EventsTasksManagement } from '@/components/events';

function EventsPage() {
  return (
    <AdminLayout>
      <EventsTasksManagement />
    </AdminLayout>
  );
}
```

## Data Models

### Event
- Basic information (title, description, location)
- Schedule (start/end dates, timezone, all-day flag)
- Community assignment and visibility
- Registration settings (required, capacity)
- Recurring pattern configuration
- Associated tasks array

### Task
- Assignment to community members
- Priority and status tracking
- Due dates and descriptions
- File attachments
- Comment threads

### Recurring Pattern
- Pattern type (daily/weekly/monthly/yearly)
- Frequency settings
- End conditions
- Days of week (for weekly)
- Week of month (for monthly)

## Key Features Implemented

### ✅ Calendar View
- Monthly grid with event cards
- Color-coded by community
- Recurring event indicators
- Click to view details
- Navigation controls
- Mini calendar sidebar

### ✅ List View
- Sortable table with all event details
- Bulk selection and actions
- Inline status changes
- Task completion indicators
- Registration metrics
- Quick action buttons

### ✅ Kanban View
- Three-column board (Draft/Published/Cancelled)
- Drag-and-drop status changes
- Event cards with key metrics
- Task completion progress bars
- Quick action buttons

### ✅ Event Creation
- Multi-tab form (Basic/Schedule/Settings/Tasks)
- Recurring pattern configuration
- Task assignment during creation
- Community and visibility settings
- Registration and capacity controls

### ✅ Event Details
- Comprehensive event information
- Inline editing capabilities
- Status management
- Task list with completion tracking
- Recurring pattern details
- Quick action sidebar

### ✅ Task Management
- Detailed task interface
- Status and priority management
- File attachments
- Comment threads
- Activity logging
- Assignment management

## Mock Data

The module includes comprehensive mock data with:
- 5 sample events across different communities
- Mix of one-time and recurring events
- Various statuses and configurations
- Associated tasks with different priorities
- Sample community and member data

## Responsive Design

- **Mobile**: Single column layout with tabs
- **Tablet**: Condensed views with essential information
- **Desktop**: Full multi-column layout with sidebars

## State Management

- Local state for UI interactions
- Event and task data management
- Filter and search state
- Modal visibility states
- Form data handling

## Future Enhancements

- Backend integration with Supabase
- Real-time updates and notifications
- Advanced recurring pattern options
- Event templates and duplication
- Integration with calendar applications
- Email notifications and reminders
- Advanced reporting and analytics