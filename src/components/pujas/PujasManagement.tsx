import React, { useState, useEffect } from 'react';
import { Calendar, List, Clock, Plus, Upload, Download, Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CalendarView from './CalendarView';
import ListView from './ListView';
import ScheduleView from './ScheduleView';
import CreatePujaSeriesModal from './CreatePujaSeriesModal';
import ExceptionManagementModal from './ExceptionManagementModal';
import PujaInstanceModal from './PujaInstanceModal';
import StatusUpdateModal from './StatusUpdateModal';
import { usePujaSeries } from '@/hooks/use-complete-api';

const PujasManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPuja, setSelectedPuja] = useState<any>(null);
  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);

  // Fetch real puja series data
  const { data: pujaSeriesData, isLoading, error } = usePujaSeries({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 1000
  });

  const pujaSeries = pujaSeriesData?.data || [];

  const filteredSeries = pujaSeries.filter(series =>
    series.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    series.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">Failed to load puja series</div>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Puja Management</h2>
          <p className="text-muted-foreground">Manage puja schedules and series</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Puja Series
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search puja series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card text-card-foreground rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Series</p>
              <p className="text-2xl font-bold">{pujaSeries.length}</p>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{pujaSeries.filter(s => s.status === 'active').length}</p>
            </div>
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
              <p className="text-2xl font-bold">45m</p>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Schedule View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {filteredSeries.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No puja series found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? "Try adjusting your filters"
                    : "No puja series have been created yet"}
                </p>
                <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Puja Series
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSeries.map((series) => (
                <div key={series.id} className="bg-card text-card-foreground rounded-lg border p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{series.name}</h3>
                        <Badge className={getStatusBadge(series.status)}>
                          {series.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{series.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Location: {series.schedule_config?.location || 'Not specified'}</span>
                        <span>Deity: {series.deity || 'Not specified'}</span>
                        <span>Type: {series.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView pujaSeries={filteredSeries} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <ScheduleView pujaSeries={filteredSeries} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showCreateModal && (
        <CreatePujaSeriesModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedPuja && (
        <>
          <PujaInstanceModal
            isOpen={showInstanceModal}
            onClose={() => setShowInstanceModal(false)}
            pujaSeries={selectedPuja}
          />
          <StatusUpdateModal
            isOpen={showStatusModal}
            onClose={() => setShowStatusModal(false)}
            pujaSeries={selectedPuja}
          />
          <ExceptionManagementModal
            isOpen={showExceptionModal}
            onClose={() => setShowExceptionModal(false)}
            pujaSeries={selectedPuja}
          />
        </>
      )}
    </div>
  );
};

export default PujasManagement;
