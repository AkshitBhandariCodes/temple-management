import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Send, FileText, Megaphone } from 'lucide-react';
import DashboardTab from './DashboardTab';
import BroadcastsTab from './BroadcastsTab-new';
import BrochuresTab from './BrochuresTab';
import AnnouncementsTab from './AnnouncementsTab';
import TemplatesTab from './TemplatesTab';
import MessageHistoryTab from './MessageHistoryTab';

const CommunicationsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const broadcastsTabRef = useRef<any>(null);
  const brochuresTabRef = useRef<any>(null);
  const announcementsTabRef = useRef<any>(null);

  const handleCreateBrochure = () => {
    setActiveTab('brochures');
    setTimeout(() => {
      if (brochuresTabRef.current?.openCreateModal) {
        brochuresTabRef.current.openCreateModal();
      }
    }, 100);
  };

  const handleNewAnnouncement = () => {
    setActiveTab('announcements');
    setTimeout(() => {
      if (announcementsTabRef.current?.openCreateModal) {
        announcementsTabRef.current.openCreateModal();
      }
    }, 100);
  };

  const handleSendBroadcast = () => {
    setActiveTab('broadcasts');
    setTimeout(() => {
      if (broadcastsTabRef.current?.openCreateModal) {
        broadcastsTabRef.current.openCreateModal();
      }
    }, 100);
  };

  return (
    // ✅ Clean padding: p-6 (24px) on desktop, p-4 (16px) on mobile
    <div className="w-full min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Content Container with max-width */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Communications Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Centralized communication hub for temple stakeholders
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleCreateBrochure}
              >
                <FileText className="h-4 w-4" />
                Create Brochure
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleNewAnnouncement}
              >
                <Megaphone className="h-4 w-4" />
                New Announcement
              </Button>
              
              <Button
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                onClick={handleSendBroadcast}
              >
                <Send className="h-4 w-4" />
                Send Broadcast
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 h-auto bg-transparent p-0">
              <TabsTrigger
                value="dashboard"
                className="py-3 sm:py-4 text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="broadcasts"
                className="py-3 sm:py-4 text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Broadcasts
              </TabsTrigger>
              <TabsTrigger
                value="brochures"
                className="py-3 sm:py-4 text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Brochures
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                className="py-3 sm:py-4 text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Announcements
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="py-3 sm:py-4 text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Templates
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="py-3 sm:py-4 text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                <span className="hidden sm:inline">Message History</span>
                <span className="sm:hidden">History</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="mt-6">
            <TabsContent value="dashboard" className="mt-0">
              <DashboardTab />
            </TabsContent>

            <TabsContent value="broadcasts" className="mt-0">
              <BroadcastsTab ref={broadcastsTabRef} />
            </TabsContent>

            <TabsContent value="brochures" className="mt-0">
              <BrochuresTab ref={brochuresTabRef} />
            </TabsContent>

            <TabsContent value="announcements" className="mt-0">
              <AnnouncementsTab ref={announcementsTabRef} />
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <TemplatesTab />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <MessageHistoryTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunicationsManagement;
