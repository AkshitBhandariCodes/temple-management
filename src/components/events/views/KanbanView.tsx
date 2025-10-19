import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Repeat,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { Event, Task } from '../types';

interface KanbanViewProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
  onEventUpdate: (event: Event) => void;
}

const statusConfig = {
  draft: {
    title: 'Draft Events',
    color: 'bg-gray-50 border-gray-200',
    headerColor: 'bg-gray-100',
    badgeColor: 'bg-gray-100 text-gray-800'
  },
  published: {
    title: 'Published Events',
    color: 'bg-green-50 border-green-200',
    headerColor: 'bg-green-100',
    badgeColor: 'bg-green-100 text-green-800'
  },
  cancelled: {
    title: 'Cancelled Events',
    color: 'bg-red-50 border-red-200',
    headerColor: 'bg-red-100',
    badgeColor: 'bg-red-100 text-red-800'
  }
};

export const KanbanView: React.FC<KanbanViewProps> = ({
  events,
  onEventSelect,
  onEventUpdate
}) => {
  const getTaskCompletionRatio = (tasks: Task[]) => {
    if (tasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = tasks.filter(t => t.status === 'done').length;
    return { completed, total: tasks.length, percentage: Math.round((completed / tasks.length) * 100) };
  };

  const moveEvent = (event: Event, newStatus: Event['status']) => {
    onEventUpdate({ ...event, status: newStatus });
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const taskCompletion = getTaskCompletionRatio(event.tasks);
    
    return (
      <Card 
        className="p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-400"
        onClick={() => onEventSelect(event)}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-gray-900 flex-1 pr-2">
              {event.title}
              {event.isRecurring && (
                <Repeat className="inline h-4 w-4 ml-2 text-gray-400" />
              )}
            </h3>
          </div>

          {/* Community Badge */}
          <Badge variant="outline" className="text-xs">
            {event.communityName}
          </Badge>

          {/* Date and Time */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <div>
              <div>{format(event.startDate, 'MMM dd, yyyy')}</div>
              <div className="text-xs text-gray-500">
                {format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Registration Info */}
          {event.registrationRequired && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>
                {event.currentRegistrations}
                {event.capacity && ` / ${event.capacity}`} registered
              </span>
            </div>
          )}

          {/* Task Completion */}
          {event.tasks.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                {taskCompletion.percentage === 100 ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                ) : taskCompletion.percentage > 0 ? (
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                ) : (
                  <Circle className="h-4 w-4 mr-2 text-gray-400" />
                )}
                <span>{taskCompletion.completed}/{taskCompletion.total} tasks</span>
              </div>
              
              {taskCompletion.percentage > 0 && (
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${taskCompletion.percentage}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex space-x-1">
              {event.status !== 'published' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveEvent(event, 'published');
                  }}
                  className="text-xs"
                >
                  Publish
                </Button>
              )}
              {event.status !== 'cancelled' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveEvent(event, 'cancelled');
                  }}
                  className="text-xs text-red-600"
                >
                  Cancel
                </Button>
              )}
            </div>
            
            {event.isRecurring && (
              <Badge variant="secondary" className="text-xs">
                Recurring
              </Badge>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const KanbanColumn: React.FC<{ 
    status: keyof typeof statusConfig; 
    events: Event[];
  }> = ({ status, events: columnEvents }) => {
    const config = statusConfig[status];
    
    return (
      <div className={`flex-1 ${config.color} border rounded-lg`}>
        {/* Column Header */}
        <div className={`${config.headerColor} p-4 rounded-t-lg border-b`}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{config.title}</h2>
            <Badge variant="secondary" className="text-sm">
              {columnEvents.length}
            </Badge>
          </div>
          
          {status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          )}
        </div>

        {/* Column Content */}
        <div className="p-4 space-y-3 min-h-96 max-h-[calc(100vh-300px)] overflow-y-auto">
          {columnEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
          
          {columnEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-sm">No {status} events</div>
              {status === 'draft' && (
                <div className="text-xs mt-1">Create a new event to get started</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const draftEvents = events.filter(e => e.status === 'draft');
  const publishedEvents = events.filter(e => e.status === 'published');
  const cancelledEvents = events.filter(e => e.status === 'cancelled');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Kanban Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Event Status Board</h2>
          <div className="text-sm text-gray-500">
            Total Events: {events.length}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6">
        <div className="flex space-x-6 h-full">
          <KanbanColumn status="draft" events={draftEvents} />
          <KanbanColumn status="published" events={publishedEvents} />
          <KanbanColumn status="cancelled" events={cancelledEvents} />
        </div>
      </div>

      {/* Board Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <span>Draft: {draftEvents.length}</span>
            <span>Published: {publishedEvents.length}</span>
            <span>Cancelled: {cancelledEvents.length}</span>
          </div>
          <div>
            Drag events between columns to change status
          </div>
        </div>
      </div>
    </div>
  );
};