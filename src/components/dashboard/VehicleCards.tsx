import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Gauge, User } from "lucide-react";

const vehicles = [
  {
    id: "VH-001",
    type: "Cargo Van",
    driver: "John Smith",
    status: "active",
    location: "Downtown District",
    speed: "45 km/h",
    fuel: "78%",
  },
  {
    id: "VH-002",
    type: "Box Truck",
    driver: "Sarah Johnson",
    status: "active",
    location: "Industrial Area",
    speed: "52 km/h",
    fuel: "65%",
  },
  {
    id: "VH-003",
    type: "Delivery Van",
    driver: "Mike Wilson",
    status: "idle",
    location: "Warehouse 3",
    speed: "0 km/h",
    fuel: "92%",
  },
  {
    id: "VH-004",
    type: "Flatbed Truck",
    driver: "Emma Davis",
    status: "active",
    location: "Highway 101",
    speed: "68 km/h",
    fuel: "55%",
  },
  {
    id: "VH-005",
    type: "Refrigerated Truck",
    driver: "James Brown",
    status: "maintenance",
    location: "Service Center",
    speed: "0 km/h",
    fuel: "45%",
  },
  {
    id: "VH-006",
    type: "Cargo Van",
    driver: "Lisa Anderson",
    status: "active",
    location: "Suburban Zone",
    speed: "38 km/h",
    fuel: "81%",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "idle":
      return "bg-yellow-500";
    case "maintenance":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return "default";
    case "idle":
      return "secondary";
    case "maintenance":
      return "outline";
    default:
      return "secondary";
  }
};

export const VehicleCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle.id}
          className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{vehicle.id}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {vehicle.type}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(vehicle.status)} animate-pulse`} />
                <Badge variant={getStatusBadge(vehicle.status) as any}>
                  {vehicle.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{vehicle.driver}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{vehicle.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span>{vehicle.speed}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Fuel</span>
                <span className="text-sm font-semibold">{vehicle.fuel}</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                  style={{ width: vehicle.fuel }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
