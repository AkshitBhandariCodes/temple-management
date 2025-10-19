# Communications Management Module

This module provides a comprehensive communication management system for the temple administration, allowing for centralized management of broadcasts, brochures, announcements, and messaging across all temple stakeholders.

## Components

### Main Components

- **CommunicationsManagement**: Main container component with tabbed interface
- **DashboardTab**: Overview dashboard with metrics and recent activity
- **BroadcastsTab**: Manage broadcast campaigns and messaging
- **BrochuresTab**: Create and manage temple brochures and promotional materials
- **AnnouncementsTab**: Manage temple announcements and notices
- **TemplatesTab**: Create and manage message templates
- **MessageHistoryTab**: View and analyze message history and performance

### Modal Components

- **CreateBroadcastModal**: Multi-step modal for creating broadcast campaigns
- **CreateBrochureModal**: Multi-step modal for creating brochures

## Features

### Dashboard
- Communication overview cards showing key metrics
- Recent activity feed
- Interactive charts for delivery trends and engagement metrics
- Quick access to key actions

### Broadcasts
- Create multi-channel broadcast campaigns (Email, SMS, Push, WhatsApp)
- Audience targeting and segmentation
- Message scheduling and automation
- Real-time delivery tracking
- Comprehensive analytics and reporting

### Brochures
- Template-based brochure creation
- Multi-format generation (PDF, PPTX)
- Event integration for auto-population
- Sharing and distribution tools
- Download tracking and analytics

### Announcements
- Create and manage temple announcements
- Audience targeting and visibility controls
- Priority levels and pinning
- Multi-channel notifications
- Expiry date management

### Templates
- Email, SMS, and Push notification templates
- Variable-based personalization
- Usage tracking and analytics
- Category-based organization
- Template preview and testing

### Message History
- Comprehensive message archive
- Advanced search and filtering
- Delivery and engagement tracking
- Detailed message analytics
- Campaign association tracking

## Data Management

All data is currently stored locally using React state for demonstration purposes. In a production environment, this would be integrated with:

- Backend APIs for data persistence
- Real-time delivery services
- Analytics and reporting systems
- User management and authentication
- Template and media storage

## Responsive Design

The module is fully responsive and adapts to different screen sizes:
- **Mobile**: Single column layout with simplified interfaces
- **Tablet**: Two-column layout with condensed tables
- **Desktop**: Full multi-column layout with detailed panels

## Role-Based Access

The system supports different access levels:
- **Super Admin**: Full access to all features
- **Communications Manager**: Full CRUD access for messages and content
- **Community Owner**: Community-specific messaging
- **Volunteer Coordinator**: Volunteer-focused communications
- **Finance**: Donation-related communications only

## Integration Points

The module is designed to integrate with other temple management systems:
- **Event System**: Auto-generate event-based communications
- **Volunteer System**: Shift and assignment notifications
- **Finance System**: Donation receipts and updates
- **Puja System**: Puja schedule notifications
- **User Management**: Audience segmentation

## Usage

```tsx
import CommunicationsManagement from '@/components/communications/CommunicationsManagement';

// Use in a page component
const CommunicationsPage = () => {
  return (
    <AdminLayout>
      <CommunicationsManagement />
    </AdminLayout>
  );
};
```

## Dependencies

- React 18+
- Recharts for data visualization
- Lucide React for icons
- Radix UI components
- Tailwind CSS for styling

## Future Enhancements

- Real-time message delivery status
- Advanced analytics and reporting
- A/B testing for campaigns
- Automated campaign workflows
- Integration with external messaging services
- Advanced template builder with drag-and-drop
- Multi-language support
- Message approval workflows