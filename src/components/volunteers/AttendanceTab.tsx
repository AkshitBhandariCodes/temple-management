import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Download,
  Send,
  Eye,
  Edit3
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";

export const AttendanceTab = () => {
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [selectedShift, setSelectedShift] = useState<any>(null);

  // Mock attendance data
  const attendanceData = [
    {
      volunteerId: 1,
      volunteerName: "Priya Sharma",
      volunteerAvatar: "/placeholder.svg",
      shifts: [
        { date: "2024-01-15", shiftTitle: "Morning Aarti", status: "present", checkIn: "06:00", checkOut: "08:00", notes: "" },
        { date: "2024-01-14", shiftTitle: "Evening Service", status: "present", checkIn: "18:00", checkOut: "20:00", notes: "" },
        { date: "2024-01-13", shiftTitle: "Kitchen Duty", status: "late", checkIn: "10:15", checkOut: "14:00", notes: "Traffic delay" },
        { date: "2024-01-12", shiftTitle: "Event Setup", status: "absent", checkIn: "", checkOut: "", notes: "Family emergency" },
      ]
    },
    {
      volunteerId: 2,
      volunteerName: "Raj Patel",
      volunteerAvatar: "/placeholder.svg",
      shifts: [
        { date: "2024-01-15", shiftTitle: "Kitchen Duty", status: "present", checkIn: "10:00", checkOut: "14:00", notes: "" },
        { date: "2024-01-14", shiftTitle: "Kitchen Duty", status: "present", checkIn: "10:00", checkOut: "14:00", notes: "" },
        { date: "2024-01-13", shiftTitle: "Kitchen Duty", status: "present", checkIn: "10:00", checkOut: "14:00", notes: "" },
        { date: "2024-01-12", shiftTitle: "Kitchen Duty", status: "excused", checkIn: "", checkOut: "", notes: "Pre-approved leave" },
      ]
    },
    {
      volunteerId: 3,
      volunteerName: "Meera Singh",
      volunteerAvatar: "/placeholder.svg",
      shifts: [
        { date: "2024-01-15", shiftTitle: "Youth Program", status: "present", checkIn: "15:00", checkOut: "18:00", notes: "" },
        { date: "2024-01-14", shiftTitle: "Event Coordination", status: "present", checkIn: "16:00", checkOut: "20:00", notes: "" },
        { date: "2024-01-13", shiftTitle: "Youth Program", status: "absent", checkIn: "", checkOut: "", notes: "Sick" },
        { date: "2024-01-12", shiftTitle: "Youth Program", status: "present", checkIn: "15:00", checkOut: "18:00", notes: "" },
      ]
    }
  ];

  // Mock shift details for attendance management
  const shiftDetails = [
    {
      id: 1,
      title: "Morning Aarti Assistant",
      date: "2024-01-16",
      time: "06:00 - 08:00",
      location: "Main Temple",
      expectedVolunteers: [
        { id: 1, name: "Priya Sharma", avatar: "/placeholder.svg", status: "present", checkIn: "05:55", checkOut: "08:05" },
        { id: 2, name: "Raj Patel", avatar: "/placeholder.svg", status: "present", checkIn: "06:00", checkOut: "08:00" },
        { id: 3, name: "Meera Singh", avatar: "/placeholder.svg", status: "late", checkIn: "06:15", checkOut: "08:00" },
      ],
      attendanceRate: 100,
      onTimeRate: 67
    },
    {
      id: 2,
      title: "Kitchen Prasadam Preparation",
      date: "2024-01-16",
      time: "10:00 - 14:00",
      location: "Temple Kitchen",
      expectedVolunteers: [
        { id: 4, name: "Arjun Kumar", avatar: "/placeholder.svg", status: "present", checkIn: "10:00", checkOut: "14:00" },
        { id: 5, name: "Lakshmi Devi", avatar: "/placeholder.svg", status: "absent", checkIn: "", checkOut: "" },
        { id: 6, name: "Ravi Shankar", avatar: "/placeholder.svg", status: "present", checkIn: "10:05", checkOut: "14:00" },
      ],
      attendanceRate: 67,
      onTimeRate: 50
    }
  ];

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "late":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "excused":
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case "excused":
        return <Badge className="bg-blue-100 text-blue-800">Excused</Badge>;
      default:
        return <Badge variant="secondary">Not Marked</Badge>;
    }
  };

  const calculateAttendanceRate = (shifts: any[]) => {
    const presentShifts = shifts.filter(shift => shift.status === "present" || shift.status === "late").length;
    return Math.round((presentShifts / shifts.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Date Selection and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Attendance Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4 mr-2" />
                Send Reminders
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateRange.from ? (
                      selectedDateRange.to ? (
                        <>
                          {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                          {format(selectedDateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(selectedDateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={selectedDateRange.from}
                    selected={selectedDateRange}
                    onSelect={(range) => range && setSelectedDateRange(range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Quick Presets</Label>
              <Select onValueChange={(value) => {
                const today = new Date();
                switch (value) {
                  case "today":
                    setSelectedDateRange({ from: today, to: today });
                    break;
                  case "week":
                    setSelectedDateRange({ from: subDays(today, 7), to: today });
                    break;
                  case "month":
                    setSelectedDateRange({ from: subDays(today, 30), to: today });
                    break;
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Quick select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Shift Filter</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All shifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning Shifts</SelectItem>
                  <SelectItem value="evening">Evening Shifts</SelectItem>
                  <SelectItem value="kitchen">Kitchen Duties</SelectItem>
                  <SelectItem value="events">Event Shifts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div></div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Attendance Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Volunteer</TableHead>
                  <TableHead className="text-center">Jan 12</TableHead>
                  <TableHead className="text-center">Jan 13</TableHead>
                  <TableHead className="text-center">Jan 14</TableHead>
                  <TableHead className="text-center">Jan 15</TableHead>
                  <TableHead className="text-center">Attendance Rate</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((volunteer) => (
                  <TableRow key={volunteer.volunteerId}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={volunteer.volunteerAvatar} />
                          <AvatarFallback>
                            {volunteer.volunteerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{volunteer.volunteerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {volunteer.shifts.length} shifts assigned
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {volunteer.shifts.map((shift, index) => (
                      <TableCell key={index} className="text-center">
                        <div className="flex flex-col items-center space-y-1">
                          {getAttendanceIcon(shift.status)}
                          <div className="text-xs text-muted-foreground">
                            {shift.shiftTitle}
                          </div>
                          {shift.checkIn && (
                            <div className="text-xs text-muted-foreground">
                              {shift.checkIn} - {shift.checkOut}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="font-semibold text-lg">
                          {calculateAttendanceRate(volunteer.shifts)}%
                        </span>
                        <Badge 
                          variant={calculateAttendanceRate(volunteer.shifts) >= 90 ? "default" : "secondary"}
                          className={calculateAttendanceRate(volunteer.shifts) >= 90 ? "bg-green-100 text-green-800" : ""}
                        >
                          {calculateAttendanceRate(volunteer.shifts) >= 90 ? "Excellent" : "Good"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Shift Attendance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Shift Attendance</span>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Generate Certificates
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shiftDetails.map((shift) => (
              <div key={shift.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{shift.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{shift.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{shift.time}</span>
                      </div>
                      <span>{shift.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Attendance Rate</div>
                    <div className="text-2xl font-bold text-green-600">{shift.attendanceRate}%</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {shift.expectedVolunteers.map((volunteer) => (
                    <div key={volunteer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={volunteer.avatar} />
                          <AvatarFallback>
                            {volunteer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{volunteer.name}</p>
                          {volunteer.checkIn && volunteer.checkOut && (
                            <p className="text-sm text-muted-foreground">
                              {volunteer.checkIn} - {volunteer.checkOut}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getAttendanceBadge(volunteer.status)}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Attendance</DialogTitle>
                            </DialogHeader>
                            <AttendanceUpdateModal volunteer={volunteer} shift={shift} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Attendance Update Modal Component
const AttendanceUpdateModal = ({ volunteer, shift }: { volunteer: any; shift: any }) => {
  const [status, setStatus] = useState(volunteer.status);
  const [checkIn, setCheckIn] = useState(volunteer.checkIn);
  const [checkOut, setCheckOut] = useState(volunteer.checkOut);
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={volunteer.avatar} />
          <AvatarFallback>
            {volunteer.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{volunteer.name}</p>
          <p className="text-sm text-muted-foreground">{shift.title}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Attendance Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="excused">Excused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(status === "present" || status === "late") && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check-in Time</Label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Label>Check-out Time</Label>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about attendance..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-temple-saffron hover:bg-temple-saffron/90">
          Update Attendance
        </Button>
      </div>
    </div>
  );
};