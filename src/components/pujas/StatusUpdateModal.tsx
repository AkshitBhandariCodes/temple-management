import React, { useState } from 'react';
import { X, Clock, AlertTriangle, CheckCircle, XCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const STATUS_OPTIONS = [
  { 
    value: 'on-time', 
    label: 'On-time', 
    icon: CheckCircle, 
    color: 'text-green-600',
    description: 'Puja started and proceeding as scheduled'
  },
  { 
    value: 'delayed', 
    label: 'Delayed', 
    icon: AlertTriangle, 
    color: 'text-yellow-600',
    description: 'Puja is running behind schedule'
  },
  { 
    value: 'cancelled', 
    label: 'Cancelled', 
    icon: XCircle, 
    color: 'text-red-600',
    description: 'Puja has been cancelled for today'
  },
  { 
    value: 'completed', 
    label: 'Completed', 
    icon: CheckCircle, 
    color: 'text-gray-600',
    description: 'Puja has been completed successfully'
  }
];

export default function StatusUpdateModal({ isOpen, onClose, onSave, instanceData }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [delayTime, setDelayTime] = useState('');
  const [reason, setReason] = useState('');
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [customMessage, setCustomMessage] = useState('');

  const handleSubmit = () => {
    onSave(instanceData?.id, selectedStatus, {
      delayTime: selectedStatus === 'delayed' ? delayTime : null,
      reason,
      notifySubscribers,
      customMessage,
      updatedAt: new Date().toISOString()
    });
  };

  const isFormValid = () => {
    if (!selectedStatus) return false;
    if (selectedStatus === 'delayed' && !delayTime) return false;
    if ((selectedStatus === 'cancelled' || selectedStatus === 'delayed') && !reason.trim()) return false;
    return true;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getQuickStatusButtons = () => {
    return [
      {
        status: 'on-time',
        label: 'Mark On-time',
        variant: 'default',
        className: 'bg-green-600 hover:bg-green-700'
      },
      {
        status: 'delayed',
        label: 'Mark Delayed',
        variant: 'default',
        className: 'bg-yellow-600 hover:bg-yellow-700'
      },
      {
        status: 'cancelled',
        label: 'Mark Cancelled',
        variant: 'default',
        className: 'bg-red-600 hover:bg-red-700'
      },
      {
        status: 'completed',
        label: 'Mark Completed',
        variant: 'default',
        className: 'bg-gray-600 hover:bg-gray-700'
      }
    ];
  };

  if (!isOpen || !instanceData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Update Status</h2>
            <p className="text-gray-600 mt-1">
              {instanceData.title} - {formatDate(instanceData.date)} at {formatTime(instanceData.startTime)}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{instanceData.title}</div>
                  <div className="text-sm text-gray-600">
                    {instanceData.location} • {instanceData.priest}
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {instanceData.status?.charAt(0).toUpperCase() + instanceData.status?.slice(1) || 'Scheduled'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Status Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Status Update</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {getQuickStatusButtons().map(button => (
                  <Button
                    key={button.status}
                    variant={selectedStatus === button.status ? 'default' : 'outline'}
                    className={selectedStatus === button.status ? button.className : ''}
                    onClick={() => setSelectedStatus(button.status)}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Status Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Status</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {STATUS_OPTIONS.map(option => {
                    const IconComponent = option.icon;
                    return (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-all ${
                          selectedStatus === option.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedStatus(option.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <IconComponent className={`h-5 w-5 ${option.color}`} />
                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Delay Time Input */}
              {selectedStatus === 'delayed' && (
                <div>
                  <Label htmlFor="delayTime">New Start Time</Label>
                  <Input
                    id="delayTime"
                    type="time"
                    value={delayTime}
                    onChange={(e) => setDelayTime(e.target.value)}
                    placeholder="Enter new start time"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Original time: {formatTime(instanceData.startTime)}
                  </p>
                </div>
              )}

              {/* Reason/Notes */}
              {(selectedStatus === 'cancelled' || selectedStatus === 'delayed') && (
                <div>
                  <Label htmlFor="reason">
                    Reason/Notes {(selectedStatus === 'cancelled' || selectedStatus === 'delayed') && '*'}
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={`Please provide a reason for ${selectedStatus === 'cancelled' ? 'cancellation' : 'delay'}`}
                    rows={3}
                  />
                </div>
              )}

              {selectedStatus && (
                <div>
                  <Label htmlFor="generalNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="generalNotes"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Any additional notes about the status update"
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Options */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifySubscribers">Notify subscribers</Label>
                  <p className="text-sm text-gray-600">
                    Send notification to all {instanceData.subscribers || 0} subscribers
                  </p>
                </div>
                <Switch
                  id="notifySubscribers"
                  checked={notifySubscribers}
                  onCheckedChange={setNotifySubscribers}
                />
              </div>

              {notifySubscribers && (
                <div>
                  <Label htmlFor="customMessage">Custom notification message</Label>
                  <Textarea
                    id="customMessage"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Optional custom message for subscribers"
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          {selectedStatus && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Update Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                    </Badge>
                  </div>
                  
                  {selectedStatus === 'delayed' && delayTime && (
                    <div className="flex justify-between">
                      <span className="font-medium">New time:</span>
                      <span>{formatTime(delayTime)}</span>
                    </div>
                  )}
                  
                  {reason && (
                    <div className="flex justify-between">
                      <span className="font-medium">Notes:</span>
                      <span className="text-right max-w-xs">{reason}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Notifications:</span>
                    <span>{notifySubscribers ? 'Will notify subscribers' : 'No notifications'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid()}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Update Status
          </Button>
        </div>
      </div>
    </div>
  );
}