import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { Search, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Trips = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [riderFilter, setRiderFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Mock data for trips
  const trips = [
    {
      tripId: "TRP-001",
      rider: "John Doe",
      driver: "Ahmad Hassan",
      pickup: "KLCC, Kuala Lumpur",
      dropoff: "Mid Valley Megamall",
      distance: "8.5 km",
      duration: "22 min",
      fare: "RM 28.50",
      status: "completed",
      date: "2024-01-15 14:30",
      vehicle: "Toyota Vios - ABC1234",
    },
    {
      tripId: "TRP-002",
      rider: "Sarah Lee",
      driver: "Kumar Singh",
      pickup: "Pavilion KL",
      dropoff: "KLIA Terminal 1",
      distance: "62.3 km",
      duration: "48 min",
      fare: "RM 115.00",
      status: "in_progress",
      date: "2024-01-15 15:45",
      vehicle: "Honda City - XYZ5678",
    },
    {
      tripId: "TRP-003",
      rider: "Michael Chen",
      driver: "Fatima Ali",
      pickup: "Bangsar Shopping Centre",
      dropoff: "Sunway Pyramid",
      distance: "15.2 km",
      duration: "35 min",
      fare: "RM 42.00",
      status: "completed",
      date: "2024-01-15 12:15",
      vehicle: "Perodua Myvi - DEF9012",
    },
    {
      tripId: "TRP-004",
      rider: "Emily Wong",
      driver: "Ahmad Hassan",
      pickup: "One Utama",
      dropoff: "Petaling Street",
      distance: "18.7 km",
      duration: "40 min",
      fare: "RM 52.50",
      status: "cancelled",
      date: "2024-01-15 10:00",
      vehicle: "Toyota Vios - ABC1234",
    },
    {
      tripId: "TRP-005",
      rider: "David Tan",
      driver: "Kumar Singh",
      pickup: "Batu Caves",
      dropoff: "Bukit Bintang",
      distance: "21.4 km",
      duration: "45 min",
      fare: "RM 58.00",
      status: "scheduled",
      date: "2024-01-15 18:00",
      vehicle: "Honda City - XYZ5678",
    },
  ];

  const columns = [
    {
      header: "Trip ID",
      accessorKey: "tripId" as keyof typeof trips[0],
    },
    {
      header: "Rider",
      accessorKey: "rider" as keyof typeof trips[0],
    },
    {
      header: "Driver",
      accessorKey: "driver" as keyof typeof trips[0],
    },
    {
      header: "Pickup",
      accessorKey: "pickup" as keyof typeof trips[0],
    },
    {
      header: "Dropoff",
      accessorKey: "dropoff" as keyof typeof trips[0],
    },
    {
      header: "Distance",
      accessorKey: "distance" as keyof typeof trips[0],
    },
    {
      header: "Duration",
      accessorKey: "duration" as keyof typeof trips[0],
    },
    {
      header: "Fare",
      accessorKey: "fare" as keyof typeof trips[0],
    },
    {
      header: "Status",
      accessorKey: "status" as keyof typeof trips[0],
      cell: (row: typeof trips[0]) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          completed: "default",
          in_progress: "secondary",
          cancelled: "destructive",
          scheduled: "outline",
        };
        return (
          <Badge variant={variants[row.status] || "default"}>
            {row.status.replace("_", " ").toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: "Date & Time",
      accessorKey: "date" as keyof typeof trips[0],
    },
  ];

  // Get unique drivers and riders for filters
  const uniqueDrivers = Array.from(new Set(trips.map((t) => t.driver)));
  const uniqueRiders = Array.from(new Set(trips.map((t) => t.rider)));

  // Apply filters
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.rider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.dropoff.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    const matchesDriver = driverFilter === "all" || trip.driver === driverFilter;
    const matchesRider = riderFilter === "all" || trip.rider === riderFilter;

    let matchesDateRange = true;
    if (dateFrom || dateTo) {
      const tripDate = new Date(trip.date);
      if (dateFrom && new Date(dateFrom) > tripDate) matchesDateRange = false;
      if (dateTo && new Date(dateTo) < tripDate) matchesDateRange = false;
    }

    return matchesSearch && matchesStatus && matchesDriver && matchesRider && matchesDateRange;
  });

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDriverFilter("all");
    setRiderFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Trips</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage all ride bookings
            </p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Filters Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
                <CardDescription>Filter trips by various criteria</CardDescription>
              </div>
              <Button variant="outline" onClick={handleReset}>
                Reset Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search trips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Driver Filter */}
              <div className="space-y-2">
                <Label htmlFor="driver">Driver</Label>
                <Select value={driverFilter} onValueChange={setDriverFilter}>
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="All drivers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drivers</SelectItem>
                    {uniqueDrivers.map((driver) => (
                      <SelectItem key={driver} value={driver}>
                        {driver}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rider Filter */}
              <div className="space-y-2">
                <Label htmlFor="rider">Rider</Label>
                <Select value={riderFilter} onValueChange={setRiderFilter}>
                  <SelectTrigger id="rider">
                    <SelectValue placeholder="All riders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Riders</SelectItem>
                    {uniqueRiders.map((rider) => (
                      <SelectItem key={rider} value={rider}>
                        {rider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Date From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label htmlFor="dateTo">Date To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trips Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Trips ({filteredTrips.length})</CardTitle>
            <CardDescription>
              Showing {filteredTrips.length} of {trips.length} trips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={filteredTrips} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Trips;
