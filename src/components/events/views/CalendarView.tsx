import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Repeat,
  Users,
  MapPin,
  Clock
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Event } from '../types';

interface CalendarViewProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
  onEventUpdate: (event: Event) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
};

const communityColors = [
  'bg-purple-100 border-purple-300',
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-orange-100 border-orange-300',
  'bg-pink-100 border-pink-300'
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventSelect,
  onEventUpdate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const eventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.startDate, date));
  };

  const getCommunityColor = (communityId: string) => {
    const index = communityId.charCodeAt(communityId.length - 1) % communityColors.length;
    return communityColors[index];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewType === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewType('month')}
          >
            Month
          </Button>
          <Button
            variant={viewType === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewType('week')}
          >
            Week
          </Button>
          <Button
            variant={viewType === 'day' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewType('day')}
          >
            Day
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-6">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {calendarDays.map(day => {
            const dayEvents = eventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-32 bg-white p-2 
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${isToday ? 'bg-blue-50' : ''}
                `}
              >
                <div className={`
                  text-sm font-medium mb-2
                  ${isToday ? 'text-blue-600' : ''}
                `}>
                  {format(day, 'd')}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      onClick={() => onEventSelect(event)}
                      className={`
                        p-1 rounded text-xs cursor-pointer border-l-2
                        ${getCommunityColor(event.communityId)}
                        hover:shadow-sm transition-shadow
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate flex-1">
                          {event.title}
                        </span>
                        {event.isRecurring && (
                          <Repeat className="h-3 w-3 ml-1 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{format(event.startDate, 'HH:mm')}</span>
                      </div>
                    </div>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};