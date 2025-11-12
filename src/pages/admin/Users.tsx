import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users as UsersIcon, Search, UserPlus, Mail, Shield, Phone, Calendar, Edit } from "lucide-react";
import { useState } from "react";

// User roles enum matching AppUserVO
const USER_ROLES = {
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER"
} as const;

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
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
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
