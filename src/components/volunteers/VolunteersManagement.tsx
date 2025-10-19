import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  UserCheck, 
  FileText, 
  MessageSquare, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { DashboardTab } from "./DashboardTab";
import { VolunteersTab } from "./VolunteersTab";
import { ShiftsTab } from "./ShiftsTab";
import { AttendanceTab } from "./AttendanceTab";
import { ApplicationsTab } from "./ApplicationsTab";
import { CommunicationsTab } from "./CommunicationsTab";

export const VolunteersManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data for quick stats
  const quickStats = {
    totalVolunteers: 156,
    pendingApplications: 8,
    todayShifts: 12,
    attendanceRate: 92
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteers Management</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive volunteer management system
          </p>
        </div>
        <Button className="bg-gradient-to-r from-temple-saffron to-temple-accent hover:from-temple-accent hover:to-temple-saffron text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Volunteer
        </Button>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-temple-gold/10 rounded-lg">
                <Users className="w-5 h-5 text-temple-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Active Volunteers</p>
                <p className="text-2xl font-bold text-temple-gold">{quickStats.totalVolunteers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-temple-saffron/10 rounded-lg">
                <FileText className="w-5 h-5 text-temple-saffron" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Applications</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-temple-saffron">{quickStats.pendingApplications}</p>
                  {quickStats.pendingApplications > 0 && (
                    <Badge variant="secondary" className="bg-temple-saffron/10 text-temple-saffron">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-temple-maroon/10 rounded-lg">
                <Calendar className="w-5 h-5 text-temple-maroon" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Shifts</p>
                <p className="text-2xl font-bold text-temple-maroon">{quickStats.todayShifts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week's Attendance</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-green-600">{quickStats.attendanceRate}%</p>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="volunteers" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Volunteers</span>
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Shifts</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Applications</span>
          </TabsTrigger>
          <TabsTrigger value="communications" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Communications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="volunteers">
          <VolunteersTab />
        </TabsContent>

        <TabsContent value="shifts">
          <ShiftsTab />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTab />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsTab />
        </TabsContent>

        <TabsContent value="communications">
          <CommunicationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};