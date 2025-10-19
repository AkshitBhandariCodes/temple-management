import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Send, FileText, Megaphone } from 'lucide-react';
import DashboardTab from './DashboardTab';
import BroadcastsTab from './BroadcastsTab';
import BrochuresTab from './BrochuresTab';
import AnnouncementsTab from './AnnouncementsTab';
import TemplatesTab from './TemplatesTab';
import MessageHistoryTab from './MessageHistoryTab';

const CommunicationsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communications Management</h1>
          <p className="text-gray-600 mt-1">Centralized communication hub for temple stakeholders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Create Brochure
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            New Announcement
          </Button>
          <Button className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Broadcast
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          <TabsTrigger value="brochures">Brochures</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Message History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="broadcasts" className="mt-6">
          <BroadcastsTab />
        </TabsContent>

        <TabsContent value="brochures" className="mt-6">
          <BrochuresTab />
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <AnnouncementsTab />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <MessageHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationsManagement;