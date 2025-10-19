import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Calendar, Users, Filter, TrendingUp } from "lucide-react";

interface EventData {
  name: string;
  attendance: number;
  capacity: number;
  community: string;
  date: string;
  utilizationRate: number;
}

export const EventAttendanceChart = () => {
  const [filterCommunity, setFilterCommunity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'attendance' | 'utilization'>('date');

  // Mock data for demonstration
  const [eventData] = useState<EventData[]>([
    {
      name: "Morning Aarti",
      attendance: 85,
      capacity: 100,
      community: "Main Temple",
      date: "2024-01-15",
      utilizationRate: 85,
    },
    {
      name: "Bhajan Session",
      attendance: 45,
      capacity: 60,
      community: "Youth Group",
      date: "2024-01-14",
      utilizationRate: 75,
    },
    {
      name: "Ganesh Puja",
      attendance: 150,
      capacity: 200,
      community: "Main Temple",
      date: "2024-01-13",
      utilizationRate: 75,
    },
    {
      name: "Satsang",
      attendance: 30,
      capacity: 40,
      community: "Seniors Group",
      date: "2024-01-12",
      utilizationRate: 75,
    },
    {
      name: "Yoga Class",
      attendance: 25,
      capacity: 30,
      community: "Wellness Group",
      date: "2024-01-11",
      utilizationRate: 83,
    },
    {
      name: "Festival Prep",
      attendance: 120,
      capacity: 150,
      community: "Volunteers",
      date: "2024-01-10",
      utilizationRate: 80,
    },
  ]);

  const communities = ['all', ...Array.from(new Set(eventData.map(event => event.community)))];

  const filteredData = eventData
    .filter(event => filterCommunity === 'all' || event.community === filterCommunity)
    .sort((a, b) => {
      switch (sortBy) {
        case 'attendance':
          return b.attendance - a.attendance;
        case 'utilization':
          return b.utilizationRate - a.utilizationRate;
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const getBarColor = (utilizationRate: number) => {
    if (utilizationRate >= 90) return "hsl(var(--temple-gold))";
    if (utilizationRate >= 75) return "hsl(var(--temple-saffron))";
    if (utilizationRate >= 50) return "hsl(var(--temple-accent))";
    return "hsl(var(--temple-maroon))";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Attendance:</span>
              <span className="text-sm font-medium text-foreground">
                {data.attendance} people
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Capacity:</span>
              <span className="text-sm font-medium text-foreground">
                {data.capacity} people
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Utilization:</span>
              <span className="text-sm font-medium text-temple-gold">
                {data.utilizationRate}%
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Community:</span>
              <Badge variant="outline" className="text-xs">
                {data.community}
              </Badge>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const averageAttendance = Math.round(
    filteredData.reduce((sum, event) => sum + event.attendance, 0) / filteredData.length
  );
  const averageUtilization = Math.round(
    filteredData.reduce((sum, event) => sum + event.utilizationRate, 0) / filteredData.length
  );
  const totalCapacity = filteredData.reduce((sum, event) => sum + event.capacity, 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-temple-saffron" />
            <span>Event Attendance</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={filterCommunity} onValueChange={setFilterCommunity}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {communities.map((community) => (
                  <SelectItem key={community} value={community}>
                    {community === 'all' ? 'All Communities' : community}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="attendance">By Attendance</SelectItem>
                <SelectItem value="utilization">By Utilization</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-temple-saffron">
              {averageAttendance}
            </p>
            <p className="text-xs text-muted-foreground">Avg Attendance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-temple-gold">
              {averageUtilization}%
            </p>
            <p className="text-xs text-muted-foreground">Avg Utilization</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-temple-maroon">
              {totalCapacity}
            </p>
            <p className="text-xs text-muted-foreground">Total Capacity</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="attendance"
                name="Attendance"
                radius={[4, 4, 0, 0]}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.utilizationRate)} />
                ))}
              </Bar>
              <Bar
                dataKey="capacity"
                name="Capacity"
                fill="hsl(var(--muted))"
                opacity={0.3}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Utilization Legend */}
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Utilization Rate Legend</h4>
          <div className="grid grid-cols-4 gap-4">
            {[
              { range: '90%+', color: 'temple-gold', label: 'Excellent' },
              { range: '75-89%', color: 'temple-saffron', label: 'Good' },
              { range: '50-74%', color: 'temple-accent', label: 'Fair' },
              { range: '<50%', color: 'temple-maroon', label: 'Low' },
            ].map((item) => (
              <div key={item.range} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded bg-${item.color}`} />
                <div className="text-xs">
                  <div className="font-medium text-foreground">{item.range}</div>
                  <div className="text-muted-foreground">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-temple-gold" />
            Performance Insights
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Best Performing Event:</span>
              <Badge variant="outline" className="text-temple-gold">
                {filteredData.reduce((best, event) => 
                  event.utilizationRate > best.utilizationRate ? event : best
                ).name}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Most Popular Community:</span>
              <Badge variant="outline" className="text-temple-saffron">
                Main Temple
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Events This Month:</span>
              <Badge variant="outline" className="text-temple-maroon">
                {filteredData.length} events
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};