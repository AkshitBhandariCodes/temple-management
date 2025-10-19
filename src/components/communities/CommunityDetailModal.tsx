import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Community } from "./types";
import { CommunityOverview } from "./tabs/CommunityOverview";
import { CommunityMembers } from "./tabs/CommunityMembers";
import { CommunityCalendar } from "./tabs/CommunityCalendar";
import { CommunityTasks } from "./tabs/CommunityTasks";
import { CommunityKanban } from "./tabs/CommunityKanban";
import { CommunityReports } from "./tabs/CommunityReports";
import { CommunityTimeline } from "./tabs/CommunityTimeline";

interface CommunityDetailModalProps {
  community: Community;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (community: Community) => void;
}

export const CommunityDetailModal = ({ 
  community, 
  isOpen, 
  onClose, 
  onUpdate 
}: CommunityDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{community.name}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-7 flex-shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="overview" className="mt-4">
                <CommunityOverview community={community} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="members" className="mt-4">
                <CommunityMembers community={community} />
              </TabsContent>

              <TabsContent value="calendar" className="mt-4">
                <CommunityCalendar community={community} />
              </TabsContent>

              <TabsContent value="tasks" className="mt-4">
                <CommunityTasks community={community} />
              </TabsContent>

              <TabsContent value="kanban" className="mt-4">
                <CommunityKanban community={community} />
              </TabsContent>

              <TabsContent value="reports" className="mt-4">
                <CommunityReports community={community} />
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <CommunityTimeline community={community} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};