import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Car, Search, Plus, Edit, Trash2, Users, Briefcase, DollarSign } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
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

// Type for vehicle category data matching VehicleCategoryDTO
type VehicleCategoryData = {
  vehicleCategoryId: number;
  vehicleCategoryName: string;
  vehicleDescription: string;
  maxPassengerCount: number;
  maxLuggageVolume: number;
  baseFare: number;
  ratePerKm: number;
  ratePerMinute: number;
  cancellationFee: number;
  waitTimeLimit: number;
  vehicleIcon: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  isDeletedValue: boolean;
  modifiedBy: string;
  modifiedDate: string;
};

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

// Mock vehicle categories data
const vehicleCategoriesData: VehicleCategoryData[] = [
  {
    vehicleCategoryId: 1,
    vehicleCategoryName: "Economy",
    vehicleDescription: "Affordable rides for everyday travel",
    maxPassengerCount: 4,
    maxLuggageVolume: 2.5,
    baseFare: 50.00,
    ratePerKm: 10.00,
    ratePerMinute: 2.00,
    cancellationFee: 25.00,
    waitTimeLimit: 5.0,
    vehicleIcon: "🚗",
    isActive: true,
    createdBy: "admin",
    createdDate: "2024-01-15T10:30:00Z",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-15T10:30:00Z",
  },
  {
    vehicleCategoryId: 2,
    vehicleCategoryName: "Premium",
    vehicleDescription: "Luxury rides with premium vehicles",
    maxPassengerCount: 4,
    maxLuggageVolume: 3.0,
    baseFare: 100.00,
    ratePerKm: 18.00,
    ratePerMinute: 3.50,
    cancellationFee: 50.00,
    waitTimeLimit: 10.0,
    vehicleIcon: "🚙",
    isActive: true,
    createdBy: "admin",
    createdDate: "2024-01-16T11:00:00Z",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-16T11:00:00Z",
  },
  {
    vehicleCategoryId: 3,
    vehicleCategoryName: "SUV",
    vehicleDescription: "Spacious rides for groups and families",
    maxPassengerCount: 6,
    maxLuggageVolume: 5.0,
    baseFare: 120.00,
    ratePerKm: 20.00,
    ratePerMinute: 4.00,
    cancellationFee: 60.00,
    waitTimeLimit: 10.0,
    vehicleIcon: "🚐",
    isActive: true,
    createdBy: "admin",
    createdDate: "2024-01-17T09:15:00Z",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-17T09:15:00Z",
  },
  {
    vehicleCategoryId: 4,
    vehicleCategoryName: "Electric",
    vehicleDescription: "Eco-friendly electric vehicles",
    maxPassengerCount: 4,
    maxLuggageVolume: 2.0,
    baseFare: 60.00,
    ratePerKm: 12.00,
    ratePerMinute: 2.50,
    cancellationFee: 30.00,
    waitTimeLimit: 5.0,
    vehicleIcon: "⚡",
    isActive: true,
    createdBy: "admin",
    createdDate: "2024-01-18T14:20:00Z",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-18T14:20:00Z",
  },
];

export default function VehicleCategory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategoryData | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<VehicleCategoryData | null>(null);
  const { toast } = useToast();

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
    console.log("Adding vehicle category:", data);
    toast({
      title: "Vehicle Category Created",
      description: `Category "${data.vehicleCategoryName}" has been successfully created.`,
    });
    setIsAddDialogOpen(false);
    addCategoryForm.reset();
  };

  const onEditCategorySubmit = (data: VehicleCategoryFormValues) => {
    console.log("Updating vehicle category:", data);
    toast({
      title: "Vehicle Category Updated",
      description: `Category "${data.vehicleCategoryName}" has been successfully updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
    editCategoryForm.reset();
  };

  const handleEditCategory = (category: VehicleCategoryData) => {
    setSelectedCategory(category);
    editCategoryForm.reset({
      vehicleCategoryName: category.vehicleCategoryName,
      vehicleDescription: category.vehicleDescription,
      maxPassengerCount: category.maxPassengerCount,
      maxLuggageVolume: category.maxLuggageVolume,
      baseFare: category.baseFare,
      ratePerKm: category.ratePerKm,
      ratePerMinute: category.ratePerMinute,
      cancellationFee: category.cancellationFee,
      waitTimeLimit: category.waitTimeLimit,
      vehicleIcon: category.vehicleIcon,
      isActive: category.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (category: VehicleCategoryData) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      console.log("Deleting vehicle category:", categoryToDelete.vehicleCategoryId);
      toast({
        title: "Vehicle Category Deleted",
        description: `Category "${categoryToDelete.vehicleCategoryName}" has been permanently deleted.`,
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const filteredCategories = vehicleCategoriesData.filter(category =>
    category.vehicleCategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.vehicleDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns = useMemo<ColumnDef<VehicleCategoryData>[]>(
    () => [
      {
        header: "Category",
        accessorKey: "vehicleCategoryName",
        cell: (category) => (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.vehicleIcon || "🚗"}</span>
            <div>
              <div className="font-semibold">{category.vehicleCategoryName}</div>
              <div className="text-xs text-muted-foreground">{category.vehicleDescription}</div>
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
              <span>{category.maxPassengerCount} passengers</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span>{category.maxLuggageVolume} cu.ft</span>
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
            {category.baseFare.toFixed(2)}
          </div>
        ),
      },
      {
        header: "Rate/Km",
        accessorKey: "ratePerKm",
        cell: (category) => (
          <div className="text-sm">
            ${category.ratePerKm.toFixed(2)}
          </div>
        ),
      },
      {
        header: "Rate/Min",
        accessorKey: "ratePerMinute",
        cell: (category) => (
          <div className="text-sm">
            ${category.ratePerMinute.toFixed(2)}
          </div>
        ),
      },
      {
        header: "Cancellation Fee",
        accessorKey: "cancellationFee",
        cell: (category) => (
          <div className="text-sm text-muted-foreground">
            ${category.cancellationFee.toFixed(2)}
          </div>
        ),
      },
      {
        header: "Wait Time",
        accessorKey: "waitTimeLimit",
        cell: (category) => (
          <div className="text-sm">
            {category.waitTimeLimit} min
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
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditCategory(category)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteClick(category)}
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
            <DataTable
              data={filteredCategories}
              columns={columns}
              pageSize={10}
            />
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
