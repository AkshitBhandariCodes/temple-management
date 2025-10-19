import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  List, 
  Kanban, 
  Plus, 
  Upload, 
  Download 
} from 'lucide-react';
import { ViewMode } from './types';

interface EventsHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateEvent: () => void;
}

export const EventsHeader: React.FC<EventsHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onCreateEvent
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Events & Tasks</h1>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('calendar')}
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="flex items-center space-x-2"
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('kanban')}
              className="flex items-center space-x-2"
            >
              <Kanban className="h-4 w-4" />
              <span>Kanban</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import Events</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Calendar</span>
          </Button>
          
          <Button
            onClick={onCreateEvent}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
        </div>
      </div>
    </div>
  );
};