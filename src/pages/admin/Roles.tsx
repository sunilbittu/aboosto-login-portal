import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Search, Plus, Edit, Trash2, Key, MoreHorizontal, Lock } from "lucide-react";
import { useState, useMemo } from "react";
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
import {
  useRoles,
  usePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  RoleDTO,
  RoleCreateDTO,
  RoleUpdateDTO,
  PermissionDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Validation schema for add/edit role
const roleSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Role name must be at least 2 characters" })
    .max(50, { message: "Role name must be less than 50 characters" }),
  permissions: z.array(z.number()).min(1, { message: "Please select at least one permission" }),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export default function Roles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDTO | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: rolesResponse, isLoading, error } = useRoles(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const { data: permissionsResponse } = usePermissions();

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const roles = rolesResponse?.data || [];
  const permissions = permissionsResponse?.data || [];

  // Add role form
  const addRoleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  // Edit role form
  const editRoleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  const onAddRoleSubmit = (data: RoleFormValues) => {
    createMutation.mutate({
      name: data.name,
      permissions: data.permissions,
    });
    setIsAddDialogOpen(false);
    addRoleForm.reset();
  };

  const onEditRoleSubmit = (data: RoleFormValues) => {
    if (selectedRole) {
      updateMutation.mutate({
        id: selectedRole.id,
        name: data.name,
        permissions: data.permissions,
      });
    }
    setIsEditDialogOpen(false);
    setSelectedRole(null);
    editRoleForm.reset();
  };

  const handleEditRole = (role: RoleDTO) => {
    setSelectedRole(role);
    const selectedPermissionIds = role.permissions?.map(p => p.id) || [];
    editRoleForm.reset({
      name: role.name || "",
      permissions: selectedPermissionIds,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (role: RoleDTO) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      deleteMutation.mutate(roleToDelete.id);
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.permissions?.some(permission =>
      permission.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getPermissionsText = (rolePermissions?: PermissionDTO[]) => {
    if (!rolePermissions || rolePermissions.length === 0) return "No permissions";
    if (rolePermissions.length <= 2) {
      return rolePermissions.map(p => p.name).join(", ");
    }
    return `${rolePermissions.length} permissions`;
  };

  // Define table columns
  const columns = useMemo<ColumnDef<RoleDTO>[]>(
    () => [
      {
        header: "Role Name",
        accessorKey: "name",
        cell: (role) => (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-semibold">{role.name}</span>
          </div>
        ),
      },
      {
        header: "Permissions",
        sortable: false,
        cell: (role) => (
          <div className="max-w-xs">
            <div className="flex flex-wrap gap-1">
              {role.permissions?.slice(0, 2).map((permission) => (
                <Badge key={permission.id} variant="secondary" className="text-xs">
                  {permission.name}
                </Badge>
              ))}
              {role.permissions && role.permissions.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{role.permissions.length - 2} more
                </Badge>
              )}
            </div>
            {role.permissions && role.permissions.length > 2 && (
              <p className="text-xs text-muted-foreground mt-1">
                Total: {role.permissions.length} permissions
              </p>
            )}
          </div>
        ),
      },
      {
        header: "Permission Count",
        sortable: false,
        cell: (role) => (
          <div className="text-center">
            <div className="text-lg font-semibold">{role.permissions?.length || 0}</div>
            <div className="text-xs text-muted-foreground">permissions</div>
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (role) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditRole(role)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(role)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const RoleFormFields = ({ form, availablePermissions }: { form: any; availablePermissions: PermissionDTO[] }) => (
    <>
      {/* Role Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role Name *</FormLabel>
            <FormControl>
              <Input placeholder="Manager, Administrator, Operator" {...field} />
            </FormControl>
            <FormDescription>
              Give this role a descriptive name
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Permissions */}
      <FormField
        control={form.control}
        name="permissions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Permissions *</FormLabel>
            <FormDescription>
              Select the permissions for this role
            </FormDescription>
            <ScrollArea className="h-64 w-full border rounded-md p-4">
              <div className="space-y-3">
                {availablePermissions.map((permission) => (
                  <FormField
                    key={permission.id}
                    control={form.control}
                    name="permissions"
                    render={() => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, permission.id])
                                : field.onChange(
                                    field.value?.filter((id) => id !== permission.id)
                                  );
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            {permission.name}
                          </FormLabel>
                          {permission.description && (
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
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
                  Define user roles and their associated permissions
                </p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>
                      Create a new role with specific permissions
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addRoleForm}>
                    <form onSubmit={addRoleForm.handleSubmit(onAddRoleSubmit)} className="space-y-6">
                      <RoleFormFields form={addRoleForm} availablePermissions={permissions} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create Role
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search Bar */}
            <div className="relative mt-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by role name or permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Roles Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading roles</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredRoles}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit Role Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md max-h-[90vh] bg-background">
              <DialogHeader>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogDescription>
                  Update role details and permissions
                </DialogDescription>
              </DialogHeader>

              <Form {...editRoleForm}>
                <form onSubmit={editRoleForm.handleSubmit(onEditRoleSubmit)} className="space-y-6">
                  <RoleFormFields form={editRoleForm} availablePermissions={permissions} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update Role
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="bg-background">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the role "{roleToDelete?.name}".
                  Any users assigned to this role will lose these permissions.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </DashboardLayout>
  );
}