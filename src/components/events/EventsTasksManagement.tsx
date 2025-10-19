import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  List, 
  Kanban, 
  Plus, 
  Upload, 
  Download,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Event, ViewMode, EventFilters } from './types';
import { EventsHeader } from './EventsHeader';
import { EventsFilters } from './EventsFilters';
import { CalendarView } from './views/CalendarView';
import { ListView } from './views/ListView';
import { KanbanView } from './views/KanbanView';
import { CreateEventModal } from './modals/CreateEventModal';
import { EventDetailModal } from './modals/EventDetailModal';
import { TaskDetailModal } from './modals/TaskDetailModal';
import { useEvents, useCreateEvent, useUpdateEvent, Event as DatabaseEvent } from '@/hooks/use-complete-api';

// Map database event to UI event type
function mapDatabaseToUIEvent(dbEvent: DatabaseEvent): Event {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || '',
    communityId: dbEvent.community_id || '',
    communityName: '', // This would need to be fetched separately or joined
    location: dbEvent.location || '',
    startDate: new Date(dbEvent.starts_at),
    endDate: new Date(dbEvent.ends_at),
    timezone: dbEvent.timezone,
    allDay: false, // This field doesn't exist in DB schema, need to add or derive
    status: dbEvent.status as 'draft' | 'published' | 'cancelled' | 'completed',
    visibility: dbEvent.visibility as 'public' | 'community' | 'private',
    registrationRequired: dbEvent.registration_required,
    capacity: dbEvent.capacity,
    currentRegistrations: 0, // This would need to be calculated from registrations table
    isRecurring: dbEvent.is_recurring,
    recurrencePattern: dbEvent.recurring_pattern !== 'none' ? {
      type: dbEvent.recurring_pattern as 'daily' | 'weekly' | 'monthly' | 'yearly',
      frequency: dbEvent.recurring_frequency || 1,
      daysOfWeek: dbEvent.recurring_days_of_week || undefined,
      endType: dbEvent.recurring_end_date ? 'date' : 'never',
      endDate: dbEvent.recurring_end_date ? new Date(dbEvent.recurring_end_date) : undefined,
    } : undefined,
    tasks: [], // This would need to be fetched separately from tasks table
  };
}

export const EventsTasksManagement: React.FC = () => {
  const { data: dbEvents, isLoading: eventsLoading } = useEvents();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    dateRange: {},
    communityId: undefined,
    status: undefined,
    eventType: undefined
  });
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Convert database events to UI events
  const events = useMemo(() => {
    return dbEvents?.map(mapDatabaseToUIEvent) || [];
  }, [dbEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !event.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !event.location.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from && event.startDate < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange.to && event.startDate > filters.dateRange.to) {
        return false;
      }

      // Community filter
      if (filters.communityId && event.communityId !== filters.communityId) {
        return false;
      }

      // Status filter
      if (filters.status && event.status !== filters.status) {
        return false;
      }

      // Event type filter
      if (filters.eventType === 'recurring' && !event.isRecurring) {
        return false;
      }
      if (filters.eventType === 'one-time' && event.isRecurring) {
        return false;
      }

      return true;
    });
  }, [events, filters]);

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      await createEventMutation.mutateAsync({
        community_id: eventData.communityId,
        title: eventData.title || '',
        description: eventData.description,
        location: eventData.location,
        starts_at: eventData.startDate?.toISOString() || new Date().toISOString(),
        ends_at: eventData.endDate?.toISOString() || new Date().toISOString(),
        timezone: eventData.timezone || 'Asia/Kolkata',
        visibility: eventData.visibility || 'public',
        capacity: eventData.capacity,
        registration_required: eventData.registrationRequired || false,
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      await updateEventMutation.mutateAsync({
        id: updatedEvent.id,
        title: updatedEvent.title,
        description: updatedEvent.description,
        location: updatedEvent.location,
        starts_at: updatedEvent.startDate.toISOString(),
        ends_at: updatedEvent.endDate.toISOString(),
        status: updatedEvent.status,
        visibility: updatedEvent.visibility,
        capacity: updatedEvent.capacity,
        registration_required: updatedEvent.registrationRequired,
      });
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    // For now, we'll just close the modal. In a real implementation,
    // you'd want to add a delete mutation and call it here
    setSelectedEvent(null);
  };

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    for (const event of events) {
      const task = event.tasks.find(t => t.id === selectedTaskId);
      if (task) return task;
    }
    return null;
  }, [selectedTaskId, events]);

  if (eventsLoading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <EventsHeader 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateEvent={() => setShowCreateModal(true)}
      />

      <EventsFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="flex-1 overflow-hidden">
        {viewMode === 'calendar' && (
          <CalendarView 
            events={filteredEvents}
            onEventSelect={setSelectedEvent}
            onEventUpdate={handleUpdateEvent}
          />
        )}
        
        {viewMode === 'list' && (
          <ListView 
            events={filteredEvents}
            onEventSelect={setSelectedEvent}
            onEventUpdate={handleUpdateEvent}
            onEventDelete={handleDeleteEvent}
            onTaskSelect={setSelectedTaskId}
          />
        )}
        
        {viewMode === 'kanban' && (
          <KanbanView 
            events={filteredEvents}
            onEventSelect={setSelectedEvent}
            onEventUpdate={handleUpdateEvent}
          />
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateEvent}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          onTaskSelect={setSelectedTaskId}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onSave={(updatedTask) => {
            const eventWithTask = events.find(e => e.tasks.some(t => t.id === updatedTask.id));
            if (eventWithTask) {
              const updatedEvent = {
                ...eventWithTask,
                tasks: eventWithTask.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
              };
              handleUpdateEvent(updatedEvent);
            }
          }}
        />
      )}
    </div>
  );
};