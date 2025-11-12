import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const vehicles = [
  {
    id: "VH-001",
    type: "Cargo Van",
    driver: "John Smith",
    status: "active",
    location: "Downtown District",
    speed: "45 km/h",
    fuel: "78%",
    lastUpdate: "2 mins ago",
  },
  {
    id: "VH-002",
    type: "Box Truck",
    driver: "Sarah Johnson",
    status: "active",
    location: "Industrial Area",
    speed: "52 km/h",
    fuel: "65%",
    lastUpdate: "1 min ago",
  },
  {
    id: "VH-003",
    type: "Delivery Van",
    driver: "Mike Wilson",
    status: "idle",
    location: "Warehouse 3",
    speed: "0 km/h",
    fuel: "92%",
    lastUpdate: "5 mins ago",
  },
  {
    id: "VH-004",
    type: "Flatbed Truck",
    driver: "Emma Davis",
    status: "active",
    location: "Highway 101",
    speed: "68 km/h",
    fuel: "55%",
    lastUpdate: "Just now",
  },
  {
    id: "VH-005",
    type: "Refrigerated Truck",
    driver: "James Brown",
    status: "maintenance",
    location: "Service Center",
    speed: "0 km/h",
    fuel: "45%",
    lastUpdate: "30 mins ago",
  },
  {
    id: "VH-006",
    type: "Cargo Van",
    driver: "Lisa Anderson",
    status: "active",
    location: "Suburban Zone",
    speed: "38 km/h",
    fuel: "81%",
    lastUpdate: "3 mins ago",
  },
  {
    id: "VH-007",
    type: "Panel Van",
    driver: "Robert Taylor",
    status: "active",
    location: "North Quarter",
    speed: "42 km/h",
    fuel: "73%",
    lastUpdate: "4 mins ago",
  },
  {
    id: "VH-008",
    type: "Cargo Van",
    driver: "Jennifer Lee",
    status: "idle",
    location: "Depot 2",
    speed: "0 km/h",
    fuel: "88%",
    lastUpdate: "10 mins ago",
  },
];

const getStatusVariant = (status: string) => {
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

export const VehiclesTable = () => {
  return (
    <div className="rounded-lg border border-border/50 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Vehicle ID</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Driver</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Speed</TableHead>
            <TableHead className="font-semibold">Fuel</TableHead>
            <TableHead className="font-semibold">Last Update</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{vehicle.id}</TableCell>
              <TableCell>{vehicle.type}</TableCell>
              <TableCell>{vehicle.driver}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(vehicle.status) as any}>
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{vehicle.location}</span>
                </div>
              </TableCell>
              <TableCell>{vehicle.speed}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: vehicle.fuel }}
                    />
                  </div>
                  <span className="text-sm">{vehicle.fuel}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {vehicle.lastUpdate}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Track Location</DropdownMenuItem>
                    <DropdownMenuItem>Contact Driver</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
