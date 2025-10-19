import React, { useState } from 'react';
import { Edit, Calendar, List, Copy, MoreHorizontal, Users, Clock, MapPin, User, Badge as BadgeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ListView({ pujaSeries, onEdit, onAddException, onViewInstances }) {
  const [viewMode, setViewMode] = useState('table'); // table or cards

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status] || variants.active}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatNextOccurrence = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriestInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const duplicateSeries = (series) => {
    console.log('Duplicating series:', series.title);
    // Handle duplication logic
  };

  const deleteSeries = (series) => {
    console.log('Deleting series:', series.title);
    // Handle deletion logic
  };

  if (viewMode === 'cards') {
    return (
      <div className="space-y-4">
        {/* View Toggle */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pujaSeries.map(series => (
            <Card key={series.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{series.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {series.description}
                    </p>
                  </div>
                  {getStatusBadge(series.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{series.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{series.startTime} • {series.duration} min</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BadgeIcon className="h-4 w-4 text-gray-400" />
                    <span>{series.recurrence}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getPriestInitials(series.priest)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{series.priest}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{series.subscribers} subscribers</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500 mb-2">
                    Next: {formatNextOccurrence(series.nextOccurrence)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(series)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewInstances(series)}>
                          <List className="h-4 w-4 mr-2" />
                          View Instances
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddException(series)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Add Exception
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateSeries(series)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Puja Details</TableHead>
              <TableHead>Schedule Information</TableHead>
              <TableHead>Priest & Management</TableHead>
              <TableHead>Status & Metrics</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pujaSeries.map(series => (
              <TableRow key={series.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{series.title}</div>
                    <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                      {series.description}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {series.location}
                    </div>
                    {getStatusBadge(series.status)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{series.recurrence}</div>
                    <div className="text-gray-600">
                      Next: {formatNextOccurrence(series.nextOccurrence)}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      {series.startTime} • {series.duration} min
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getPriestInitials(series.priest)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{series.priest}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>Created by: {series.createdBy}</div>
                      <div>Modified: {series.lastModified}</div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1 text-sm">
                    {getStatusBadge(series.status)}
                    <div className="text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {series.subscribers} subscribers
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>Instances this month: 30</div>
                      <div>Exceptions: 2</div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(series)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAddException(series)}
                      className="h-8 w-8 p-0"
                    >
                      <Calendar className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewInstances(series)}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-3 w-3" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => duplicateSeries(series)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Series
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteSeries(series)}
                          className="text-red-600"
                        >
                          Delete Series
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}