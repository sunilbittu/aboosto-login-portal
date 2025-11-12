import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Truck, 
  ArrowLeft, 
  Search, 
  Phone, 
  Mail,
  Star,
  TrendingUp,
  Eye
} from "lucide-react";

const driversData = [
  {
    id: "DRV-001",
    name: "John Okoro",
    email: "john.okoro@aboosto.com",
    phone: "+234 801 234 5678",
    license: "DL-2024-001",
    status: "active",
    rating: 4.8,
    tripsCompleted: 245,
    onTimeRate: 96,
    currentVehicle: "VH-001",
    experience: "5 years"
  },
  {
    id: "DRV-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@aboosto.com",
    phone: "+234 802 345 6789",
    license: "DL-2024-002",
    status: "active",
    rating: 4.9,
    tripsCompleted: 312,
    onTimeRate: 98,
    currentVehicle: "VH-002",
    experience: "7 years"
  },
  {
    id: "DRV-003",
    name: "Mike Wilson",
    email: "mike.wilson@aboosto.com",
    phone: "+234 803 456 7890",
    license: "DL-2024-003",
    status: "off-duty",
    rating: 4.6,
    tripsCompleted: 189,
    onTimeRate: 94,
    currentVehicle: "VH-003",
    experience: "3 years"
  },
  {
    id: "DRV-004",
    name: "Emma Davis",
    email: "emma.davis@aboosto.com",
    phone: "+234 804 567 8901",
    license: "DL-2024-004",
    status: "active",
    rating: 4.7,
    tripsCompleted: 278,
    onTimeRate: 95,
    currentVehicle: "VH-004",
    experience: "6 years"
  },
  {
    id: "DRV-005",
    name: "James Brown",
    email: "james.brown@aboosto.com",
    phone: "+234 805 678 9012",
    license: "DL-2024-005",
    status: "active",
    rating: 4.5,
    tripsCompleted: 156,
    onTimeRate: 92,
    currentVehicle: "VH-005",
    experience: "2 years"
  },
  {
    id: "DRV-006",
    name: "Lisa Anderson",
    email: "lisa.anderson@aboosto.com",
    phone: "+234 806 789 0123",
    license: "DL-2024-006",
    status: "active",
    rating: 4.9,
    tripsCompleted: 334,
    onTimeRate: 99,
    currentVehicle: "VH-006",
    experience: "8 years"
  }
];

const Drivers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"cards" | "table">("cards");

  const filteredDrivers = driversData.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              onClick={() => navigate("/dashboard")}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Truck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Driver Management
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driversData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary">5</span> active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-xs text-muted-foreground mt-1">Across all drivers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,514</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary">↑ 2%</span> vs last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and View Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drivers by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeView === "cards" ? "default" : "outline"}
              onClick={() => setActiveView("cards")}
              className={activeView === "cards" ? "bg-gradient-to-r from-primary to-secondary" : ""}
            >
              Card View
            </Button>
            <Button
              variant={activeView === "table" ? "default" : "outline"}
              onClick={() => setActiveView("table")}
              className={activeView === "table" ? "bg-gradient-to-r from-primary to-secondary" : ""}
            >
              Table View
            </Button>
          </div>
        </div>

        {/* Driver Display */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-900">
          {activeView === "cards" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDrivers.map((driver, index) => (
                <Card 
                  key={driver.id} 
                  className="hover:shadow-lg transition-all duration-300 group animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg font-semibold">
                          {getInitials(driver.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{driver.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{driver.id}</p>
                        <Badge 
                          className={
                            driver.status === "active" 
                              ? "bg-gradient-to-r from-primary to-secondary mt-2" 
                              : "bg-muted text-muted-foreground mt-2"
                          }
                        >
                          {driver.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{driver.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-semibold">{driver.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {driver.tripsCompleted} trips
                      </span>
                    </div>
                    <Button 
                      onClick={() => navigate(`/driver/${driver.id}`)}
                      className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Driver</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">License</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Rating</TableHead>
                    <TableHead className="font-semibold">Trips</TableHead>
                    <TableHead className="font-semibold">On-Time</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver) => (
                    <TableRow key={driver.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                              {getInitials(driver.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-muted-foreground">{driver.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {driver.email}
                          </div>
                          <div className="text-sm flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {driver.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{driver.license}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            driver.status === "active" 
                              ? "bg-gradient-to-r from-primary to-secondary" 
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {driver.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-semibold">{driver.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{driver.tripsCompleted}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-primary">{driver.onTimeRate}%</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/driver/${driver.id}`)}
                          className="hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Drivers;
