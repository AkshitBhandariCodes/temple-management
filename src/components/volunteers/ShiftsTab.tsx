import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  Edit,
  Copy,
  Trash2,
  UserPlus,
  Filter,
  Grid3X3,
  List,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export const ShiftsTab = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock shifts data
  const shifts = [
    {
      id: 1,
      title: "Morning Aarti Assistant",
      date: "2024-01-16",
      startTime: "06:00",
      endTime: "08:00",
      duration: "2 hours",
      location: "Main Temple",
      requiredVolunteers: 3,
      assignedVolunteers: [
        { id: 1, name: "Priya Sharma", avatar: "/placeholder.svg", status: "confirmed" },
        { id: 2, name: "Raj Patel", avatar: "/placeholder.svg", status: "confirmed" },
        { id: 3, name: "Meera Singh", avatar: "/placeholder.svg", status: "pending" }
      ],
      waitlist: [],
      status: "filled",
      requiredSkills: ["Temple Services", "Sanskrit"],
      experienceLevel: "Intermediate",
      eventAssociation: "Daily Worship",
      coordinator: "Pandit Sharma",
      specialInstructions: "Please arrive 15 minutes early for briefing"
    },
    {
      id: 2,
      title: "Kitchen Prasadam Preparation",
      date: "2024-01-16",
      startTime: "10:00",
      endTime: "14:00",
      duration: "4 hours",
      location: "Temple Kitchen",
      requiredVolunteers: 5,
      assignedVolunteers: [
        { id: 4, name: "Arjun Kumar", avatar: "/placeholder.svg", status: "confirmed" },
        { id: 5, name: "Lakshmi Devi", avatar: "/placeholder.svg", status: "confirmed" }
      ],
      waitlist: [
        { id: 6, name: "Ravi Shankar", avatar: "/placeholder.svg" }
      ],
      status: "partially-filled",
      requiredSkills: ["Kitchen Management", "Food Safety"],
      experienceLevel: "Beginner",
      eventAssociation: "Daily Prasadam",
      coordinator: "Chef Ramesh",
      specialInstructions: "Food safety certification required"
    },
    {
      id: 3,
      title: "Evening Event Setup",
      date: "2024-01-17",
      startTime: "16:00",
      endTime: "20:00",
      duration: "4 hours",
      location: "Community Hall",
      requiredVolunteers: 8,
      assignedVolunteers: [],
      waitlist: [],
      status: "open",
      requiredSkills: ["Event Management", "Setup"],
      experienceLevel: "Beginner",
      eventAssociation: "Bhajan Evening",
      coordinator: "Sita Devi",
      specialInstructions: "Heavy lifting may be required"
    },
    {
      id: 4,
      title: "Youth Program Coordination",
      date: "2024-01-18",
      startTime: "15:00",
      endTime: "18:00",
      duration: "3 hours",
      location: "Youth Center",
      requiredVolunteers: 2,
      assignedVolunteers: [
        { id: 7, name: "Anita Gupta", avatar: "/placeholder.svg", status: "confirmed" },
        { id: 8, name: "Vikram Singh", avatar: "/placeholder.svg", status: "confirmed" }
      ],
      waitlist: [],
      status: "filled",
      requiredSkills: ["Youth Programs", "Teaching"],
      experienceLevel: "Advanced",
      eventAssociation: "Weekly Youth Class",
      coordinator: "Teacher Priya",
      specialInstructions: "Experience with children required"
    }
  ];

  const filteredShifts = shifts.filter(shift => {
    const matchesStatus = statusFilter === "all" || shift.status === statusFilter;
    const matchesLocation = locationFilter === "all" || shift.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesStatus && matchesLocation;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "filled":
        return <Badge className="bg-green-100 text-green-800">Filled</Badge>;
      case "partially-filled":
        return <Badge className="bg-yellow-100 text-yellow-800">Partially Filled</Badge>;
      case "open":
        return <Badge className="bg-red-100 text-red-800">Open</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Filter Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Shift Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="partially-filled">Partially Filled</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="main temple">Main Temple</SelectItem>
                <SelectItem value="kitchen">Temple Kitchen</SelectItem>
                <SelectItem value="community hall">Community Hall</SelectItem>
                <SelectItem value="youth center">Youth Center</SelectItem>
              </SelectContent>
            </Select>
            <div></div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-temple-saffron hover:bg-temple-saffron/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Shift
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Shift</DialogTitle>
                </DialogHeader>
                <CreateShiftModal onClose={() => setIsCreateModalOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Shifts Display */}
      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>Shifts ({filteredShifts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift Details</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Assignments</TableHead>
                  <TableHead>Event Association</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(shift.status)}
                          <p className="font-medium">{shift.title}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{shift.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{shift.startTime} - {shift.endTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{shift.location}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">{shift.requiredVolunteers}</span> volunteers needed
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {shift.requiredSkills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {shift.experienceLevel} level
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex -space-x-2">
                          {shift.assignedVolunteers.map((volunteer, index) => (
                            <Avatar key={index} className="w-6 h-6 border-2 border-white">
                              <AvatarImage src={volunteer.avatar} />
                              <AvatarFallback className="text-xs">
                                {volunteer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {shift.assignedVolunteers.length === 0 && (
                            <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <Users className="w-3 h-3 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{shift.assignedVolunteers.length}</span>/{shift.requiredVolunteers} assigned
                        </div>
                        {shift.waitlist.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {shift.waitlist.length} on waitlist
                          </div>
                        )}
                        {getStatusBadge(shift.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{shift.eventAssociation}</p>
                        <p className="text-xs text-muted-foreground">
                          Coordinator: {shift.coordinator}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <UserPlus className="w-4 h-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedShift(shift)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Shift</DialogTitle>
                            </DialogHeader>
                            {selectedShift && <EditShiftModal shift={selectedShift} />}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {/* Calendar implementation would go here */}
              <div className="col-span-7 text-center py-12 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-temple-saffron/50" />
                <p className="text-lg mb-2">Calendar View</p>
                <p>Interactive calendar with drag-and-drop shift scheduling coming soon.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Create Shift Modal Component
const CreateShiftModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="assignment">Assignment</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Shift Title</Label>
            <Input id="title" placeholder="Enter shift title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main-temple">Main Temple</SelectItem>
                <SelectItem value="kitchen">Temple Kitchen</SelectItem>
                <SelectItem value="community-hall">Community Hall</SelectItem>
                <SelectItem value="youth-center">Youth Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input id="start-time" type="time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input id="end-time" type="time" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="volunteers-needed">Volunteers Needed</Label>
            <Input id="volunteers-needed" type="number" placeholder="Number of volunteers" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience-level">Experience Level</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Shift description and requirements" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="special-instructions">Special Instructions</Label>
          <Textarea id="special-instructions" placeholder="Any special instructions for volunteers" />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-temple-saffron hover:bg-temple-saffron/90">Create Shift</Button>
        </div>
      </TabsContent>

      <TabsContent value="assignment" className="space-y-4">
        <div className="text-center py-8 text-muted-foreground">
          <UserPlus className="w-12 h-12 mx-auto mb-4 text-temple-saffron/50" />
          <p>Volunteer assignment will be available after creating the shift.</p>
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="notify-assigned" className="rounded" />
            <Label htmlFor="notify-assigned">Notify assigned volunteers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="send-reminders" className="rounded" />
            <Label htmlFor="send-reminders">Send shift reminders</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Textarea id="custom-message" placeholder="Additional message for volunteers" />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Edit Shift Modal Component
const EditShiftModal = ({ shift }: { shift: any }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-title">Shift Title</Label>
          <Input id="edit-title" defaultValue={shift.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-location">Location</Label>
          <Input id="edit-location" defaultValue={shift.location} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-date">Date</Label>
          <Input id="edit-date" type="date" defaultValue={shift.date} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-start">Start Time</Label>
          <Input id="edit-start" type="time" defaultValue={shift.startTime} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-end">End Time</Label>
          <Input id="edit-end" type="time" defaultValue={shift.endTime} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Assigned Volunteers</Label>
        <div className="space-y-2">
          {shift.assignedVolunteers.map((volunteer: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={volunteer.avatar} />
                  <AvatarFallback>{volunteer.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span>{volunteer.name}</span>
                <Badge variant={volunteer.status === 'confirmed' ? 'default' : 'secondary'}>
                  {volunteer.status}
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-temple-saffron hover:bg-temple-saffron/90">Save Changes</Button>
      </div>
    </div>
  );
};