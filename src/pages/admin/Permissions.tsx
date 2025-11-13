import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Key, Search, Plus, Edit, Trash2, Lock, MoreHorizontal } from "lucide-react";
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
  usePermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
  PermissionDTO,
  PermissionCreateDTO,
  PermissionUpdateDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Validation schema for add/edit permission
const permissionSchema = z.object({
  name: z.string()
    .trim()
    .min(3, { message: "Permission name must be at least 3 characters" })
    .max(100, { message: "Permission name must be less than 100 characters" }),
  description: z.string()
    .trim()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
});

type PermissionFormValues = z.infer<typeof permissionSchema>;

export default function Permissions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionDTO | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<PermissionDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: permissionsResponse, isLoading, error } = usePermissions(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();
  const deleteMutation = useDeletePermission();

  const permissions = permissionsResponse?.data || [];

  // Add permission form
  const addPermissionForm = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Edit permission form
  const editPermissionForm = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onAddPermissionSubmit = (data: PermissionFormValues) => {
    createMutation.mutate({
      name: data.name,
      description: data.description,
    });
    setIsAddDialogOpen(false);
    addPermissionForm.reset();
  };

  const onEditPermissionSubmit = (data: PermissionFormValues) => {
    if (selectedPermission) {
      updateMutation.mutate({
        id: selectedPermission.id,
        name: data.name,
        description: data.description,
      });
    }
    setIsEditDialogOpen(false);
    setSelectedPermission(null);
    editPermissionForm.reset();
  };

  const handleEditPermission = (permission: PermissionDTO) => {
    setSelectedPermission(permission);
    editPermissionForm.reset({
      name: permission.name || "",
      description: permission.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (permission: PermissionDTO) => {
    setPermissionToDelete(permission);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (permissionToDelete) {
      deleteMutation.mutate(permissionToDelete.id);
      setIsDeleteDialogOpen(false);
      setPermissionToDelete(null);
    }
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns = useMemo<ColumnDef<PermissionDTO>[]>(
    () => [
      {
        header: "Permission",
        accessorKey: "name",
        cell: (permission) => (
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <span className="font-semibold">{permission.name}</span>
          </div>
        ),
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: (permission) => (
          <div className="max-w-sm">
            <p className="text-sm">
              {permission.description || "No description provided"}
            </p>
          </div>
        ),
      },
      {
        header: "Permission ID",
        accessorKey: "id",
        cell: (permission) => (
          <div className="text-sm font-mono text-muted-foreground">
            #{permission.id}
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (permission) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditPermission(permission)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(permission)}
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

  const PermissionFormFields = ({ form }: { form: any }) => (
    <>
      {/* Permission Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Permission Name *</FormLabel>
            <FormControl>
              <Input placeholder="READ_USERS, CREATE_ROLES, DELETE_PERMISSIONS" {...field} />
            </FormControl>
            <FormDescription>
              Use a descriptive name like READ_USERS or EDIT_CONFIGURATIONS
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe what this permission allows users to do..."
                {...field}
                rows={3}
              />
            </FormControl>
            <FormDescription>
              Provide a clear description of what this permission grants access to
            </FormDescription>
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
                  <Lock className="h-8 w-8 text-primary" />
                  Permission Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Define system permissions and access controls
                </p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Permission
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Permission</DialogTitle>
                    <DialogDescription>
                      Create a new system permission
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addPermissionForm}>
                    <form onSubmit={addPermissionForm.handleSubmit(onAddPermissionSubmit)} className="space-y-6">
                      <PermissionFormFields form={addPermissionForm} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create Permission
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
                placeholder="Search by permission name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Permissions Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading permissions</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredPermissions}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit Permission Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md bg-background">
              <DialogHeader>
                <DialogTitle>Edit Permission</DialogTitle>
                <DialogDescription>
                  Update permission details
                </DialogDescription>
              </DialogHeader>

              <Form {...editPermissionForm}>
                <form onSubmit={editPermissionForm.handleSubmit(onEditPermissionSubmit)} className="space-y-6">
                  <PermissionFormFields form={editPermissionForm} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update Permission
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
                  This will permanently delete the permission "{permissionToDelete?.name}".
                  Any roles using this permission will lose this access right.
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