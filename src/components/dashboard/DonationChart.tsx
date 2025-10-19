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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, Calendar, Filter } from "lucide-react";

interface DonationData {
  date: string;
  stripe: number;
  hundi: number;
  inTemple: number;
  total: number;
}

export const DonationChart = () => {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Mock data for demonstration
  const generateMockData = (): DonationData[] => {
    const data: DonationData[] = [];
    const baseDate = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      const stripe = Math.floor(Math.random() * 50000) + 10000;
      const hundi = Math.floor(Math.random() * 20000) + 5000;
      const inTemple = Math.floor(Math.random() * 15000) + 3000;
      
      data.push({
        date: date.toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        }),
        stripe,
        hundi,
        inTemple,
        total: stripe + hundi + inTemple,
      });
    }
    
    return data;
  };

  const [donationData] = useState<DonationData[]>(generateMockData());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {entry.dataKey === 'inTemple' ? 'In-Temple' : entry.dataKey}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-sm font-semibold text-temple-gold">
                {formatCurrency(payload.reduce((sum: number, entry: any) => sum + entry.value, 0))}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalDonations = donationData.reduce((sum, item) => sum + item.total, 0);
  const averageDaily = totalDonations / donationData.length;
  const highestDay = Math.max(...donationData.map(item => item.total));

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-temple-gold" />
            <span>Donation Trends</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={timePeriod} onValueChange={(value: any) => setTimePeriod(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            >
              <Filter className="w-4 h-4 mr-1" />
              {chartType === 'line' ? 'Bar' : 'Line'}
            </Button>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-temple-gold">
              {formatCurrency(totalDonations)}
            </p>
            <p className="text-xs text-muted-foreground">Total This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-temple-saffron">
              {formatCurrency(averageDaily)}
            </p>
            <p className="text-xs text-muted-foreground">Daily Average</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-temple-accent">
              {formatCurrency(highestDay)}
            </p>
            <p className="text-xs text-muted-foreground">Highest Day</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="stripe"
                  stroke="hsl(var(--temple-saffron))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--temple-saffron))", strokeWidth: 2, r: 4 }}
                  name="Stripe"
                />
                <Line
                  type="monotone"
                  dataKey="hundi"
                  stroke="hsl(var(--temple-maroon))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--temple-maroon))", strokeWidth: 2, r: 4 }}
                  name="Hundi"
                />
                <Line
                  type="monotone"
                  dataKey="inTemple"
                  stroke="hsl(var(--temple-gold))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--temple-gold))", strokeWidth: 2, r: 4 }}
                  name="In-Temple"
                />
              </LineChart>
            ) : (
              <BarChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="stripe"
                  fill="hsl(var(--temple-saffron))"
                  name="Stripe"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="hundi"
                  fill="hsl(var(--temple-maroon))"
                  name="Hundi"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="inTemple"
                  fill="hsl(var(--temple-gold))"
                  name="In-Temple"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Source Breakdown */}
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Breakdown by Source</h4>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Stripe', color: 'temple-saffron', percentage: 65 },
              { name: 'Hundi', color: 'temple-maroon', percentage: 25 },
              { name: 'In-Temple', color: 'temple-gold', percentage: 10 },
            ].map((source) => (
              <div key={source.name} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div className={`w-3 h-3 rounded-full bg-${source.color}`} />
                  <span className="text-sm font-medium text-foreground">{source.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {source.percentage}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};