import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, Clock, Award, TrendingUp, Calendar, Star, CheckCircle } from 'lucide-react';

export const VolunteerReports: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  // Mock volunteer data
  const volunteerMetrics = [
    {
      department: 'Event Management',
      volunteers: 45,
      activeVolunteers: 38,
      totalHours: 1240,
      avgHours: 32.6,
      retention: 89,
      satisfaction: 8.7,
      newVolunteers: 8,
      skills: ['Event Planning', 'Coordination', 'Logistics']
    },
    {
      department: 'Temple Services',
      volunteers: 32,
      activeVolunteers: 29,
      totalHours: 980,
      avgHours: 33.8,
      retention: 94,
      satisfaction: 9.2,
      newVolunteers: 5,
      skills: ['Puja Assistance', 'Cleaning', 'Decoration']
    },
    {
      department: 'Community Support',
      volunteers: 28,
      activeVolunteers: 24,
      totalHours: 720,
      avgHours: 30.0,
      retention: 86,
      satisfaction: 8.5,
      newVolunteers: 6,
      skills: ['Counseling', 'Outreach', 'Support']
    },
    {
      department: 'Administration',
      volunteers: 18,
      activeVolunteers: 16,
      totalHours: 560,
      avgHours: 35.0,
      retention: 92,
      satisfaction: 8.9,
      newVolunteers: 3,
      skills: ['Documentation', 'Finance', 'IT Support']
    }
  ];

  const volunteerTrends = [
    { month: 'Jan', active: 98, hours: 2850, newVolunteers: 12 },
    { month: 'Feb', active: 102, hours: 3120, newVolunteers: 15 },
    { month: 'Mar', active: 107, hours: 3240, newVolunteers: 18 },
    { month: 'Apr', active: 115, hours: 3580, newVolunteers: 22 },
    { month: 'May', active: 118, hours: 3650, newVolunteers: 19 },
    { month: 'Jun', active: 123, hours: 3800, newVolunteers: 24 }
  ];

  const shiftCoverage = [
    { shift: 'Morning (6-12)', scheduled: 45, filled: 42, attendance: 95 },
    { shift: 'Afternoon (12-6)', scheduled: 38, filled: 35, attendance: 92 },
    { shift: 'Evening (6-10)', scheduled: 52, filled: 48, attendance: 89 },
    { shift: 'Night (10-6)', scheduled: 24, filled: 22, attendance: 87 }
  ];

  const skillDistribution = [
    { skill: 'Event Management', volunteers: 45, demand: 52, gap: -7, color: '#8884d8' },
    { skill: 'Temple Services', volunteers: 32, demand: 35, gap: -3, color: '#82ca9d' },
    { skill: 'Community Support', volunteers: 28, demand: 30, gap: -2, color: '#ffc658' },
    { skill: 'Administration', volunteers: 18, demand: 20, gap: -2, color: '#ff7300' },
    { skill: 'IT Support', volunteers: 12, demand: 18, gap: -6, color: '#8dd1e1' }
  ];

  const volunteerPerformance = [
    { name: 'Rajesh Kumar', hours: 85, shifts: 24, rating: 9.5, department: 'Temple Services' },
    { name: 'Priya Sharma', hours: 78, shifts: 22, rating: 9.2, department: 'Event Management' },
    { name: 'Amit Patel', hours: 72, shifts: 20, rating: 9.0, department: 'Community Support' },
    { name: 'Sunita Devi', hours: 68, shifts: 19, rating: 8.8, department: 'Administration' },
    { name: 'Vikram Singh', hours: 65, shifts: 18, rating: 8.7, department: 'Event Management' }
  ];

  const trainingProgress = [
    { program: 'Basic Volunteer Training', completed: 89, total: 123, percentage: 72 },
    { program: 'Event Management Certification', completed: 34, total: 45, percentage: 76 },
    { program: 'Temple Services Training', completed: 28, total: 32, percentage: 88 },
    { program: 'Leadership Development', completed: 15, total: 25, percentage: 60 },
    { program: 'Safety & Security Training', completed: 67, total: 78, percentage: 86 }
  ];

  const recognitionData = [
    { category: 'Volunteer of the Month', recipients: 6, impact: 'High' },
    { category: 'Service Excellence Award', recipients: 12, impact: 'Medium' },
    { category: 'Long Service Recognition', recipients: 8, impact: 'High' },
    { category: 'Team Player Award', recipients: 15, impact: 'Medium' },
    { category: 'Innovation Award', recipients: 4, impact: 'High' }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="event">Event Management</SelectItem>
                  <SelectItem value="temple">Temple Services</SelectItem>
                  <SelectItem value="community">Community Support</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Performance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {volunteerMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                {metric.department}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Total Volunteers</p>
                  <p className="text-xl font-bold">{metric.volunteers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-xl font-bold text-green-600">{metric.activeVolunteers}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Retention Rate</span>
                  <span className="text-sm font-medium">{metric.retention}%</span>
                </div>
                <Progress value={metric.retention} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Avg. Hours</p>
                  <p className="font-bold">{metric.avgHours}h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-bold">{metric.satisfaction}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Key Skills</p>
                <div className="flex flex-wrap gap-1">
                  {metric.skills.slice(0, 2).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {metric.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{metric.skills.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Volunteer Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={volunteerTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="active" stroke="#8884d8" strokeWidth={2} name="Active Volunteers" />
                <Line type="monotone" dataKey="hours" stroke="#82ca9d" strokeWidth={2} name="Total Hours" />
                <Line type="monotone" dataKey="newVolunteers" stroke="#ffc658" strokeWidth={2} name="New Volunteers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Distribution & Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volunteers" fill="#3b82f6" name="Available" />
                <Bar dataKey="demand" fill="#ef4444" name="Demand" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Skill Gaps:</h4>
              <div className="space-y-1">
                {skillDistribution.filter(s => s.gap < 0).map((skill, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{skill.skill}</span>
                    <span className="text-red-600 font-medium">{Math.abs(skill.gap)} needed</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shift Coverage Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Coverage & Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shiftCoverage.map((shift, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">{shift.shift}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Scheduled</span>
                    <span className="font-medium">{shift.scheduled}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Filled</span>
                    <span className="font-medium text-green-600">{shift.filled}</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Coverage</span>
                      <span className="text-sm font-medium">
                        {Math.round((shift.filled / shift.scheduled) * 100)}%
                      </span>
                    </div>
                    <Progress value={(shift.filled / shift.scheduled) * 100} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Attendance</span>
                    <span className="font-medium text-blue-600">{shift.attendance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Volunteers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {volunteerPerformance.map((volunteer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{volunteer.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {volunteer.hours}h
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {volunteer.shifts} shifts
                      </span>
                      <Badge variant="outline">{volunteer.department}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-bold">{volunteer.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training & Development */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Program Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingProgress.map((program, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{program.program}</span>
                    <span className="text-sm text-gray-600">
                      {program.completed}/{program.total} ({program.percentage}%)
                    </span>
                  </div>
                  <Progress value={program.percentage} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recognition & Awards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recognitionData.map((recognition, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{recognition.category}</h4>
                    <p className="text-sm text-gray-600">{recognition.recipients} recipients</p>
                  </div>
                  <Badge variant={recognition.impact === 'High' ? 'default' : 'secondary'}>
                    {recognition.impact} Impact
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Recognition Program
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Volunteer Satisfaction & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">8.8/10</div>
              <p className="text-sm text-gray-600">Overall Satisfaction</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Work Environment</span>
                <span className="font-medium">9.1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recognition</span>
                <span className="font-medium">8.7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Training Quality</span>
                <span className="font-medium">8.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Communication</span>
                <span className="font-medium">8.9</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retention Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">30-day Retention</span>
              <span className="font-bold text-green-600">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">90-day Retention</span>
              <span className="font-bold text-blue-600">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">1-year Retention</span>
              <span className="font-bold text-purple-600">78%</span>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Top Retention Factors:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Flexible scheduling (89%)</li>
                <li>• Recognition programs (84%)</li>
                <li>• Skill development (81%)</li>
                <li>• Community impact (79%)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volunteer Development</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Skills Acquired</span>
              <span className="font-bold">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Certifications</span>
              <span className="font-bold text-green-600">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leadership Roles</span>
              <span className="font-bold text-blue-600">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Career Progression</span>
              <span className="font-bold text-purple-600">15</span>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Development Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};