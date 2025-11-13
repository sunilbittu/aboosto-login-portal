import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Shield, Plus, Edit, Trash2, Search, Lock, FileText } from "lucide-react";
import { useState, useMemo } from "react";
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
import { DataTable, ColumnDef } from "@/components/DataTable";

// Available permissions for the system
const AVAILABLE_PERMISSIONS = [
  // Fleet Management
  "View Vehicles",
  "Add Vehicle",
  "Edit Vehicle",
  "Delete Vehicle",
  // Driver Management
  "View Drivers",
  "Add Driver",
  "Edit Driver",
  "Assign Vehicle",
  // User Management
  "View Users",
  "Create User",
  "Edit User",
  "Delete User",
  // Reports
  "View Reports",
  "Export Reports",
  "Create Reports",
  // Configuration
  "Manage Countries",
  "Manage States",
  "Manage Cities",
  "Manage Vehicle Categories",
  "Manage Base Pricing",
  "Manage Surge Pricing",
  "Manage Promotions",
  "Manage Referrals",
  // Admin
  "Manage Roles",
  "Manage Permissions",
  "View Riders",
];

// Type for role data matching RolesDTO
type RoleData = {
  roleId: number;
  roleName: string;
  roleDescription: string;
  rolePermissions: string;
  permissions: string[];
  restricted: string[];
  isDeletedValue: boolean;
  remarks: string;
  status: string;
};

// Validation schema for add/edit role
const roleSchema = z.object({
  roleName: z.string()
    .trim()
    .min(2, { message: "Role name must be at least 2 characters" })
    .max(50, { message: "Role name must be less than 50 characters" }),
  roleDescription: z.string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
  rolePermissions: z.string()
    .trim()
    .min(5, { message: "Role permissions description must be at least 5 characters" })
    .max(200, { message: "Role permissions must be less than 200 characters" }),
  permissions: z.array(z.string()).min(1, { message: "At least one permission must be selected" }),
  restricted: z.array(z.string()).optional().default([]),
  remarks: z.string().optional().default(""),
  status: z.enum(["active", "inactive"]),
});

type RoleFormValues = z.infer<typeof roleSchema>;

// Mock data matching RolesDTO
const rolesData: RoleData[] = [
  { 
    roleId: 1, 
    roleName: "Super Admin", 
    roleDescription: "Full system access with all permissions",
    rolePermissions: "Complete control over all system features",
    permissions: ["View Vehicles", "Add Vehicle", "Edit Vehicle", "Delete Vehicle", "View Drivers", "Add Driver", "Edit Driver", "View Users", "Create User", "Edit User", "Delete User", "Manage Roles", "Manage Permissions"],
    restricted: [],
    isDeletedValue: false,
    remarks: "Primary administrator role",
    status: "active"
  },
  { 
    roleId: 2, 
    roleName: "Fleet Manager", 
    roleDescription: "Manages fleet operations and driver assignments",
    rolePermissions: "Fleet and driver management capabilities",
    permissions: ["View Vehicles", "Add Vehicle", "Edit Vehicle", "View Drivers", "Add Driver", "Edit Driver", "Assign Vehicle", "View Reports"],
    restricted: ["Delete Vehicle", "Delete User", "Manage Roles"],
    isDeletedValue: false,
    remarks: "Operational management role",
    status: "active"
  },
  { 
    roleId: 3, 
    roleName: "Staff", 
    roleDescription: "Basic operational access for daily tasks",
    rolePermissions: "Limited operational permissions",
    permissions: ["View Vehicles", "View Drivers", "View Users", "View Reports"],
    restricted: ["Delete User", "Manage Roles", "Manage Permissions", "Add Vehicle", "Edit Vehicle"],
    isDeletedValue: false,
    remarks: "Standard staff member",
    status: "active"
  },
  { 
    roleId: 4, 
    roleName: "Viewer", 
    roleDescription: "Read-only access to system data",
    rolePermissions: "View-only permissions",
    permissions: ["View Vehicles", "View Drivers", "View Reports"],
    restricted: ["Create User", "Edit User", "Delete User", "Manage Roles", "Add Vehicle", "Edit Vehicle", "Delete Vehicle"],
    isDeletedValue: false,
    remarks: "External viewer or auditor",
    status: "active"
  },
];

