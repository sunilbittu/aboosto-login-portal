import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Truck, Car, MapPin, Route, Navigation, Users, BarChart3, Shield, Clock, Zap } from "lucide-react";

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
        
        {/* Features Section */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Powerful Fleet Management Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Real-time Tracking */}
            <Card className="p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Navigation className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Real-Time Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your entire fleet in real-time with live GPS tracking and route optimization
                </p>
              </div>
            </Card>

            {/* Driver Management */}
            <Card className="p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-secondary/10">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Driver Management</h3>
                <p className="text-muted-foreground">
                  Comprehensive driver profiles, performance tracking, and automated scheduling
                </p>
              </div>
            </Card>

            {/* Analytics */}
            <Card className="p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-accent/10">
                  <BarChart3 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Detailed insights and reports to optimize operations and maximize efficiency
                </p>
              </div>
            </Card>

            {/* Security */}
            <Card className="p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  Bank-level encryption and role-based access control for your data
                </p>
              </div>
            </Card>

            {/* 24/7 Operations */}
            <Card className="p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-secondary/10">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">24/7 Operations</h3>
                <p className="text-muted-foreground">
                  Round-the-clock monitoring and support for uninterrupted service
                </p>
              </div>
            </Card>

            {/* Instant Updates */}
            <Card className="p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-accent/10">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Instant Updates</h3>
                <p className="text-muted-foreground">
                  Real-time notifications and alerts keep your team always informed
                </p>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Footer Section */}
        <footer className="mt-24 border-t border-border/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Aboosto Fleet</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Leading fleet management solution in Malaysia, empowering businesses with smart transportation technology.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><button onClick={() => navigate("/login")} className="hover:text-primary transition-colors">Sign In</button></li>
                  <li><button onClick={() => navigate("/signup")} className="hover:text-primary transition-colors">Sign Up</button></li>
                  <li><button className="hover:text-primary transition-colors">About Us</button></li>
                  <li><button className="hover:text-primary transition-colors">Contact</button></li>
                </ul>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Services</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-primary transition-colors cursor-pointer">Fleet Management</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Driver Management</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Real-Time Tracking</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Analytics & Reporting</li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Contact</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Kuala Lumpur, Malaysia</li>
                  <li>info@aboosto.com</li>
                  <li>+60 3-1234-5678</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Aboosto Fleet. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
