import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Truck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Truck className="h-12 w-12 text-primary" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Aboosto Fleet
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Advanced Fleet Operations Management System
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-md px-8"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            variant="outline"
            className="px-8"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
