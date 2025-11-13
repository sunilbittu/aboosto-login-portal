import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Truck, Car, MapPin, Route } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>
      
      {/* Dot pattern overlay */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: 'var(--pattern-dots)',
          backgroundSize: 'var(--pattern-size-dots)'
        }}
      />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{ 
          backgroundImage: 'var(--pattern-grid)',
          backgroundSize: 'var(--pattern-size-grid)'
        }}
      />
      
      {/* Animated Cars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Car 1 - Moving right */}
        <div className="absolute top-1/4 left-0 animate-[slide-in-right_15s_linear_infinite]">
          <Car className="h-8 w-8 text-primary/30" />
        </div>
        
        {/* Car 2 - Moving right with delay */}
        <div className="absolute top-1/3 left-0 animate-[slide-in-right_20s_linear_infinite] delay-700">
          <Truck className="h-10 w-10 text-secondary/30 rotate-3" />
        </div>
        
        {/* Car 3 - Moving right with longer delay */}
        <div className="absolute top-2/3 left-0 animate-[slide-in-right_18s_linear_infinite] delay-1000">
          <Car className="h-7 w-7 text-accent/30 -rotate-2" />
        </div>
        
        {/* Route Path Illustration */}
        <svg className="absolute top-1/2 left-1/4 w-1/2 h-32 opacity-20" viewBox="0 0 400 100">
          <path
            d="M 0 50 Q 100 20, 200 50 T 400 50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 4"
            className="text-primary animate-pulse"
          />
        </svg>
        
        {/* Map Pins */}
        <div className="absolute top-1/4 right-1/4 animate-pulse">
          <MapPin className="h-6 w-6 text-primary/40" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-pulse delay-500">
          <MapPin className="h-6 w-6 text-secondary/40" />
        </div>
        
        {/* Route Icon */}
        <div className="absolute bottom-1/4 right-1/3 animate-bounce delay-300">
          <Route className="h-8 w-8 text-accent/30" />
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="relative z-10 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4">
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
        </div>
      </div>
    </div>
  );
};

export default Index;
