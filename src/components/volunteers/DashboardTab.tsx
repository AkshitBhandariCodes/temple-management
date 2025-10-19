import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Calendar, 
  UserCheck, 
  FileText, 
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const DashboardTab = () => {
  // Mock data for charts
  const engagementData = [
    { name: 'Jan', volunteers: 120, hours: 480 },
    { name: 'Feb', volunteers: 135, hours: 520 },
    { name: 'Mar', volunteers: 142, hours: 580 },
    { name: 'Apr', volunteers: 156, hours: 620 },
    { name: 'May', volunteers: 148, hours: 590 },
    { name: 'Jun', volunteers: 162, hours: 650 },
  ];

  const shiftDistributionData = [
    { name: 'Temple Services', value: 35, color: '#D4AF37' },
    { name: 'Events', value: 25, color: '#FF6B35' },
    { name: 'Kitchen', value: 20, color: '#8B4513' },
    { name: 'Maintenance', value: 12, color: '#4A90E2' },
    { name: 'Administration', value: 8, color: '#7B68EE' },
  ];

  // Mock upcoming shifts data
  const upcomingShifts = [
    {
      id: 1,
      time: "9:00 AM - 12:00 PM",
      location: "Main Temple",
      role: "Aarti Assistant",
      volunteers: [
        { name: "Priya Sharma", avatar: "/placeholder.svg", status: "confirmed" },
        { name: "Raj Patel", avatar: "/placeholder.svg", status: "confirmed" },
      ],
      status: "filled"
    },
    {
      id: 2,
      time: "2:00 PM - 6:00 PM",
      location: "Community Hall",
      role: "Event Coordinator",
      volunteers: [
        { name: "Meera Singh", avatar: "/placeholder.svg", status: "confirmed" },
      ],
      status: "partially-filled"
    },
    {
      id: 3,
      time: "6:00 PM - 9:00 PM",
      location: "Kitchen",
      role: "Prasadam Preparation",
      volunteers: [],
      status: "open"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "filled":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "partially-filled":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "open":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filled":
        return "bg-green-100 text-green-800";
      case "partially-filled":
        return "bg-yellow-100 text-yellow-800";
      case "open":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-temple-gold" />
                <span className="text-lg">Volunteer Overview</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Active</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">New This Month</span>
                <span className="font-semibold text-green-600">+12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Retention Rate</span>
                <span className="font-semibold">94%</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View All Volunteers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-temple-saffron" />
                <span className="text-lg">Shift Management</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Filled</span>
                <span className="font-semibold text-green-600">38</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fulfillment Rate</span>
                <span className="font-semibold">90%</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Manage Shifts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-temple-maroon" />
                <span className="text-lg">Attendance Tracking</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Today's Rate</span>
                <span className="font-semibold">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Weekly Average</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">No-show Rate</span>
                <span className="font-semibold text-red-600">3%</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Attendance
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-lg">Applications</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-semibold">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Approval Rate</span>
                <span className="font-semibold text-green-600">87%</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Review Applications
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-temple-saffron" />
              <span>Volunteer Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="volunteers" 
                    stroke="#D4AF37" 
                    strokeWidth={2}
                    name="Active Volunteers"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#FF6B35" 
                    strokeWidth={2}
                    name="Total Hours"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-temple-maroon" />
              <span>Shift Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shiftDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {shiftDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Shifts Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-temple-gold" />
              <span>Today's Shifts</span>
            </div>
            <Button variant="outline" size="sm">
              View All Shifts
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingShifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(shift.status)}
                    <Badge className={getStatusColor(shift.status)}>
                      {shift.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{shift.time}</span>
                      <MapPin className="w-4 h-4 ml-2" />
                      <span>{shift.location}</span>
                    </div>
                    <p className="font-medium">{shift.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {shift.volunteers.map((volunteer, index) => (
                      <Avatar key={index} className="w-8 h-8 border-2 border-white">
                        <AvatarImage src={volunteer.avatar} />
                        <AvatarFallback>{volunteer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    ))}
                    {shift.volunteers.length === 0 && (
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    {shift.status === 'open' ? 'Assign' : 'Manage'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};