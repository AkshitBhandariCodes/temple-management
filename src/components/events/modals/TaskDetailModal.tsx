import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CalendarIcon,
  Paperclip,
  MessageCircle,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Circle,
  Upload,
  Download,
  Trash2,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { Task, Comment, Attachment } from '../types';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const mockMembers = [
  { id: 'user-1', name: 'Priya Sharma' },
  { id: 'user-2', name: 'Raj Patel' },
  { id: 'user-3', name: 'Amit Kumar' },
  { id: 'user-4', name: 'Sneha Reddy' },
  { id: 'user-5', name: 'Dr. Meera Singh' }
];

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800'
};

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onSave
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const updateTask = (key: keyof Task, value: any) => {
    setEditedTask(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editedTask);
    setIsEditing(false);
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      authorId: 'current-user',
      authorName: 'Current User',
      content: newComment,
      createdAt: new Date()
    };

    updateTask('comments', [...editedTask.comments, comment]);
    setNewComment('');
  };

  const addAttachment = () => {
    // Simulate file upload
    const attachment: Attachment = {
      id: `attachment-${Date.now()}`,
      name: 'document.pdf',
      url: '#',
      size: 1024000,
      type: 'application/pdf'
    };

    updateTask('attachments', [...editedTask.attachments, attachment]);
  };

  const removeAttachment = (attachmentId: string) => {
    updateTask('attachments', editedTask.attachments.filter(a => a.id !== attachmentId));
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(editedTask.status)}
              <DialogTitle>
                {isEditing ? (
                  <Input
                    value={editedTask.title}
                    onChange={(e) => updateTask('title', e.target.value)}
                    className="text-lg font-semibold"
                  />
                ) : (
                  editedTask.title
                )}
              </DialogTitle>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={statusColors[editedTask.status]}>
                {editedTask.status.replace('-', ' ')}
              </Badge>
              <Badge className={priorityColors[editedTask.priority]}>
                {editedTask.priority} priority
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Task Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Task Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  {isEditing ? (
                    <Select 
                      value={editedTask.status || 'todo'} 
                      onValueChange={(value) => updateTask('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(editedTask.status)}
                      <span className="capitalize">{editedTask.status.replace('-', ' ')}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  {isEditing ? (
                    <Select 
                      value={editedTask.priority || 'medium'} 
                      onValueChange={(value) => updateTask('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={priorityColors[editedTask.priority]}>
                      {editedTask.priority}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  {isEditing ? (
                    <Select 
                      value={editedTask.assigneeId || ''} 
                      onValueChange={(value) => {
                        const member = mockMembers.find(m => m.id === value);
                        updateTask('assigneeId', value);
                        updateTask('assigneeName', member?.name);
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
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{editedTask.assigneeName || 'Unassigned'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editedTask.dueDate ? format(editedTask.dueDate, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editedTask.dueDate}
                          onSelect={(date) => updateTask('dueDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>
                        {editedTask.dueDate ? format(editedTask.dueDate, 'PPP') : 'No due date'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                {isEditing ? (
                  <Textarea
                    value={editedTask.description}
                    onChange={(e) => updateTask('description', e.target.value)}
                    rows={4}
                    placeholder="Enter task description"
                  />
                ) : (
                  <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {editedTask.description || 'No description provided'}
                  </p>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Paperclip className="h-5 w-5 mr-2" />
                  Attachments ({editedTask.attachments.length})
                </h3>
                <Button variant="outline" size="sm" onClick={addAttachment}>
                  <Upload className="h-4 w-4 mr-2" />
                  Add File
                </Button>
              </div>

              <div className="space-y-2">
                {editedTask.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{attachment.name}</div>
                        <div className="text-sm text-gray-500">{formatFileSize(attachment.size)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {editedTask.attachments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Paperclip className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <div className="text-sm">No attachments</div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Comments ({editedTask.comments.length})
              </h3>

              {/* Add Comment */}
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                  />
                </div>
                <Button onClick={addComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {editedTask.comments.map(comment => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{comment.authorName}</div>
                      <div className="text-xs text-gray-500">
                        {format(comment.createdAt, 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}

                {editedTask.comments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <div className="text-sm">No comments yet</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Actions</h3>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => updateTask('status', editedTask.status === 'done' ? 'todo' : 'done')}
                >
                  {editedTask.status === 'done' ? (
                    <>
                      <Circle className="h-4 w-4 mr-2" />
                      Mark as To Do
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Done
                    </>
                  )}
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Reassign Task
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Change Due Date
                </Button>
              </div>
            </div>

            {/* Activity Log */}
            <div className="space-y-4">
              <h3 className="font-semibold">Activity</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900">Task created</div>
                    <div className="text-gray-500 text-xs">2 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900">Status changed to In Progress</div>
                    <div className="text-gray-500 text-xs">1 hour ago</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900">Comment added</div>
                    <div className="text-gray-500 text-xs">30 minutes ago</div>
                  </div>
                </div>
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