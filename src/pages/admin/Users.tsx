import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Users as UsersIcon, Search, UserPlus, Mail, Shield, Phone, Calendar, Edit, User, Lock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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

// Validation schema for adding a new user
const addUserSchema = z.object({
  userName: z.string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be less than 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }),
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
    .regex(/^[+\d\s()-]+$/, { message: "Invalid phone number format" }),
  roles: z.array(z.string()).min(1, { message: "At least one role must be selected" }),
  activated: z.boolean().default(true),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

// Mock data matching AppUserVO structure
const usersData = [
  { 
    id: 1, 
    userName: "superadmin",
    firstName: "John", 
    lastName: "SuperAdmin",
    contactName: "John Super Admin",
    email: "john@aboosto.com", 
    contactNumber: "+234 801 234 5678",
    roles: [USER_ROLES.SUPER_ADMIN],
    lastLoginDate: "2025-01-10T08:30:00",
    isGoogleAccount: false,
    activated: true
  },
  { 
    id: 2, 
    userName: "sarah",
    firstName: "Sarah", 
    lastName: "Manager",
    contactName: "Sarah Manager",
    email: "sarah@aboosto.com", 
    contactNumber: "+234 802 345 6789",
    roles: [USER_ROLES.ADMIN],
    lastLoginDate: "2025-01-09T14:20:00",
    isGoogleAccount: true,
    activated: true
  },
  { 
    id: 3, 
    userName: "mikestaff",
    firstName: "Mike", 
    lastName: "Staff",
    contactName: "Mike Staff",
    email: "mike@aboosto.com", 
    contactNumber: "+234 803 456 7890",
    roles: [USER_ROLES.USER],
    lastLoginDate: "2025-01-08T10:15:00",
    isGoogleAccount: false,
    activated: true
  },
  { 
    id: 4, 
    userName: "emma",
    firstName: "Emma", 
    lastName: "User",
    contactName: "Emma User",
    email: "emma@aboosto.com", 
    contactNumber: "+234 804 567 8901",
    roles: [USER_ROLES.USER],
    lastLoginDate: "2025-01-05T16:45:00",
    isGoogleAccount: false,
    activated: false
  },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Add user form
  const addUserForm = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      contactName: "",
      email: "",
      contactNumber: "",
      roles: [],
      activated: true,
    },
  });

  const onAddUserSubmit = (data: AddUserFormValues) => {
    // In production, this would call an API to create the user
    console.log("Adding user:", data);
    toast({
      title: "User Created",
      description: `User ${data.userName} has been successfully created.`,
    });
    setIsAddDialogOpen(false);
    addUserForm.reset();
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

  const filteredUsers = usersData.filter(user =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.contactNumber.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container px-4 py-8">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <UsersIcon className="h-8 w-8 text-primary" />
                  User Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage system users and their access
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account with the specified details and roles.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...addUserForm}>
                    <form onSubmit={addUserForm.handleSubmit(onAddUserSubmit)} className="space-y-6">
                      {/* Username */}
                      <FormField
                        control={addUserForm.control}
                        name="userName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="username" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Username can only contain letters, numbers, and underscores
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Password */}
                      <FormField
                        control={addUserForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Must be at least 8 characters with uppercase, lowercase, and numbers
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* First Name and Last Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={addUserForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
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
                          control={addUserForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
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

                      {/* Contact Name */}
                      <FormField
                        control={addUserForm.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name *</FormLabel>
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

                      {/* Email and Contact Number */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={addUserForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
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
                          control={addUserForm.control}
                          name="contactNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Number *</FormLabel>
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
                      </div>

                      {/* Roles Selection */}
                      <FormField
                        control={addUserForm.control}
                        name="roles"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>User Roles *</FormLabel>
                              <FormDescription>
                                Select one or more roles for this user
                              </FormDescription>
                            </div>
                            <div className="space-y-3">
                              {Object.entries(USER_ROLES).map(([key, value]) => (
                                <FormField
                                  key={value}
                                  control={addUserForm.control}
                                  name="roles"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={value}
                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 bg-muted/20"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(value)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, value])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (val) => val !== value
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                          <FormLabel className="flex items-center gap-2 cursor-pointer">
                                            <Shield className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{key.replace("_", " ")}</span>
                                          </FormLabel>
                                          <FormDescription>
                                            {value === USER_ROLES.SUPER_ADMIN && "Full system access with all permissions"}
                                            {value === USER_ROLES.ADMIN && "Administrative access with most permissions"}
                                            {value === USER_ROLES.USER && "Standard user access with limited permissions"}
                                          </FormDescription>
                                        </div>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Activated Status */}
                      <FormField
                        control={addUserForm.control}
                        name="activated"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-md border border-border p-4 bg-muted/20">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Activate Account</FormLabel>
                              <FormDescription>
                                Enable this account immediately upon creation
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAddDialogOpen(false);
                            addUserForm.reset();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create User
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-900">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>A list of all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {user.contactName}
                              {user.isGoogleAccount && (
                                <Badge variant="outline" className="text-xs">Google</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">@{user.userName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {user.contactNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge key={role} className={getRoleBadgeVariant(role)}>
                              <Shield className="h-3 w-3 mr-1" />
                              {formatRole(role)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{new Date(user.lastLoginDate).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            user.activated
                              ? "bg-green-500" 
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {user.activated ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Users;
