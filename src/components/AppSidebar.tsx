import {
  LayoutDashboard,
  Users,
  Shield,
  Lock,
  Car,
  Truck,
  ChevronDown,
  Settings,
  Globe,
  MapPin,
  Building2,
  DollarSign,
  TrendingUp,
  Gift,
  UserPlus,
  AlertCircle,
  Navigation,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const adminItems = [
  { title: "Users", url: "/admin/list", icon: Users },
  { title: "Roles", url: "/admin/roles", icon: Shield },
  { title: "Permissions", url: "/admin/permissions", icon: Lock },
  { title: "Riders", url: "/admin/riders", icon: Car },
  { title: "Drivers", url: "/drivers", icon: Truck },
  { title: "Trips", url: "/trips", icon: Navigation },
  { title: "Disputes", url: "/disputes", icon: AlertCircle },
];

const configItems = [
  { title: "Country", url: "/config/country", icon: Globe },
  { title: "State", url: "/config/state", icon: MapPin },
  { title: "City", url: "/config/city", icon: Building2 },
  { title: "Base Pricing", url: "/config/base-pricing", icon: DollarSign },
  { title: "Surge Pricing", url: "/config/surge-pricing", icon: TrendingUp },
  { title: "Promotions", url: "/config/promotions", icon: Gift },
  { title: "Referrals", url: "/config/referrals", icon: UserPlus },
  { title: "Vehicle Category", url: "/config/vehicle-category", icon: Car },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isAdminSectionActive = adminItems.some((item) => isActive(item.url));
  const isConfigSectionActive = configItems.some((item) => isActive(item.url));

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Management */}
        <Collapsible
          defaultOpen={isAdminSectionActive}
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger
                className={`flex items-center justify-between w-full hover:bg-accent rounded-md transition-colors ${
                  collapsed ? "hidden" : ""
                }`}
              >
                <span>Admin Management</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink
                          to={item.url}
                          className="hover:bg-accent pl-4"
                          activeClassName="bg-accent text-accent-foreground font-medium"
                        >
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Configuration Management */}
        <Collapsible
          defaultOpen={isConfigSectionActive}
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger
                className={`flex items-center justify-between w-full hover:bg-accent rounded-md transition-colors ${
                  collapsed ? "hidden" : ""
                }`}
              >
                <span>Configuration Management</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {configItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink
                          to={item.url}
                          className="hover:bg-accent pl-4"
                          activeClassName="bg-accent text-accent-foreground font-medium"
                        >
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
