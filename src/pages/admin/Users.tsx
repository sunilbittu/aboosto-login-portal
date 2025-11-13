import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users as UsersIcon, Search, UserPlus, Mail, Shield, Phone, Calendar, Edit, User, Lock, Trash2, MoreHorizontal } from "lucide-react";
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
  useAdminUsers,
  useCreateAdminUser,
  useUpdateAdminUser,
  useDeleteAdminUser,
  useToggleAdminUserStatus,
  AppUserVO,
  UserCreateDTO,
  UserUpdateDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// User roles enum matching AppUserVO
const USER_ROLES = {
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER"
} as const;

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Validation schema for add/edit user
const userSchema = z.object({
  userName: z.string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be less than 50 characters" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
    .optional(),
  firstName: z.string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" }),
  contactNumber: z.string()
    .trim()
    .min(10, { message: "Contact number must be at least 10 characters" })
    .max(20, { message: "Contact number must be less than 20 characters" }),
  roles: z.array(z.string()).min(1, { message: "Please select at least one role" }),
  activated: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUserVO | null>(null);
  const [userToDelete, setUserToDelete] = useState<AppUserVO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: usersResponse, isLoading, error } = useAdminUsers(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser();
  const deleteMutation = useDeleteAdminUser();
  const toggleStatusMutation = useToggleAdminUserStatus();

  const users = usersResponse?.data || [];

  // Add user form
  const addUserForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      roles: [],
      activated: true,
    },
  });

  // Edit user form
  const editUserForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      roles: [],
      activated: true,
    },
  });

  const onAddUserSubmit = (data: UserFormValues) => {
    if (!data.password) {
      addUserForm.setError("password", { message: "Password is required for new users" });
      return;
    }

    createMutation.mutate({
      userName: data.userName,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contactNumber: data.contactNumber,
      roles: data.roles,
    });
    setIsAddDialogOpen(false);
    addUserForm.reset();
  };

  const onEditUserSubmit = (data: UserFormValues) => {
    if (selectedUser) {
      updateMutation.mutate({
        id: selectedUser.id,
        data: {
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          contactNumber: data.contactNumber,
          roles: data.roles,
          activated: data.activated,
        },
      });
    }
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    editUserForm.reset();
  };

  const handleEditUser = (user: AppUserVO) => {
    setSelectedUser(user);
    editUserForm.reset({
      userName: user.userName || "",
      password: "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      contactNumber: user.contactNumber || "",
      roles: user.roles || [],
      activated: user.activated ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: AppUserVO) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleToggleStatus = (user: AppUserVO) => {
    toggleStatusMutation.mutate(user.id);
  };

  const filteredUsers = users.filter(user =>
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.contactNumber?.includes(searchQuery)
  );

  const getRoleBadgeColor = (roles: string[]) => {
    if (roles.includes(USER_ROLES.SUPER_ADMIN)) return "bg-red-500";
    if (roles.includes(USER_ROLES.ADMIN)) return "bg-blue-500";
    return "bg-gray-500";
  };

  const getRoleText = (roles: string[]) => {
    if (roles.includes(USER_ROLES.SUPER_ADMIN)) return "SUPER ADMIN";
    if (roles.includes(USER_ROLES.ADMIN)) return "ADMIN";
    return "USER";
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  // Define table columns
  const columns = useMemo<ColumnDef<AppUserVO>[]>(
    () => [
      {
        header: "User",
        accessorKey: "userName",
        cell: (user) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{user.userName}</div>
              <div className="text-sm text-muted-foreground">
                {user.firstName} {user.lastName}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Contact",
        sortable: false,
        cell: (user) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{user.contactNumber}</span>
            </div>
          </div>
        ),
      },
      {
        header: "Roles",
        accessorKey: "roles",
        cell: (user) => (
          <Badge className={getRoleBadgeColor(user.roles || [])}>
            {getRoleText(user.roles || [])}
          </Badge>
        ),
      },
      {
        header: "Google Account",
        accessorKey: "isGoogleAccount",
        cell: (user) => (
          <Badge variant={user.isGoogleAccount ? "default" : "secondary"}>
            {user.isGoogleAccount ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        header: "Last Login",
        accessorKey: "lastLoginDate",
        cell: (user) => (
          <div className="text-sm">
            {user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleDateString() : "Never"}
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "activated",
        cell: (user) => (
          <Badge className={user.activated ? "bg-green-500" : "bg-muted text-muted-foreground"}>
            {user.activated ? "ACTIVE" : "INACTIVE"}
          </Badge>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (user) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                <Switch className="h-4 w-4 mr-2" />
                {user.activated ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(user)}
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

  const UserFormFields = ({ form, isEdit = false }: { form: any; isEdit?: boolean }) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Username */}
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username *</FormLabel>
              <FormControl>
                <Input placeholder="john_doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password (only for new users) */}
        {!isEdit && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password *</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Number */}
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number *</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Roles */}
      <FormField
        control={form.control}
        name="roles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Roles *</FormLabel>
            <FormDescription>Select the roles for this user</FormDescription>
            <div className="space-y-2">
              {Object.entries(USER_ROLES).map(([key, value]) => (
                <FormField
                  key={value}
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, value])
                              : field.onChange(
                                  field.value?.filter((role) => role !== value)
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {key.replace('_', ' ')}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Activated Status */}
      {isEdit && (
        <FormField
          control={form.control}
          name="activated"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Whether this user account is active
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
      )}
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
                  <UsersIcon className="h-8 w-8 text-primary" />
                  User Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage system users and their access permissions
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
                      Create a new user account with appropriate roles
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addUserForm}>
                    <form onSubmit={addUserForm.handleSubmit(onAddUserSubmit)} className="space-y-4">
                      <UserFormFields form={addUserForm} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create User
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
                placeholder="Search by name, email, username, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading users</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredUsers}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user information and permissions
                </DialogDescription>
              </DialogHeader>

              <Form {...editUserForm}>
                <form onSubmit={editUserForm.handleSubmit(onEditUserSubmit)} className="space-y-4">
                  <UserFormFields form={editUserForm} isEdit={true} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update User
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
                  This will permanently delete the user "{userToDelete?.userName}" ({userToDelete?.firstName} {userToDelete?.lastName}).
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