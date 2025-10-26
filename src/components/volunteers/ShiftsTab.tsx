import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Filter,
  Grid3X3,
  List,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../utils/supabaseClient";

export const ShiftsTab = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchShifts() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("shifts")
        .select("*")
        .order("shift_date", { ascending: true });

      if (fetchError) {
        console.error("Error fetching shifts:", fetchError);
        setError(fetchError.message);
      } else {
        setShifts(data || []);
      }
    } catch (err: any) {
      console.error("Network error:", err);
      setError("Failed to fetch shifts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchShifts();

    const channel = supabase
      .channel("shifts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shifts" },
        () => {
          console.log("Shifts data changed, refetching...");
          fetchShifts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredShifts = shifts.filter(shift => {
    const matchesStatus = statusFilter === "all" || shift.status === statusFilter;
    const matchesLocation = locationFilter === "all" || shift.location?.toLowerCase().includes(locationFilter.toLowerCase());
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg font-medium text-red-600">Connection Error</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchShifts}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                <CreateShiftModal onClose={() => setIsCreateModalOpen(false)} onRefresh={fetchShifts} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

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
                  <TableHead>Status</TableHead>
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
                            <span>{shift.shift_date ? format(new Date(shift.shift_date), "MMM dd, yyyy") : 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{shift.start_time} - {shift.end_time}</span>
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
                          <span className="font-medium">{shift.required_volunteers || 0}</span> volunteers needed
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {shift.assigned_volunteers?.length || 0} assigned
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(shift.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={async () => {
                            if (confirm('Delete this shift?')) {
                              await supabase.from('shifts').delete().eq('id', shift.id);
                              fetchShifts();
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredShifts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No shifts found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-temple-saffron/50" />
              <p className="text-lg mb-2">Calendar View</p>
              <p>Interactive calendar coming soon.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CreateShiftModal = ({ onClose, onRefresh }: { onClose: () => void; onRefresh: () => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [requiredVolunteers, setRequiredVolunteers] = useState(1);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title || !selectedDate || !startTime || !endTime || !location) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("shifts").insert({
        title,
        shift_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: startTime,
        end_time: endTime,
        location,
        required_volunteers: requiredVolunteers,
        description,
        status: "open",
        assigned_volunteers: []
      });

      if (insertError) {
        console.error("Error creating shift:", insertError);
        setError(insertError.message);
        alert(`Failed: ${insertError.message}`);
      } else {
        onRefresh();
        onClose();
      }
    } catch (err: any) {
      console.error("Network error:", err);
      setError("Network connection failed");
      alert("Failed to create shift: Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Shift Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Morning Prayer Service" />
        </div>
        <div className="space-y-2">
          <Label>Location *</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Main Temple" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Date *</Label>
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
          <Label>Start Time *</Label>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>End Time *</Label>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Volunteers Needed</Label>
        <Input
          type="number"
          value={requiredVolunteers}
          onChange={(e) => setRequiredVolunteers(parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Create Shift
        </Button>
      </div>
    </div>
  );
};
