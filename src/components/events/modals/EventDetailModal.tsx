import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Edit, 
  Trash2, 
  MapPin, 
  Clock, 
  Users, 
  Repeat,
  Plus,
  CheckCircle,
  Circle,
  AlertCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { Event, Task } from '../types';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete: (eventId: string) => void;
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

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onSave,
  onDelete,
  onTaskSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event>(event);

  const updateEvent = (key: keyof Event, value: any) => {
    setEditedEvent(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editedEvent);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: Event['status']) => {
    const updatedEvent = { ...event, status: newStatus };
    onSave(updatedEvent);
  };

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = event.tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        return { ...task, status: newStatus };
      }
      return task;
    });
    
    onSave({ ...event, tasks: updatedTasks });
  };

  const getTaskCompletionRatio = () => {
    if (event.tasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = event.tasks.filter(t => t.status === 'done').length;
    return { completed, total: event.tasks.length, percentage: Math.round((completed / event.tasks.length) * 100) };
  };

  const taskCompletion = getTaskCompletionRatio();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-3">
              {isEditing ? (
                <Input
                  value={editedEvent.title}
                  onChange={(e) => updateEvent('title', e.target.value)}
                  className="text-xl font-semibold"
                />
              ) : (
                <span>{event.title}</span>
              )}
              {event.isRecurring && <Repeat className="h-5 w-5 text-gray-400" />}
            </DialogTitle>
            
            <div className="flex items-center space-x-2">
              <Badge className={statusColors[event.status]}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
              
              <Select value={event.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Event Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{format(event.startDate, 'EEEE, MMMM dd, yyyy')}</div>
                    <div className="text-sm text-gray-500">
                      {format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')} ({event.timezone})
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{event.location}</div>
                    <div className="text-sm text-gray-500">Event Location</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <Badge variant="outline">{event.communityName}</Badge>
                <Badge variant="outline">{event.visibility}</Badge>
                
                {event.registrationRequired && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {event.currentRegistrations}
                      {event.capacity && ` / ${event.capacity}`} registered
                    </span>
                  </div>
                )}
              </div>

              {event.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              )}
            </div>

            {/* Recurring Pattern */}
            {event.isRecurring && event.recurrencePattern && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recurring Pattern</h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium">Pattern Type</div>
                      <div className="text-sm text-gray-600">
                        {event.recurrencePattern.type.charAt(0).toUpperCase() + 
                         event.recurrencePattern.type.slice(1)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Frequency</div>
                      <div className="text-sm text-gray-600">
                        Every {event.recurrencePattern.frequency} 
                        {event.recurrencePattern.frequency > 1 ? 
                          ` ${event.recurrencePattern.type}s` : 
                          ` ${event.recurrencePattern.type}`
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm">
                      View All Instances
                    </Button>
                    <Button variant="outline" size="sm">
                      Add Exception
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <div className="flex items-center space-x-4">
                  {event.tasks.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${taskCompletion.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {taskCompletion.completed}/{taskCompletion.total}
                      </span>
                    </div>
                  )}
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {event.tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onTaskSelect(task.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(task.id);
                        }}
                        className="flex-shrink-0"
                      >
                        {task.status === 'done' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : task.status === 'in-progress' ? (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </div>
                        {task.assigneeName && (
                          <div className="text-sm text-gray-500">
                            Assigned to: {task.assigneeName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${priorityColors[task.priority]}`}
                      >
                        {task.priority}
                      </Badge>
                      
                      {task.dueDate && (
                        <div className="text-xs text-gray-500">
                          Due: {format(task.dueDate, 'MMM dd')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {event.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">No tasks assigned to this event</div>
                    <div className="text-xs mt-1">Add tasks to help organize the event</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={statusColors[event.status]} variant="outline">
                    {event.status}
                  </Badge>
                </div>
                
                {event.registrationRequired && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Registrations</span>
                    <span className="text-sm font-medium">
                      {event.currentRegistrations}
                      {event.capacity && ` / ${event.capacity}`}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tasks</span>
                  <span className="text-sm font-medium">
                    {taskCompletion.completed} / {taskCompletion.total}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Visibility</span>
                  <span className="text-sm font-medium capitalize">{event.visibility}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <h3 className="font-semibold">Actions</h3>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View Registrations
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Export to Calendar
                </Button>
                
                {event.isRecurring && (
                  <Button variant="outline" className="w-full justify-start">
                    <Repeat className="h-4 w-4 mr-2" />
                    Manage Recurrence
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};