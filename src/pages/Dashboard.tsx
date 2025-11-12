import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { VehicleCards } from "@/components/dashboard/VehicleCards";
import { VehiclesTable } from "@/components/dashboard/VehiclesTable";
import { Truck, LogOut, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<"cards" | "table">("cards");

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Aboosto Fleet
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/drivers")}
              className="flex items-center gap-2"
            >
              <Users className="h-5 w-5" />
              <span className="hidden sm:inline">Drivers</span>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-bold mb-2">Fleet Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage your entire fleet in real-time
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <StatsCards />
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex items-center justify-between animate-in fade-in slide-in-from-bottom-8 duration-900">
          <h3 className="text-2xl font-semibold">Active Vehicles</h3>
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

        {/* Vehicle Display */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
          {activeView === "cards" ? <VehicleCards /> : <VehiclesTable />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
