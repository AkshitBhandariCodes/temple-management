# Pujas Management Module

A comprehensive frontend module for managing temple puja series, recurring schedules, exceptions, and real-time status updates.

## Features

### 🗓️ Multiple View Modes
- **Calendar View**: Monthly calendar with puja instances, color-coded by status
- **List View**: Tabular and card views of puja series with detailed information
- **Schedule View**: Daily time-based schedule with drag-and-drop functionality

### ✨ Puja Series Management
- Create and edit recurring puja series
- Support for daily, weekly, monthly, and yearly recurrence patterns
- Advanced scheduling options with custom frequencies
- Priest assignment and location management
- Visibility controls (public, community, private)

### 🔄 Exception Management
- Cancel specific occurrences
- Reschedule to different times
- Change priest or location for specific instances
- Comprehensive notification system for exceptions

### 📊 Real-time Status Updates
- Quick status changes (on-time, delayed, cancelled, completed)
- Delay time tracking with new start times
- Reason/notes for status changes
- Subscriber notifications for updates

### 👥 Attendance & Participation
- Subscriber management and tracking
- Attendance tracking for completed pujas
- Capacity limits and registration requirements
- Participant lists and statistics

### 🔔 Notification System
- Automated subscriber notifications
- Custom notification messages
- Reminder settings (30 min, 15 min before)
- Exception and status change alerts

## Components

### Core Components
- `PujasManagement.tsx` - Main container component
- `CalendarView.tsx` - Monthly calendar with puja instances
- `ListView.tsx` - Table and card views of puja series
- `ScheduleView.tsx` - Daily time-based schedule view

### Modal Components
- `CreatePujaSeriesModal.tsx` - Create/edit puja series with tabs
- `ExceptionManagementModal.tsx` - Add exceptions to puja instances
- `PujaInstanceModal.tsx` - View detailed puja instance information
- `StatusUpdateModal.tsx` - Update puja status with notifications

## Data Structure

### Puja Series
```typescript
interface PujaSeries {
  id: string;
  title: string;
  description: string;
  location: string;
  priest: string;
  recurrence: string;
  startTime: string;
  duration: number;
  status: 'active' | 'inactive' | 'cancelled';
  subscribers: number;
  nextOccurrence: string;
  createdBy: string;
  lastModified: string;
}
```

### Puja Instance
```typescript
interface PujaInstance {
  id: string;
  seriesId: string;
  title: string;
  date: string;
  startTime: string;
  duration: number;
  priest: string;
  location: string;
  status: 'scheduled' | 'on-time' | 'delayed' | 'cancelled' | 'completed';
  subscribers: number;
  statusNotes?: string;
  lastUpdated?: string;
}
```

## Mock Data

The module includes comprehensive mock data for demonstration:
- Sample puja series (Morning Aarti, Evening Aarti, Hanuman Chalisa)
- Generated puja instances for the current month
- Mock priest and location data
- Sample attendance and status history data

## Interactive Features

### Calendar View
- Click on puja instances to view details
- Quick status update buttons
- Exception management from calendar
- Color-coded status indicators
- Monthly navigation with today button

### List View
- Toggle between table and card views
- Inline editing and quick actions
- Sorting and filtering capabilities
- Bulk operations support

### Schedule View
- Time-based daily schedule grid
- Drag-and-drop rescheduling (visual feedback)
- Location and priest filtering
- Print schedule functionality
- Daily summary statistics

### Status Management
- Real-time status updates
- Quick status buttons for common actions
- Delay time tracking with new start times
- Comprehensive notification options
- Status history tracking

## Responsive Design

- **Mobile**: Single column layout, simplified calendar
- **Tablet**: Condensed views with stacked forms
- **Desktop**: Full multi-column layout with sidebars

## Role-Based Features

The UI supports different user roles:
- **Super Admin**: Full access to all features
- **Priest**: Edit assigned pujas, update status
- **Community Owner**: View community-related pujas
- **Volunteer Coordinator**: View schedules for planning
- **Public**: Read-only access to public schedules

## Usage

```tsx
import { PujasManagement } from '@/components/pujas';

function App() {
  return <PujasManagement />;
}
```

## State Management

The module uses local React state for:
- View mode selection (calendar/list/schedule)
- Filter and search parameters
- Modal visibility states
- Form data and validation
- Generated puja instances
- Real-time status updates

## Future Enhancements

- Backend integration for data persistence
- Real-time WebSocket updates
- Advanced recurring pattern support
- Integration with calendar applications
- Mobile app companion
- Offline support with sync
- Advanced analytics and reporting
- Multi-language support
- Accessibility improvements
- Performance optimizations for large datasets