import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Calendar as CalendarIcon, MapPin, Users, Trash2, Edit } from "lucide-react";
import { Community } from "../types";
import { 
  useCommunityEvents, 
  useCreateEvent, 
  useUpdateEvent, 
  useDeleteEvent 
} from "@/hooks/use-communities";
import { format } from "date-fns";

interface CommunityCalendarProps {
  community: Community;
}

export const CommunityCalendar = ({ community }: CommunityCalendarProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    event_type: "meeting",
    start_date: "",
    end_date: "",
    location: "",
    venue_type: "temple",
    meeting_link: "",
    max_attendees: ""
  });

  // ✅ API Hooks
  const { data: events, isLoading } = useCommunityEvents(community.id);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const handleCreateEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.start_date) return;

    await createEvent.mutateAsync({
      communityId: community.id,
      ...eventForm,
      max_attendees: eventForm.max_attendees ? parseInt(eventForm.max_attendees) : null
    });

    resetForm();
    setIsCreateOpen(false);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    await updateEvent.mutateAsync({
      communityId: community.id,
      eventId: editingEvent._id,
      ...eventForm,
      max_attendees: eventForm.max_attendees ? parseInt(eventForm.max_attendees) : null
    });

    resetForm();
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    await deleteEvent.mutateAsync({
      communityId: community.id,
      eventId
    });
  };

  const startEdit = (event: any) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || "",
      event_type: event.event_type,
      start_date: new Date(event.start_date).toISOString().slice(0, 16),
      end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
      location: event.location || "",
      venue_type: event.venue_type,
      meeting_link: event.meeting_link || "",
      max_attendees: event.max_attendees?.toString() || ""
    });
  };

  const resetForm = () => {
    setEventForm({
      title: "",
      description: "",
      event_type: "meeting",
      start_date: "",
      end_date: "",
      location: "",
      venue_type: "temple",
      meeting_link: "",
      max_attendees: ""
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'celebration': return 'default';
      case 'puja': return 'secondary';
      case 'meeting': return 'outline';
      case 'workshop': return 'default';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading events...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Community Calendar ({events?.length || 0} Events)</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <Label>Event Title</Label>
                  <Input
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="Enter event title..."
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Enter event description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Type</Label>
                    <Select value={eventForm.event_type} onValueChange={(value) => setEventForm({ ...eventForm, event_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="celebration">Celebration</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seva">Seva</SelectItem>
                        <SelectItem value="puja">Puja</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Venue Type</Label>
                    <Select value={eventForm.venue_type} onValueChange={(value) => setEventForm({ ...eventForm, venue_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temple">Temple</SelectItem>
                        <SelectItem value="community_hall">Community Hall</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={eventForm.start_date}
                      onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>End Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={eventForm.end_date}
                      onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="Enter location..."
                  />
                </div>
                {eventForm.venue_type === 'online' && (
                  <div>
                    <Label>Meeting Link</Label>
                    <Input
                      value={eventForm.meeting_link}
                      onChange={(e) => setEventForm({ ...eventForm, meeting_link: e.target.value })}
                      placeholder="https://zoom.us/..."
                    />
                  </div>
                )}
                <div>
                  <Label>Max Attendees (Optional)</Label>
                  <Input
                    type="number"
                    value={eventForm.max_attendees}
                    onChange={(e) => setEventForm({ ...eventForm, max_attendees: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setIsCreateOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateEvent}
                    disabled={createEvent.isPending}
                  >
                    {createEvent.isPending ? 'Creating...' : 'Create Event'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          {editingEvent && (
            <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <Label>Event Title</Label>
                    <Input
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={eventForm.start_date}
                        onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>End Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={eventForm.end_date}
                        onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditingEvent(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateEvent} disabled={updateEvent.isPending}>
                      Update Event
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {events?.map((event: any) => (
            <Card key={event._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge variant={getEventTypeColor(event.event_type)}>
                        {event.event_type}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{format(new Date(event.start_date), 'PPp')}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.max_attendees && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Max {event.max_attendees} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(event)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteEvent(event._id)}
                      disabled={deleteEvent.isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {events?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No events scheduled yet. Create your first event!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
