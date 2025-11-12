import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, AlertCircle, CheckCircle, Navigation } from "lucide-react";

const stats = [
  {
    title: "Total Vehicles",
    value: "48",
    change: "+2 this month",
    icon: Truck,
    color: "text-primary",
  },
  {
    title: "Active Vehicles",
    value: "42",
    change: "87.5% of fleet",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    title: "In Maintenance",
    value: "4",
    change: "2 scheduled",
    icon: AlertCircle,
    color: "text-orange-500",
  },
  {
    title: "On Route",
    value: "38",
    change: "15 deliveries today",
    icon: Navigation,
    color: "text-blue-500",
  },
];

export const StatsCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-border/50 hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