const Roles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleData | null>(null);
  const { toast } = useToast();

  // Add role form
  const addRoleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: "",
      roleDescription: "",
      rolePermissions: "",
      permissions: [],
      restricted: [],
      remarks: "",
      status: "active",
    },
  });

  // Edit role form
  const editRoleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: "",
      roleDescription: "",
      rolePermissions: "",
      permissions: [],
      restricted: [],
      remarks: "",
      status: "active",
    },
  });

  const onAddRoleSubmit = (data: RoleFormValues) => {
    console.log("Adding role:", data);
    toast({
      title: "Role Created",
      description: `Role "${data.roleName}" has been successfully created.`,
    });
    setIsAddDialogOpen(false);
    addRoleForm.reset();
  };

  const onEditRoleSubmit = (data: RoleFormValues) => {
    console.log("Updating role:", data);
    toast({
      title: "Role Updated",
      description: `Role "${data.roleName}" has been successfully updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedRole(null);
    editRoleForm.reset();
  };

  const handleEditRole = (role: RoleData) => {
    setSelectedRole(role);
    editRoleForm.reset({
      roleName: role.roleName,
      roleDescription: role.roleDescription,
      rolePermissions: role.rolePermissions,
      permissions: role.permissions,
      restricted: role.restricted,
      remarks: role.remarks,
      status: role.status as "active" | "inactive",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (role: RoleData) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      console.log("Deleting role:", roleToDelete.roleId);
      toast({
        title: "Role Deleted",
        description: `Role "${roleToDelete.roleName}" has been permanently deleted.`,
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === "active" 
      ? "bg-green-500" 
      : "bg-muted text-muted-foreground";
  };

  const filteredRoles = rolesData.filter(role =>
    role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.roleDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns = useMemo<ColumnDef<RoleData>[]>(
    () => [
      {
        header: "Role",
        accessorKey: "roleName",
        cell: (role) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-medium">{role.roleName}</div>
              <div className="text-sm text-muted-foreground">{role.rolePermissions}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Description",
        accessorKey: "roleDescription",
        cell: (role) => (
          <div className="max-w-md">
            <p className="text-sm">{role.roleDescription}</p>
          </div>
        ),
      },
      {
        header: "Permissions",
        accessorKey: "permissions",
        cell: (role) => (
          <div className="flex flex-wrap gap-1 max-w-md">
            {role.permissions.slice(0, 3).map((permission) => (
              <Badge key={permission} variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                {permission}
              </Badge>
            ))}
            {role.permissions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{role.permissions.length - 3} more
              </Badge>
            )}
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (role) => (
          <Badge className={getStatusBadgeClass(role.status)}>
            {role.status.toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (role) => (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditRole(role)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteClick(role)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container px-4 py-8">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <Shield className="h-8 w-8 text-primary" />
                  Role Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage user roles and access levels
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>
                      Define a new role with specific permissions and access levels
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...addRoleForm}>
                    <form onSubmit={addRoleForm.handleSubmit(onAddRoleSubmit)} className="space-y-6">
                      {/* Role Name */}
                      <FormField
                        control={addRoleForm.control}
                        name="roleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role Name *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="e.g., Fleet Manager" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Role Description */}
                      <FormField
                        control={addRoleForm.control}
                        name="roleDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the role and its responsibilities..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Role Permissions Description */}
                      <FormField
                        control={addRoleForm.control}
                        name="rolePermissions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permissions Summary *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Brief summary of permissions"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A short description of what this role can do
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Status */}
                      <FormField
                        control={addRoleForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Permissions */}
                      <FormField
                        control={addRoleForm.control}
                        name="permissions"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Permissions *</FormLabel>
                              <FormDescription>
                                Select the permissions this role should have
                              </FormDescription>
                            </div>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-4">
                              {AVAILABLE_PERMISSIONS.map((permission) => (
                                <FormField
                                  key={permission}
                                  control={addRoleForm.control}
                                  name="permissions"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={permission}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(permission)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, permission])
                                                : field.onChange(
                                                    field.value?.filter((val) => val !== permission)
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {permission.replace(/_/g, " ")}
                                        </FormLabel>
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

                      {/* Restricted Permissions */}
                      <FormField
                        control={addRoleForm.control}
                        name="restricted"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Restricted Permissions (Optional)</FormLabel>
                              <FormDescription>
                                Explicitly deny these permissions
                              </FormDescription>
                            </div>
                            <div className="space-y-2 max-h-[150px] overflow-y-auto border rounded-md p-4">
                              {AVAILABLE_PERMISSIONS.map((permission) => (
                                <FormField
                                  key={permission}
                                  control={addRoleForm.control}
                                  name="restricted"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={permission}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(permission)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...(field.value || []), permission])
                                                : field.onChange(
                                                    field.value?.filter((val) => val !== permission)
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {permission.replace(/_/g, " ")}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Remarks */}
                      <FormField
                        control={addRoleForm.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remarks (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Additional notes about this role..."
                                className="min-h-[60px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAddDialogOpen(false);
                            addRoleForm.reset();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Role
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
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Roles Table */}
          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-900">
            <CardHeader>
              <CardTitle>All Roles</CardTitle>
              <CardDescription>Manage system roles and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={filteredRoles} 
                columns={columns}
                pageSize={10}
                pageSizeOptions={[10, 25, 50]}
              />
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="bg-background">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Delete Role
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    Are you sure you want to delete the role{" "}
                    <span className="font-semibold text-foreground">
                      {roleToDelete?.roleName}
                    </span>?
                  </p>
                  <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                    <p className="text-sm font-medium text-destructive">
                      ⚠️ Warning: This action cannot be undone
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Users with this role will lose their access</li>
                      <li>• Role permissions will be revoked</li>
                      <li>• This action is irreversible</li>
                    </ul>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setRoleToDelete(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Role
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Edit Role Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogDescription>
                  Update role details and permissions
                </DialogDescription>
              </DialogHeader>
              
              <Form {...editRoleForm}>
                <form onSubmit={editRoleForm.handleSubmit(onEditRoleSubmit)} className="space-y-6">
                  {/* Role Name */}
                  <FormField
                    control={editRoleForm.control}
                    name="roleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Name *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g., Fleet Manager" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role Description */}
                  <FormField
                    control={editRoleForm.control}
                    name="roleDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the role and its responsibilities..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role Permissions Description */}
                  <FormField
                    control={editRoleForm.control}
                    name="rolePermissions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permissions Summary *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Brief summary of permissions"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A short description of what this role can do
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={editRoleForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Permissions */}
                  <FormField
                    control={editRoleForm.control}
                    name="permissions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Permissions *</FormLabel>
                          <FormDescription>
                            Select the permissions this role should have
                          </FormDescription>
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-4">
                          {AVAILABLE_PERMISSIONS.map((permission) => (
                            <FormField
                              key={permission}
                              control={editRoleForm.control}
                              name="permissions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={permission}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(permission)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, permission])
                                            : field.onChange(
                                                field.value?.filter((val) => val !== permission)
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                      {permission.replace(/_/g, " ")}
                                    </FormLabel>
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

                  {/* Restricted Permissions */}
                  <FormField
                    control={editRoleForm.control}
                    name="restricted"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Restricted Permissions (Optional)</FormLabel>
                          <FormDescription>
                            Explicitly deny these permissions
                          </FormDescription>
                        </div>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto border rounded-md p-4">
                          {AVAILABLE_PERMISSIONS.map((permission) => (
                            <FormField
                              key={permission}
                              control={editRoleForm.control}
                              name="restricted"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={permission}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(permission)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), permission])
                                            : field.onChange(
                                                field.value?.filter((val) => val !== permission)
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                      {permission.replace(/_/g, " ")}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Remarks */}
                  <FormField
                    control={editRoleForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about this role..."
                            className="min-h-[60px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setSelectedRole(null);
                        editRoleForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Role
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Roles;
