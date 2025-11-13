import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import VehicleDetails from "./pages/VehicleDetails";
import Drivers from "./pages/Drivers";
import DriverDetails from "./pages/DriverDetails";
import Disputes from "./pages/Disputes";
import Trips from "./pages/Trips";
import Profile from "./pages/Profile";
import Users from "./pages/admin/Users";
import Roles from "./pages/admin/Roles";
import Permissions from "./pages/admin/Permissions";
import Riders from "./pages/admin/Riders";
import Country from "./pages/config/Country";
import State from "./pages/config/State";
import City from "./pages/config/City";
import BasePricing from "./pages/config/BasePricing";
import SurgePricing from "./pages/config/SurgePricing";
import Promotions from "./pages/config/Promotions";
import Referrals from "./pages/config/Referrals";
import VehicleCategory from "./pages/config/VehicleCategory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/driver/:id" element={<DriverDetails />} />
          <Route path="/disputes" element={<Disputes />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/permissions" element={<Permissions />} />
          <Route path="/admin/riders" element={<Riders />} />
          <Route path="/config/country" element={<Country />} />
          <Route path="/config/state" element={<State />} />
          <Route path="/config/city" element={<City />} />
          <Route path="/config/base-pricing" element={<BasePricing />} />
          <Route path="/config/surge-pricing" element={<SurgePricing />} />
          <Route path="/config/promotions" element={<Promotions />} />
          <Route path="/config/referrals" element={<Referrals />} />
          <Route path="/config/vehicle-category" element={<VehicleCategory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
