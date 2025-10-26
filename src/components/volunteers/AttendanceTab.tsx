import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../utils/supabaseClient";

export const AttendanceTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedShift, setSelectedShift] = useState<string>("all");
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchShifts() {
    const { data, error } = await supabase
      .from("shifts")
      .select("*")
      .order("shift_date", { ascending: false });

    if (!error) setShifts(data || []);
  }

  async function fetchAttendance() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("shift_attendance")
        .select(`
          *,
          shifts (
            id,
            title,
            shift_date,
            start_time,
            end_time,
            location
          ),
          volunteers (
            id,
            full_name,
            email,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching attendance:", fetchError);
        setError(fetchError.message);
      } else {
        setAttendanceRecords(data || []);
      }
    } catch (err: any) {
      console.error("Network error:", err);
      setError("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchShifts();
    fetchAttendance();

    const channel = supabase
      .channel("attendance-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shift_attendance" },
        () => {
          console.log("Attendance data changed, refetching...");
          fetchAttendance();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesShift = selectedShift === "all" || record.shift_id === selectedShift;
    const matchesDate = selectedDate 
      ? format(new Date(record.shifts?.shift_date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      : true;
    return matchesShift && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Present</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Late</Badge>;
      case "excused":
        return <Badge className="bg-blue-100 text-blue-800"><Info className="w-3 h-3 mr-1" />Excused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    const headers = ["Volunteer Name", "Email", "Shift", "Date", "Status", "Check In", "Check Out", "Notes"];
    const rows = filteredRecords.map(record => [
      record.volunteers?.full_name || "N/A",
      record.volunteers?.email || "N/A",
      record.shifts?.title || "N/A",
      record.shifts?.shift_date ? format(new Date(record.shifts.shift_date), "yyyy-MM-dd") : "N/A",
      record.status || "N/A",
      record.check_in_time || "N/A",
      record.check_out_time || "N/A",
      record.notes || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  const markAttendance = async (recordId: string, status: string) => {
    const { error } = await supabase
      .from("shift_attendance")
      .update({ 
        status, 
        marked_at: new Date().toISOString(),
        check_in_time: status === "present" || status === "late" ? format(new Date(), "HH:mm:ss") : null
      })
      .eq("id", recordId);

    if (!error) {
      fetchAttendance();
    } else {
      alert("Failed to mark attendance");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Attendance Tracking</span>
            <Button onClick={exportToCSV} disabled={filteredRecords.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={shift.id}>
                    {shift.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Volunteer</TableHead>
                <TableHead>Shift Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {record.volunteers?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'V'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{record.volunteers?.full_name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{record.volunteers?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{record.shifts?.title || 'N/A'}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{record.shifts?.shift_date ? format(new Date(record.shifts.shift_date), "MMM dd, yyyy") : 'N/A'}</span>
                        <Clock className="w-3 h-3" />
                        <span>{record.shifts?.start_time} - {record.shifts?.end_time}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {record.check_in_time && (
                        <p>In: {record.check_in_time}</p>
                      )}
                      {record.check_out_time && (
                        <p>Out: {record.check_out_time}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAttendance(record.id, "present")}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAttendance(record.id, "absent")}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
