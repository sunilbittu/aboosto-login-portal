import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Car, Search, Plus, Edit, Trash2, Users, Briefcase, DollarSign, MoreHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { DataTable, ColumnDef } from "@/components/DataTable";
import {
  useVehicleCategories,
  useCreateVehicleCategory,
  useUpdateVehicleCategory,
  useDeleteVehicleCategory,
  useToggleVehicleCategoryStatus,
  VehicleCategoryDTO
} from "@/services/queryService";
import { Pageable } from "@/services/apiService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Use the imported VehicleCategoryDTO type

// Validation schema for add/edit vehicle category
const vehicleCategorySchema = z.object({
  vehicleCategoryName: z.string()
    .trim()
    .min(2, { message: "Category name must be at least 2 characters" })
    .max(50, { message: "Category name must be less than 50 characters" }),
  vehicleDescription: z.string()
    .trim()
    .min(5, { message: "Description must be at least 5 characters" })
    .max(200, { message: "Description must be less than 200 characters" }),
  maxPassengerCount: z.number()
    .int()
    .min(1, { message: "Must have at least 1 passenger" })
    .max(50, { message: "Maximum 50 passengers" }),
  maxLuggageVolume: z.number()
    .min(0, { message: "Luggage volume cannot be negative" })
    .max(1000, { message: "Maximum 1000 cubic units" }),
  baseFare: z.number()
    .min(0, { message: "Base fare cannot be negative" })
    .max(10000, { message: "Base fare too high" }),
  ratePerKm: z.number()
    .min(0, { message: "Rate per km cannot be negative" })
    .max(1000, { message: "Rate per km too high" }),
  ratePerMinute: z.number()
    .min(0, { message: "Rate per minute cannot be negative" })
    .max(100, { message: "Rate per minute too high" }),
  cancellationFee: z.number()
    .min(0, { message: "Cancellation fee cannot be negative" })
    .max(1000, { message: "Cancellation fee too high" }),
  waitTimeLimit: z.number()
    .min(0, { message: "Wait time limit cannot be negative" })
    .max(60, { message: "Maximum 60 minutes" }),
  vehicleIcon: z.string()
    .trim()
    .max(100, { message: "Icon URL must be less than 100 characters" })
    .optional(),
  isActive: z.boolean(),
});

type VehicleCategoryFormValues = z.infer<typeof vehicleCategorySchema>;


