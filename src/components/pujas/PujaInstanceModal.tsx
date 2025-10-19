import React from 'react';
import { X, Calendar, Clock, MapPin, User, Users, Phone, Mail, Navigation, Badge as BadgeIcon, History, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function PujaInstanceModal({ isOpen, onClose, instanceData, seriesData }) {
  if (!isOpen) return null;

  const data = instanceData || seriesData;
  if (!data) return null;

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

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: 'bg-blue-100 text-blue-800',
      'on-time': 'bg-green-100 text-green-800',
      delayed: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status] || variants.scheduled}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const getPriestInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P';
  };

  const mockAttendanceData = {
    expected: 45,
    actual: 38,
    percentage: 84,
    participants: [
      'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Devi', 'Mohan Singh'
    ]
  };

  const mockStatusHistory = [
    { status: 'scheduled', timestamp: '2024-01-15T05:30:00', note: 'Puja scheduled' },
    { status: 'on-time', timestamp: '2024-01-15T06:00:00', note: 'Started on time' },
    { status: 'completed', timestamp: '2024-01-15T07:00:00', note: 'Completed successfully' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
            <p className="text-gray-600 mt-1">
              {instanceData ? 'Puja Instance Details' : 'Puja Series Details'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {instanceData ? 'Instance Information' : 'Series Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{data.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {data.description || 'Daily morning prayers and offerings to the divine'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {instanceData ? formatDate(data.date) : 'Series Schedule'}
                          </div>
                          {!instanceData && (
                            <div className="text-gray-500">{data.recurrence}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{formatTime(data.startTime)}</div>
                          <div className="text-gray-500">{data.duration} minutes</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{data.location}</div>
                          <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                            <Navigation className="h-3 w-3 mr-1" />
                            Get directions
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <BadgeIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          {getStatusBadge(data.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {seriesData && instanceData && (
                    <div className="pt-3 border-t">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 mb-2">Series Information</div>
                        <div className="space-y-1 text-gray-600">
                          <div>Recurring pattern: {seriesData.recurrence}</div>
                          <div>Instance #{Math.floor(Math.random() * 50) + 1} in series</div>
                          <div>Next occurrence: {formatDate(seriesData.nextOccurrence)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Priest & Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Priest & Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {getPriestInitials(data.priest)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{data.priest}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Vedic Rituals Specialist</div>
                        <div className="flex items-center gap-4">
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            <Phone className="h-3 w-3 mr-1" />
                            +91 98765 43210
                          </Button>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            <Mail className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs">Available</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created by:</span>
                      <span className="font-medium">{data.createdBy || 'Admin'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last modified:</span>
                      <span className="font-medium">{data.lastModified || '2024-01-10'}</span>
                    </div>
                    {data.statusNotes && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status notes:</span>
                        <span className="font-medium text-right max-w-xs">{data.statusNotes}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Attendance & Participation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Attendance & Participation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {instanceData && instanceData.status === 'completed' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {mockAttendanceData.expected}
                          </div>
                          <div className="text-xs text-gray-600">Expected</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {mockAttendanceData.actual}
                          </div>
                          <div className="text-xs text-gray-600">Actual</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {mockAttendanceData.percentage}%
                          </div>
                          <div className="text-xs text-gray-600">Attendance</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Recent Participants</h5>
                        <div className="space-y-1">
                          {mockAttendanceData.participants.slice(0, 5).map((participant, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {participant}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {data.subscribers || 150}
                        </div>
                        <div className="text-sm text-gray-600">Total Subscribers</div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Notification status:</span>
                          <Badge variant="secondary">All notified</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subscription management:</span>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            <Bell className="h-3 w-3 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status History */}
              {instanceData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Status History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockStatusHistory.map((entry, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1 text-sm">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(entry.status)}
                              <span className="text-gray-500">
                                {new Date(entry.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-gray-600 mt-1">{entry.note}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      Edit Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Add Exception
                    </Button>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                    <Button variant="outline" size="sm">
                      Notify Subscribers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t bg-gray-50">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}