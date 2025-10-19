import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, AlertTriangle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EXCEPTION_TYPES = [
  { value: 'cancel', label: 'Cancel specific occurrence', icon: X },
  { value: 'reschedule', label: 'Reschedule to different time', icon: Calendar },
  { value: 'change-priest', label: 'Change priest for occurrence', icon: User },
  { value: 'change-location', label: 'Change location for occurrence', icon: MapPin }
];

export default function ExceptionManagementModal({ isOpen, onClose, onSave, pujaData, priests, locations }) {
  const [exceptionType, setExceptionType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPriest, setNewPriest] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [reason, setReason] = useState('');
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [sendToCommunity, setSendToCommunity] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [notificationTiming, setNotificationTiming] = useState('immediate');

  const handleSubmit = () => {
    const exceptionData = {
      type: exceptionType,
      originalDate: selectedDate,
      originalTime: selectedTime,
      newDate: exceptionType === 'reschedule' ? newDate : null,
      newTime: exceptionType === 'reschedule' ? newTime : null,
      newPriest: exceptionType === 'change-priest' ? newPriest : null,
      newLocation: exceptionType === 'change-location' ? newLocation : null,
      reason,
      notifySubscribers,
      sendToCommunity,
      customMessage,
      notificationTiming,
      createdAt: new Date().toISOString(),
      pujaId: pujaData?.id || pujaData?.seriesId
    };

    onSave(exceptionData);
  };

  const isFormValid = () => {
    const hasBasicInfo = exceptionType && selectedDate && reason;
    
    if (exceptionType === 'reschedule') {
      return hasBasicInfo && newDate && newTime;
    }
    if (exceptionType === 'change-priest') {
      return hasBasicInfo && newPriest;
    }
    if (exceptionType === 'change-location') {
      return hasBasicInfo && newLocation;
    }
    
    return hasBasicInfo;
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

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Exception</h2>
            {pujaData && (
              <p className="text-gray-600 mt-1">
                For: {pujaData.title || 'Selected Puja'}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          {/* Exception Type Selection */}
          <div>
            <Label className="text-base font-medium">Exception Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {EXCEPTION_TYPES.map(type => {
                const IconComponent = type.icon;
                return (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all ${
                      exceptionType === type.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setExceptionType(type.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {exceptionType && (
            <>
              {/* Occurrence Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Select Occurrence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="selectedDate">Date</Label>
                      <Input
                        id="selectedDate"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="selectedTime">Time</Label>
                      <Input
                        id="selectedTime"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      />
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">
                        Selected Occurrence:
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(selectedDate)} at {formatTime(selectedTime)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Exception Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Exception Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exceptionType === 'reschedule' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newDate">New Date</Label>
                        <Input
                          id="newDate"
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <Label htmlFor="newTime">New Time</Label>
                        <Input
                          id="newTime"
                          type="time"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {exceptionType === 'change-priest' && (
                    <div>
                      <Label htmlFor="newPriest">New Priest</Label>
                      <Select value={newPriest} onValueChange={setNewPriest}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new priest" />
                        </SelectTrigger>
                        <SelectContent>
                          {priests.map(priest => (
                            <SelectItem key={`priest-${priest.id}`} value={priest.name}>
                              {priest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {exceptionType === 'change-location' && (
                    <div>
                      <Label htmlFor="newLocation">New Location</Label>
                      <Select value={newLocation} onValueChange={setNewLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location, index) => (
                            <SelectItem key={`location-${index}`} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="reason">Reason/Notes *</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please provide a reason for this exception"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Notification Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifySubscribers">Notify subscribers</Label>
                    <Switch
                      id="notifySubscribers"
                      checked={notifySubscribers}
                      onCheckedChange={setNotifySubscribers}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sendToCommunity">Send to community members</Label>
                    <Switch
                      id="sendToCommunity"
                      checked={sendToCommunity}
                      onCheckedChange={setSendToCommunity}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notificationTiming">Notification Timing</Label>
                    <Select value={notificationTiming} onValueChange={setNotificationTiming}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Send immediately</SelectItem>
                        <SelectItem value="1hour">Send 1 hour before</SelectItem>
                        <SelectItem value="24hours">Send 24 hours before</SelectItem>
                        <SelectItem value="manual">Send manually later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                </CardContent>
              </Card>

              {/* Preview */}
              {(exceptionType === 'reschedule' && newDate && newTime) && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Exception Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Original:</span>
                        <span>{formatDate(selectedDate)} at {formatTime(selectedTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Rescheduled to:</span>
                        <span>{formatDate(newDate)} at {formatTime(newTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Reason:</span>
                        <span className="text-right max-w-xs">{reason || 'Not specified'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
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
            Add Exception
          </Button>
        </div>
      </div>
    </div>
  );
}