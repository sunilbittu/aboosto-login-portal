import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  ArrowLeft, 
  Truck, 
  Phone, 
  Mail,
  Calendar,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  Award,
  FileText
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data
const driverData = {
  id: "DRV-001",
  name: "John Okoro",
  email: "john.okoro@aboosto.com",
  phone: "+234 801 234 5678",
  license: "DL-2024-001",
  licenseExpiry: "2027-12-31",
  dateJoined: "2020-03-15",
  status: "active",
  rating: 4.8,
  tripsCompleted: 245,
  onTimeRate: 96,
  currentVehicle: "VH-001",
  experience: "5 years",
  address: "15 Admiralty Way, Lekki Phase 1, Lagos"
};

const performanceData = [
  { month: "Jan", trips: 38, rating: 4.7, onTime: 95 },
  { month: "Feb", trips: 42, rating: 4.8, onTime: 96 },
  { month: "Mar", trips: 35, rating: 4.6, onTime: 94 },
  { month: "Apr", trips: 45, rating: 4.9, onTime: 98 },
  { month: "May", trips: 40, rating: 4.8, onTime: 97 },
  { month: "Jun", trips: 45, rating: 4.8, onTime: 96 }
];

const assignmentHistory = [
  { 
    id: 1, 
    vehicle: "VH-001 - Truck Alpha", 
    assignedDate: "2024-01-01", 
    endDate: "Present", 
    tripsCompleted: 145,
    status: "active"
  },
  { 
    id: 2, 
    vehicle: "VH-003 - Delivery Van", 
    assignedDate: "2023-06-15", 
    endDate: "2023-12-31", 
    tripsCompleted: 78,
    status: "completed"
  },
  { 
    id: 3, 
    vehicle: "VH-007 - Panel Van", 
    assignedDate: "2023-01-10", 
    endDate: "2023-06-14", 
    tripsCompleted: 22,
    status: "completed"
  }
];

const recentTrips = [
  { 
    id: 1, 
    route: "Lagos → Abuja", 
    date: "2024-01-15", 
    distance: "780 km", 
    duration: "9h 15m",
    status: "completed",
    rating: 5
  },
  { 
    id: 2, 
    route: "Lagos → Ibadan", 
    date: "2024-01-14", 
    distance: "130 km", 
    duration: "2h 05m",
    status: "completed",
    rating: 5
  },
  { 
    id: 3, 
    route: "Ibadan → Ilorin", 
    date: "2024-01-13", 
    distance: "180 km", 
    duration: "2h 45m",
    status: "completed",
    rating: 4
  },
  { 
    id: 4, 
    route: "Lagos → Benin City", 
    date: "2024-01-12", 
    distance: "320 km", 
    duration: "4h 30m",
    status: "completed",
    rating: 5
  },
  { 
    id: 5, 
    route: "Lagos → Port Harcourt", 
    date: "2024-01-11", 
    distance: "650 km", 
    duration: "8h 10m",
    status: "completed",
    rating: 5
  }
];

const DriverDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/drivers")}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Truck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">{driverData.name}</h1>
              <p className="text-sm text-muted-foreground">{driverData.id}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-3xl font-bold">
                  {getInitials(driverData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold">{driverData.name}</h2>
                  <Badge className="bg-gradient-to-r from-primary to-secondary">
                    {driverData.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{driverData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{driverData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{driverData.license}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 fill-primary text-primary" />
                {driverData.rating}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Excellent performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trips Completed</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverData.tripsCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">Total deliveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverData.onTimeRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary">↑ 2%</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Experience</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverData.experience}</div>
              <p className="text-xs text-muted-foreground mt-1">Professional driver</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-900">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="trips">Recent Trips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Name:</span>
                      <span className="font-semibold">{driverData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Driver ID:</span>
                      <span className="font-semibold">{driverData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date Joined:</span>
                      <span className="font-semibold">{driverData.dateJoined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="font-semibold">{driverData.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className="bg-gradient-to-r from-primary to-secondary">
                        {driverData.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-semibold text-right">{driverData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-semibold">{driverData.phone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-semibold text-right max-w-[200px]">
                        {driverData.address}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      License Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">License Number:</span>
                      <span className="font-semibold">{driverData.license}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <span className="font-semibold">{driverData.licenseExpiry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">License Type:</span>
                      <span className="font-semibold">Commercial</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Current Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-semibold">{driverData.currentVehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned Since:</span>
                      <span className="font-semibold">Jan 1, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trips on Vehicle:</span>
                      <span className="font-semibold">145 trips</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    6-month performance tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          color: "hsl(var(--card-foreground))"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="trips" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Trips"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rating" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2}
                        name="Rating"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Monthly Trips Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          color: "hsl(var(--card-foreground))"
                        }}
                      />
                      <Bar dataKey="trips" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Vehicle Assignment History
                  </CardTitle>
                  <CardDescription>
                    Complete record of vehicle assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Assigned Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Trips</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignmentHistory.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.vehicle}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {assignment.assignedDate}
                            </div>
                          </TableCell>
                          <TableCell>{assignment.endDate}</TableCell>
                          <TableCell className="font-semibold">
                            {assignment.tripsCompleted}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                assignment.status === "active"
                                  ? "bg-gradient-to-r from-primary to-secondary"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {assignment.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Trips Tab */}
            <TabsContent value="trips" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Recent Trips
                  </CardTitle>
                  <CardDescription>
                    Latest trip history and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTrips.map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {trip.date}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{trip.route}</TableCell>
                          <TableCell>{trip.distance}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {trip.duration}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="font-semibold">{trip.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-gradient-to-r from-primary to-secondary">
                              {trip.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DriverDetails;
