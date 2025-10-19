import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CalendarIcon, X, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Event, RecurrencePattern, Task } from '../types';

interface CreateEventModalProps {
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
}

const mockCommunities = [
  { id: 'comm-1', name: 'Main Temple' },
  { id: 'comm-2', name: 'Youth Group' },
  { id: 'comm-3', name: 'Senior Citizens' },
  { id: 'comm-4', name: 'Cultural Committee' }
];

const mockMembers = [
  { id: 'user-1', name: 'Priya Sharma' },
  { id: 'user-2', name: 'Raj Patel' },
  { id: 'user-3', name: 'Amit Kumar' },
  { id: 'user-4', name: 'Sneha Reddy' },
  { id: 'user-5', name: 'Dr. Meera Singh' }
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    communityId: '',
    location: '',
    startDate: new Date(),
    endDate: new Date(),
    timezone: 'UTC',
    allDay: false,
    visibility: 'public',
    registrationRequired: false,
    isRecurring: false,
    tasks: []
  });

  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>({
    type: 'weekly',
    frequency: 1,
    endType: 'never'
  });

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo'
  });

  const updateFormData = (key: keyof Event, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateRecurrence = (key: keyof RecurrencePattern, value: any) => {
    setRecurrencePattern(prev => ({ ...prev, [key]: value }));
  };

  const addTask = () => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: `task-${Date.now()}`,
      eventId: '',
      title: newTask.title,
      description: newTask.description || '',
      assigneeId: newTask.assigneeId,
      assigneeName: newTask.assigneeName,
      dueDate: newTask.dueDate,
      priority: newTask.priority || 'medium',
      status: 'todo',
      attachments: [],
      comments: []
    };

    updateFormData('tasks', [...(formData.tasks || []), task]);
    setNewTask({ title: '', description: '', priority: 'medium', status: 'todo' });
  };

  const removeTask = (taskId: string) => {
    updateFormData('tasks', (formData.tasks || []).filter(t => t.id !== taskId));
  };

  const handleSave = () => {
    const eventData = {
      ...formData,
      communityName: mockCommunities.find(c => c.id === formData.communityId)?.name || '',
      recurrencePattern: formData.isRecurring ? recurrencePattern : undefined
    };
    
    onSave(eventData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Enter event title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="community">Community *</Label>
                <Select 
                  value={formData.communityId || ''} 
                  onValueChange={(value) => updateFormData('communityId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select community" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCommunities.map(community => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Enter event description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="Enter event location"
              />
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, 'PPP HH:mm') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => updateFormData('startDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, 'PPP HH:mm') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => updateFormData('endDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="allDay"
                checked={formData.allDay}
                onCheckedChange={(checked) => updateFormData('allDay', checked)}
              />
              <Label htmlFor="allDay">All Day Event</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => updateFormData('isRecurring', checked)}
              />
              <Label htmlFor="recurring">Recurring Event</Label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium">Recurrence Pattern</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Repeat Type</Label>
                    <Select 
                      value={recurrencePattern.type || 'weekly'} 
                      onValueChange={(value) => updateRecurrence('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Input
                      type="number"
                      min="1"
                      value={recurrencePattern.frequency}
                      onChange={(e) => updateRecurrence('frequency', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>End Condition</Label>
                  <Select 
                    value={recurrencePattern.endType || 'never'} 
                    onValueChange={(value) => updateRecurrence('endType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="date">End by date</SelectItem>
                      <SelectItem value="count">End after occurrences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select 
                  value={formData.visibility || 'public'} 
                  onValueChange={(value) => updateFormData('visibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="community">Community Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="registration"
                  checked={formData.registrationRequired}
                  onCheckedChange={(checked) => updateFormData('registrationRequired', checked)}
                />
                <Label htmlFor="registration">Registration Required</Label>
              </div>

              {formData.registrationRequired && (
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity Limit</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity || ''}
                    onChange={(e) => updateFormData('capacity', parseInt(e.target.value) || undefined)}
                    placeholder="Enter capacity limit"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium">Event Tasks</h3>
              
              {/* Add Task Form */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Task Title</Label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Select 
                      value={newTask.assigneeId || ''} 
                      onValueChange={(value) => {
                        const member = mockMembers.find(m => m.id === value);
                        setNewTask(prev => ({ 
                          ...prev, 
                          assigneeId: value,
                          assigneeName: member?.name 
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockMembers.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={addTask} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-2">
                {(formData.tasks || []).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.assigneeName && (
                        <div className="text-sm text-gray-500">Assigned to: {task.assigneeName}</div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(task.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Create Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};