export default function VehicleCategory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategoryDTO | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<VehicleCategoryDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: categoriesResponse, isLoading, error } = useVehicleCategories(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const createMutation = useCreateVehicleCategory();
  const updateMutation = useUpdateVehicleCategory();
  const deleteMutation = useDeleteVehicleCategory();
  const toggleStatusMutation = useToggleVehicleCategoryStatus();

  const categories = categoriesResponse?.data || [];

  // Add category form
  const addCategoryForm = useForm<VehicleCategoryFormValues>({
    resolver: zodResolver(vehicleCategorySchema),
    defaultValues: {
      vehicleCategoryName: "",
      vehicleDescription: "",
      maxPassengerCount: 4,
      maxLuggageVolume: 2.5,
      baseFare: 0,
      ratePerKm: 0,
      ratePerMinute: 0,
      cancellationFee: 0,
      waitTimeLimit: 5,
      vehicleIcon: "",
      isActive: true,
    },
  });

  // Edit category form
  const editCategoryForm = useForm<VehicleCategoryFormValues>({
    resolver: zodResolver(vehicleCategorySchema),
    defaultValues: {
      vehicleCategoryName: "",
      vehicleDescription: "",
      maxPassengerCount: 4,
      maxLuggageVolume: 2.5,
      baseFare: 0,
      ratePerKm: 0,
      ratePerMinute: 0,
      cancellationFee: 0,
      waitTimeLimit: 5,
      vehicleIcon: "",
      isActive: true,
    },
  });

  const onAddCategorySubmit = (data: VehicleCategoryFormValues) => {
    createMutation.mutate({
      vehicleCategoryName: data.vehicleCategoryName,
      vehicleDescription: data.vehicleDescription,
      maxPassengerCount: data.maxPassengerCount,
      maxLuggageVolume: data.maxLuggageVolume,
      baseFare: data.baseFare,
      ratePerKm: data.ratePerKm,
      ratePerMinute: data.ratePerMinute,
      cancellationFee: data.cancellationFee,
      waitTimeLimit: data.waitTimeLimit,
      vehicleIcon: data.vehicleIcon,
      isActive: data.isActive,
    });
    setIsAddDialogOpen(false);
    addCategoryForm.reset();
  };

  const onEditCategorySubmit = (data: VehicleCategoryFormValues) => {
    if (selectedCategory) {
      updateMutation.mutate({
        id: selectedCategory.vehicleCategoryId!,
        data: {
          vehicleCategoryId: selectedCategory.vehicleCategoryId,
          vehicleCategoryName: data.vehicleCategoryName,
          vehicleDescription: data.vehicleDescription,
          maxPassengerCount: data.maxPassengerCount,
          maxLuggageVolume: data.maxLuggageVolume,
          baseFare: data.baseFare,
          ratePerKm: data.ratePerKm,
          ratePerMinute: data.ratePerMinute,
          cancellationFee: data.cancellationFee,
          waitTimeLimit: data.waitTimeLimit,
          vehicleIcon: data.vehicleIcon,
          isActive: data.isActive,
        },
      });
    }
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
    editCategoryForm.reset();
  };

  const handleEditCategory = (category: VehicleCategoryDTO) => {
    setSelectedCategory(category);
    editCategoryForm.reset({
      vehicleCategoryName: category.vehicleCategoryName || "",
      vehicleDescription: category.vehicleDescription || "",
      maxPassengerCount: category.maxPassengerCount || 4,
      maxLuggageVolume: category.maxLuggageVolume || 2.5,
      baseFare: category.baseFare || 0,
      ratePerKm: category.ratePerKm || 0,
      ratePerMinute: category.ratePerMinute || 0,
      cancellationFee: category.cancellationFee || 0,
      waitTimeLimit: category.waitTimeLimit || 5,
      vehicleIcon: category.vehicleIcon || "",
      isActive: category.isActive ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (category: VehicleCategoryDTO) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.vehicleCategoryId!);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleToggleStatus = (category: VehicleCategoryDTO) => {
    toggleStatusMutation.mutate(category.vehicleCategoryId!);
  };

  const filteredCategories = categories.filter(category =>
    category.vehicleCategoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.vehicleDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns = useMemo<ColumnDef<VehicleCategoryDTO>[]>(
    () => [
      {
        header: "Category",
        accessorKey: "vehicleCategoryName",
        cell: (category) => (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.vehicleIcon || "🚗"}</span>
            <div>
              <div className="font-semibold">{category.vehicleCategoryName || "N/A"}</div>
              <div className="text-xs text-muted-foreground">{category.vehicleDescription || "No description"}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Capacity",
        sortable: false,
        cell: (category) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span>{category.maxPassengerCount || 0} passengers</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span>{category.maxLuggageVolume || 0} cu.ft</span>
            </div>
          </div>
        ),
      },
      {
        header: "Base Fare",
        accessorKey: "baseFare",
        cell: (category) => (
          <div className="flex items-center gap-1 font-semibold text-primary">
            <DollarSign className="h-3 w-3" />
            {(category.baseFare || 0).toFixed(2)}
          </div>
        ),
      },
      {
        header: "Rate/Km",
        accessorKey: "ratePerKm",
        cell: (category) => (
          <div className="text-sm">
            ${(category.ratePerKm || 0).toFixed(2)}
          </div>
        ),
      },
      {
        header: "Rate/Min",
        accessorKey: "ratePerMinute",
        cell: (category) => (
          <div className="text-sm">
            ${(category.ratePerMinute || 0).toFixed(2)}
          </div>
        ),
      },
      {
        header: "Cancellation Fee",
        accessorKey: "cancellationFee",
        cell: (category) => (
          <div className="text-sm text-muted-foreground">
            ${(category.cancellationFee || 0).toFixed(2)}
          </div>
        ),
      },
      {
        header: "Wait Time",
        accessorKey: "waitTimeLimit",
        cell: (category) => (
          <div className="text-sm">
            {category.waitTimeLimit || 0} min
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: (category) => (
          <Badge className={category.isActive ? "bg-green-500" : "bg-muted text-muted-foreground"}>
            {category.isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (category) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatus(category)}>
                <Switch className="h-4 w-4 mr-2" />
                {category.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(category)}
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

  const CategoryFormFields = ({ form }: { form: any }) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Name */}
        <FormField
          control={form.control}
          name="vehicleCategoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name *</FormLabel>
              <FormControl>
                <Input placeholder="Economy, Premium, SUV" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Icon */}
        <FormField
          control={form.control}
          name="vehicleIcon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Icon (Emoji)</FormLabel>
              <FormControl>
                <Input placeholder="🚗 🚙 🚐" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Description */}
      <FormField
        control={form.control}
        name="vehicleDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Brief description of this vehicle category..." 
                {...field} 
                rows={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Max Passenger Count */}
        <FormField
          control={form.control}
          name="maxPassengerCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Passengers *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="4" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Luggage Volume */}
        <FormField
          control={form.control}
          name="maxLuggageVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Luggage (cu.ft) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1"
                  placeholder="2.5" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="border-t pt-4 mt-2">
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Pricing Configuration
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base Fare */}
          <FormField
            control={form.control}
            name="baseFare"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Fare ($) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="50.00" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Initial charge for the ride</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rate Per Km */}
          <FormField
            control={form.control}
            name="ratePerKm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate per Km ($) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="10.00" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Charge per kilometer</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rate Per Minute */}
          <FormField
            control={form.control}
            name="ratePerMinute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate per Minute ($) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="2.00" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Charge per minute of ride</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cancellation Fee */}
          <FormField
            control={form.control}
            name="cancellationFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Fee ($) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="25.00" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Fee for ride cancellation</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Wait Time Limit */}
          <FormField
            control={form.control}
            name="waitTimeLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Wait Time (min) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.5"
                    placeholder="5" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Free wait time before charges</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Is Active */}
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active Status</FormLabel>
              <FormDescription>
                Enable this category for new ride bookings
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
                  <Car className="h-8 w-8 text-primary" />
                  Vehicle Category Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage vehicle types, capacity, and pricing
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Vehicle Category</DialogTitle>
                    <DialogDescription>
                      Create a new vehicle category with pricing and specifications
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...addCategoryForm}>
                    <form onSubmit={addCategoryForm.handleSubmit(onAddCategorySubmit)} className="space-y-4">
                      <CategoryFormFields form={addCategoryForm} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create Category
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
                placeholder="Search by category name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading vehicle categories</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredCategories}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit Category Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Edit Vehicle Category</DialogTitle>
                <DialogDescription>
                  Update vehicle category information and pricing
                </DialogDescription>
              </DialogHeader>
              
              <Form {...editCategoryForm}>
                <form onSubmit={editCategoryForm.handleSubmit(onEditCategorySubmit)} className="space-y-4">
                  <CategoryFormFields form={editCategoryForm} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update Category
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
                  This will permanently delete the vehicle category "{categoryToDelete?.vehicleCategoryName}".
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
