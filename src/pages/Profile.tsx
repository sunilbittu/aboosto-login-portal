import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Lock, 
  Bell, 
  Save,
  Mail,
  Phone,
  Shield,
  Calendar
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// User roles enum matching AppUserVO
const USER_ROLES = {
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER"
} as const;

// Validation schemas
const profileSchema = z.object({
  userName: z.string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be less than 50 characters" }),
  firstName: z.string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  contactName: z.string()
    .trim()
    .min(2, { message: "Contact name must be at least 2 characters" })
    .max(100, { message: "Contact name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  contactNumber: z.string()
    .trim()
    .min(10, { message: "Contact number must be at least 10 digits" })
    .max(20, { message: "Contact number must be less than 20 characters" })
    .regex(/^[+\d\s()-]+$/, { message: "Invalid phone number format" })
});

const passwordSchema = z.object({
  currentPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Mock user data matching AppUserVO structure
  const [userData] = useState({
    id: 1,
    userName: "admin",
    firstName: "John",
    lastName: "Admin",
    contactName: "John Admin",
    email: "admin@aboosto.com",
    contactNumber: "+234 801 234 5678",
    roles: [USER_ROLES.ADMIN],
    lastLoginDate: "2025-01-10T08:30:00",
    isGoogleAccount: false,
    activated: true,
  });
  
  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    vehicleAlerts: true,
    maintenanceReminders: true,
    driverUpdates: false,
    weeklyReports: true,
  });

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: userData.userName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      contactName: userData.contactName,
      email: userData.email,
      contactNumber: userData.contactNumber,
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    // In production, this would call an API to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    // In production, this would call an API to change the password
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    });
    passwordForm.reset();
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === USER_ROLES.SUPER_ADMIN) return "bg-destructive";
    if (role === USER_ROLES.ADMIN) return "bg-gradient-to-r from-primary to-secondary";
    return "bg-muted";
  };

  const formatRole = (role: string) => {
    return role.replace("ROLE_", "").replace("_", " ");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container px-4 py-8 max-w-4xl">
          {/* Profile Header */}
          <Card className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-3xl font-bold">
                    {getInitials(userData.firstName, userData.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h2 className="text-3xl font-bold">{userData.contactName}</h2>
                    {userData.isGoogleAccount && (
                      <Badge variant="outline" className="text-xs">
                        Google Account
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                    <Mail className="h-4 w-4" />
                    <p className="text-sm">{userData.email}</p>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    {userData.roles.map((role) => (
                      <Badge key={role} className={getRoleBadgeVariant(role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {formatRole(role)}
                      </Badge>
                    ))}
                    <Badge className={userData.activated ? "bg-green-500" : "bg-muted"}>
                      {userData.activated ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center sm:justify-start">
                    <Calendar className="h-4 w-4" />
                    <span>Last login: {new Date(userData.lastLoginDate).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Settings Tabs */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="userName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="username" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="John" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="Doe" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="John Doe" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="email" placeholder="john@example.com" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="+234 801 234 5678" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Ensure your account is using a strong password to stay secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="Enter current password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="Enter new password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Must be at least 8 characters with uppercase, lowercase, and numbers
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="Confirm new password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary">
                        <Save className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={() => handleNotificationChange('emailNotifications')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.pushNotifications}
                        onCheckedChange={() => handleNotificationChange('pushNotifications')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="vehicle-alerts" className="text-base">Vehicle Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about vehicle issues and updates
                        </p>
                      </div>
                      <Switch
                        id="vehicle-alerts"
                        checked={notifications.vehicleAlerts}
                        onCheckedChange={() => handleNotificationChange('vehicleAlerts')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance-reminders" className="text-base">Maintenance Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders for scheduled maintenance
                        </p>
                      </div>
                      <Switch
                        id="maintenance-reminders"
                        checked={notifications.maintenanceReminders}
                        onCheckedChange={() => handleNotificationChange('maintenanceReminders')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="driver-updates" className="text-base">Driver Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about driver check-ins and status changes
                        </p>
                      </div>
                      <Switch
                        id="driver-updates"
                        checked={notifications.driverUpdates}
                        onCheckedChange={() => handleNotificationChange('driverUpdates')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly-reports" className="text-base">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly fleet performance reports
                        </p>
                      </div>
                      <Switch
                        id="weekly-reports"
                        checked={notifications.weeklyReports}
                        onCheckedChange={() => handleNotificationChange('weeklyReports')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
