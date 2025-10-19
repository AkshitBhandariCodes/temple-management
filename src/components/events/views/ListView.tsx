import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit, 
  List as ListIcon, 
  Copy, 
  MoreHorizontal,
  Repeat,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Event, Task } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ListViewProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
  onEventUpdate: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
  onTaskSelect: (taskId: string) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
};

const priorityColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600'
};

export const ListView: React.FC<ListViewProps> = ({
  events,
  onEventSelect,
  onEventUpdate,
  onEventDelete,
  onTaskSelect
}) => {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'community' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const toggleAllEvents = () => {
    setSelectedEvents(prev => 
      prev.length === events.length ? [] : events.map(e => e.id)
    );
  };

  const duplicateEvent = (event: Event) => {
    const duplicated = {
      ...event,
      id: `${event.id}-copy-${Date.now()}`,
      title: `${event.title} (Copy)`,
      status: 'draft' as const,
      currentRegistrations: 0
    };
    onEventUpdate(duplicated);
  };

  const getTaskCompletionRatio = (tasks: Task[]) => {
    if (tasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = tasks.filter(t => t.status === 'done').length;
    return { completed, total: tasks.length, percentage: Math.round((completed / tasks.length) * 100) };
  };

  const sortedEvents = [...events].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.startDate.getTime() - b.startDate.getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'community':
        comparison = a.communityName.localeCompare(b.communityName);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Bulk Actions Bar */}
      {selectedEvents.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedEvents.length} event{selectedEvents.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Change Status
              </Button>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
              <Button variant="destructive" size="sm">
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700">
          <div className="col-span-1">
            <Checkbox
              checked={selectedEvents.length === events.length && events.length > 0}
              onCheckedChange={toggleAllEvents}
            />
          </div>
          <div className="col-span-3">Event Details</div>
          <div className="col-span-2">Schedule</div>
          <div className="col-span-2">Status & Metrics</div>
          <div className="col-span-2">Recurring Info</div>
          <div className="col-span-2">Actions</div>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-auto">
        {sortedEvents.map(event => {
          const taskCompletion = getTaskCompletionRatio(event.tasks);
          
          return (
            <div
              key={event.id}
              className="border-b border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Selection */}
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={() => toggleEventSelection(event.id)}
                  />
                </div>

                {/* Event Details */}
                <div className="col-span-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <button
                        onClick={() => onEventSelect(event)}
                        className="text-left hover:text-blue-600 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 mb-1">
                          {event.title}
                          {event.isRecurring && (
                            <Repeat className="inline h-4 w-4 ml-2 text-gray-400" />
                          )}
                        </h3>
                      </button>
                      <Badge variant="outline" className="text-xs">
                        {event.communityName}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="col-span-2">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {format(event.startDate, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {event.timezone}
                    </div>
                  </div>
                </div>

                {/* Status & Metrics */}
                <div className="col-span-2">
                  <div className="space-y-2">
                    <Badge className={statusColors[event.status]}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                    
                    {event.registrationRequired && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-3 w-3 mr-1" />
                        {event.currentRegistrations}
                        {event.capacity && ` / ${event.capacity}`}
                      </div>
                    )}
                    
                    {event.tasks.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          {taskCompletion.percentage === 100 ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : taskCompletion.percentage > 0 ? (
                            <AlertCircle className="h-3 w-3 text-yellow-500" />
                          ) : (
                            <Circle className="h-3 w-3 text-gray-400" />
                          )}
                          <span>{taskCompletion.completed}/{taskCompletion.total} tasks</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recurring Info */}
                <div className="col-span-2">
                  {event.isRecurring && event.recurrencePattern ? (
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">
                        {event.recurrencePattern.type.charAt(0).toUpperCase() + 
                         event.recurrencePattern.type.slice(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Every {event.recurrencePattern.frequency} 
                        {event.recurrencePattern.frequency > 1 ? 
                          ` ${event.recurrencePattern.type}s` : 
                          ` ${event.recurrencePattern.type}`
                        }
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Next: {format(new Date(event.startDate.getTime() + 7 * 24 * 60 * 60 * 1000), 'MMM dd')}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">One-time event</span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEventSelect(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (event.tasks.length > 0) {
                          onTaskSelect(event.tasks[0].id);
                        }
                      }}
                    >
                      <ListIcon className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => duplicateEvent(event)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Event
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onEventDelete(event.id)}
                          className="text-red-600"
                        >
                          Delete Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your filters or create a new event.</p>
          </div>
        </div>
      )}
    </div>
  );
};