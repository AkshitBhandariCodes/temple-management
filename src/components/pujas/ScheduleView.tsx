import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Filter, Printer, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  'on-time': 'bg-green-100 text-green-800 border-green-200',
  delayed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function ScheduleView({ pujaInstances, onInstanceClick, onStatusUpdate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPriest, setSelectedPriest] = useState('');

  const navigateDate = (direction) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getPujaInstancesForTimeSlot = (timeSlot) => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    return pujaInstances.filter(instance => {
      const instanceDate = new Date(instance.date).toISOString().split('T')[0];
      const instanceTime = instance.startTime;
      
      const matchesDate = instanceDate === selectedDateStr;
      const matchesTime = instanceTime === timeSlot;
      const matchesLocation = !selectedLocation || instance.location === selectedLocation;
      const matchesPriest = !selectedPriest || instance.priest === selectedPriest;
      
      return matchesDate && matchesTime && matchesLocation && matchesPriest;
    });
  };

  const getAllLocations = () => {
    const locations = [...new Set(pujaInstances.map(instance => instance.location))];
    return locations;
  };

  const getAllPriests = () => {
    const priests = [...new Set(pujaInstances.map(instance => instance.priest))];
    return priests;
  };

  const printSchedule = () => {
    window.print();
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-4">
      {/* Schedule Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(-1)}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="min-w-[300px] text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {formatDate(selectedDate)}
              </h2>
              {isToday && (
                <Badge variant="secondary" className="mt-1">Today</Badge>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(1)}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {getAllLocations().map((location, index) => (
                <SelectItem key={`location-${index}`} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPriest} onValueChange={setSelectedPriest}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Priests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priests</SelectItem>
              {getAllPriests().map((priest, index) => (
                <SelectItem key={`priest-${index}`} value={priest}>{priest}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={printSchedule}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Time-based Schedule Grid */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="grid grid-cols-1 divide-y">
          {TIME_SLOTS.map(timeSlot => {
            const pujas = getPujaInstancesForTimeSlot(timeSlot);
            
            return (
              <div key={timeSlot} className="grid grid-cols-12 min-h-[80px]">
                {/* Time Column */}
                <div className="col-span-2 p-4 bg-gray-50 border-r flex items-center">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {formatTime(timeSlot)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {timeSlot}
                    </div>
                  </div>
                </div>

                {/* Pujas Column */}
                <div className="col-span-10 p-4">
                  {pujas.length === 0 ? (
                    <div className="text-gray-400 text-sm italic flex items-center h-full">
                      No pujas scheduled
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {pujas.map(puja => (
                        <Card
                          key={puja.id}
                          className={`cursor-pointer hover:shadow-md transition-all duration-200 ${STATUS_COLORS[puja.status]} border`}
                          onClick={() => onInstanceClick(puja)}
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm truncate flex-1">
                                  {puja.title}
                                </h4>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs ml-2"
                                >
                                  {puja.status}
                                </Badge>
                              </div>
                              
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{puja.duration} min</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{puja.location}</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span className="truncate">{puja.priest}</span>
                                </div>
                              </div>
                              
                              {/* Quick Status Update */}
                              <div className="flex gap-1 pt-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusUpdate(puja);
                                  }}
                                >
                                  Update Status
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Summary */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Daily Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {pujaInstances.filter(p => {
                const instanceDate = new Date(p.date).toISOString().split('T')[0];
                const selectedDateStr = selectedDate.toISOString().split('T')[0];
                return instanceDate === selectedDateStr;
              }).length}
            </div>
            <div className="text-gray-600">Total Pujas</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {pujaInstances.filter(p => {
                const instanceDate = new Date(p.date).toISOString().split('T')[0];
                const selectedDateStr = selectedDate.toISOString().split('T')[0];
                return instanceDate === selectedDateStr && p.status === 'completed';
              }).length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {pujaInstances.filter(p => {
                const instanceDate = new Date(p.date).toISOString().split('T')[0];
                const selectedDateStr = selectedDate.toISOString().split('T')[0];
                return instanceDate === selectedDateStr && p.status === 'delayed';
              }).length}
            </div>
            <div className="text-gray-600">Delayed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {pujaInstances.filter(p => {
                const instanceDate = new Date(p.date).toISOString().split('T')[0];
                const selectedDateStr = selectedDate.toISOString().split('T')[0];
                return instanceDate === selectedDateStr && p.status === 'cancelled';
              }).length}
            </div>
            <div className="text-gray-600">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
}