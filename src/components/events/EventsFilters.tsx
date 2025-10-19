import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { EventFilters } from './types';

interface EventsFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

const mockCommunities = [
  { id: 'comm-1', name: 'Main Temple' },
  { id: 'comm-2', name: 'Youth Group' },
  { id: 'comm-3', name: 'Senior Citizens' },
  { id: 'comm-4', name: 'Cultural Committee' }
];

export const EventsFilters: React.FC<EventsFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const updateFilter = (key: keyof EventFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      dateRange: {},
      communityId: undefined,
      status: undefined,
      eventType: undefined
    });
  };

  const hasActiveFilters = filters.search || 
    filters.dateRange.from || 
    filters.dateRange.to || 
    filters.communityId || 
    filters.status || 
    filters.eventType;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events by title, description, location..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {filters.dateRange.from 
                    ? format(filters.dateRange.from, 'MMM dd') 
                    : 'From'
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.from}
                onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {filters.dateRange.to 
                    ? format(filters.dateRange.to, 'MMM dd') 
                    : 'To'
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.to}
                onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Community Filter */}
        <Select 
          value={filters.communityId || 'all'} 
          onValueChange={(value) => updateFilter('communityId', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Communities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Communities</SelectItem>
            {mockCommunities.map(community => (
              <SelectItem key={community.id} value={community.id}>
                {community.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select 
          value={filters.status || 'all'} 
          onValueChange={(value) => updateFilter('status', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Event Type Filter */}
        <Select 
          value={filters.eventType || 'all'} 
          onValueChange={(value) => updateFilter('eventType', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="one-time">One-time</SelectItem>
            <SelectItem value="recurring">Recurring</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>
    </div>
  );
};