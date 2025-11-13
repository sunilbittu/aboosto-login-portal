import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Search, Plus, Edit, Trash2, Car, MapPin, MoreHorizontal } from "lucide-react";
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
  useBasePricingList,
  useActiveVehicleCategoriesList,
  useCitiesList,
  useCreateBasePricing,
  useUpdateBasePricing,
  useDeleteBasePricing,
  useToggleBasePricingStatus,
  BasePricingDTO,
  VehicleCategoryDTO,
  CityMasterDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Validation schema for add/edit base pricing
const basePricingSchema = z.object({
  vehicleCategoryId: z.number({ required_error: "Please select a vehicle category" }),
  cityId: z.number({ required_error: "Please select a city" }),
  baseFare: z.number()
    .min(0, { message: "Base fare cannot be negative" })
    .max(10000, { message: "Base fare too high" }),
  ratePerKm: z.number()
    .min(0, { message: "Rate per km cannot be negative" })
    .max(1000, { message: "Rate per km too high" }),
  ratePerMinute: z.number()
    .min(0, { message: "Rate per minute cannot be negative" })
    .max(100, { message: "Rate per minute too high" }),
  minimumFare: z.number()
    .min(0, { message: "Minimum fare cannot be negative" })
    .max(1000, { message: "Minimum fare too high" })
    .optional(),
  nightCharges: z.number()
    .min(0, { message: "Night charges cannot be negative" })
    .max(500, { message: "Night charges too high" })
    .optional(),
  tollFeeApplicable: z.boolean(),
  isActive: z.boolean(),
});

type BasePricingFormValues = z.infer<typeof basePricingSchema>;

export default function BasePricing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<BasePricingDTO | null>(null);
  const [pricingToDelete, setPricingToDelete] = useState<BasePricingDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: pricingResponse, isLoading, error } = useBasePricingList(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const { data: vehicleCategoriesResponse } = useActiveVehicleCategoriesList();
  const { data: citiesResponse } = useCitiesList();

  const createMutation = useCreateBasePricing();
  const updateMutation = useUpdateBasePricing();
  const deleteMutation = useDeleteBasePricing();
  const toggleStatusMutation = useToggleBasePricingStatus();

  const pricingList = pricingResponse?.data || [];
  const vehicleCategories = vehicleCategoriesResponse?.data || [];
  const cities = citiesResponse?.data || [];

  // Add pricing form
  const addPricingForm = useForm<BasePricingFormValues>({
    resolver: zodResolver(basePricingSchema),
    defaultValues: {
      vehicleCategoryId: undefined,
      cityId: undefined,
      baseFare: 0,
      ratePerKm: 0,
      ratePerMinute: 0,
      minimumFare: 0,
      nightCharges: 0,
      tollFeeApplicable: false,
      isActive: true,
    },
  });

  // Edit pricing form
  const editPricingForm = useForm<BasePricingFormValues>({
    resolver: zodResolver(basePricingSchema),
    defaultValues: {
      vehicleCategoryId: undefined,
      cityId: undefined,
      baseFare: 0,
      ratePerKm: 0,
      ratePerMinute: 0,
      minimumFare: 0,
      nightCharges: 0,
      tollFeeApplicable: false,
      isActive: true,
    },
  });

  const onAddPricingSubmit = (data: BasePricingFormValues) => {
    const selectedVehicleCategory = vehicleCategories.find(v => v.vehicleCategoryId === data.vehicleCategoryId);
    const selectedCity = cities.find(c => c.cityId === data.cityId);

    createMutation.mutate({
      vehicleCategoryId: data.vehicleCategoryId,
      city: selectedCity,
      baseFare: data.baseFare,
      ratePerKm: data.ratePerKm,
      ratePerMinute: data.ratePerMinute,
      minimumFare: data.minimumFare,
      nightCharges: data.nightCharges,
      tollFeeApplicable: data.tollFeeApplicable,
      isActive: data.isActive,
    });
    setIsAddDialogOpen(false);
    addPricingForm.reset();
  };

  const onEditPricingSubmit = (data: BasePricingFormValues) => {
    if (selectedPricing) {
      const selectedVehicleCategory = vehicleCategories.find(v => v.vehicleCategoryId === data.vehicleCategoryId);
      const selectedCity = cities.find(c => c.cityId === data.cityId);

      updateMutation.mutate({
        id: selectedPricing.pricingId!,
        data: {
          pricingId: selectedPricing.pricingId,
          vehicleCategoryId: data.vehicleCategoryId,
          city: selectedCity,
          baseFare: data.baseFare,
          ratePerKm: data.ratePerKm,
          ratePerMinute: data.ratePerMinute,
          minimumFare: data.minimumFare,
          nightCharges: data.nightCharges,
          tollFeeApplicable: data.tollFeeApplicable,
          isActive: data.isActive,
        },
      });
    }
    setIsEditDialogOpen(false);
    setSelectedPricing(null);
    editPricingForm.reset();
  };

  const handleEditPricing = (pricing: BasePricingDTO) => {
    setSelectedPricing(pricing);
    editPricingForm.reset({
      vehicleCategoryId: pricing.vehicleCategoryId || undefined,
      cityId: pricing.city?.cityId || undefined,
      baseFare: pricing.baseFare || 0,
      ratePerKm: pricing.ratePerKm || 0,
      ratePerMinute: pricing.ratePerMinute || 0,
      minimumFare: pricing.minimumFare || 0,
      nightCharges: pricing.nightCharges || 0,
      tollFeeApplicable: pricing.tollFeeApplicable || false,
      isActive: pricing.isActive ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (pricing: BasePricingDTO) => {
    setPricingToDelete(pricing);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (pricingToDelete) {
      deleteMutation.mutate(pricingToDelete.pricingId!);
      setIsDeleteDialogOpen(false);
      setPricingToDelete(null);
    }
  };

  const handleToggleStatus = (pricing: BasePricingDTO) => {
    toggleStatusMutation.mutate(pricing.pricingId!);
  };

  const filteredPricing = pricingList.filter(pricing =>
    pricing.city?.cityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pricing.city?.state?.stateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pricing.city?.country?.countryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: boolean) => {
    return status ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  // Define table columns
  const columns = useMemo<ColumnDef<BasePricingDTO>[]>(
    () => [
      {
        header: "Location",
        accessorKey: "city",
        cell: (pricing) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-semibold">{pricing.city?.cityName || "N/A"}</div>
              <div className="text-xs text-muted-foreground">
                {pricing.city?.state?.stateName}, {pricing.city?.country?.countryName}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Base Fare",
        accessorKey: "baseFare",
        cell: (pricing) => (
          <div className="flex items-center gap-1 font-semibold text-primary">
            <DollarSign className="h-3 w-3" />
            {(pricing.baseFare || 0).toFixed(2)}
          </div>
        ),
      },
      {
        header: "Rate/Km",
        accessorKey: "ratePerKm",
        cell: (pricing) => (
          <div className="text-sm">
            ${(pricing.ratePerKm || 0).toFixed(2)}
          </div>
        ),
      },
      {
        header: "Rate/Min",
        accessorKey: "ratePerMinute",
        cell: (pricing) => (
          <div className="text-sm">
            ${(pricing.ratePerMinute || 0).toFixed(2)}
          </div>
        ),
      },
      {
        header: "Min. Fare",
        accessorKey: "minimumFare",
        cell: (pricing) => (
          <div className="text-sm text-muted-foreground">
            ${(pricing.minimumFare || 0).toFixed(2)}
          </div>
        ),
      },
      {
        header: "Night Charges",
        accessorKey: "nightCharges",
        cell: (pricing) => (
          <div className="text-sm text-muted-foreground">
            ${(pricing.nightCharges || 0).toFixed(2)}
          </div>
        ),
      },
      {
        header: "Toll Fee",
        accessorKey: "tollFeeApplicable",
        cell: (pricing) => (
          <Badge className={pricing.tollFeeApplicable ? "bg-blue-500" : "bg-muted text-muted-foreground"}>
            {pricing.tollFeeApplicable ? "APPLICABLE" : "NOT APPLICABLE"}
          </Badge>
        ),
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: (pricing) => (
          <Badge className={getStatusBadgeClass(pricing.isActive ?? false)}>
            {pricing.isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (pricing) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditPricing(pricing)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatus(pricing)}>
                <Switch className="h-4 w-4 mr-2" />
                {pricing.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(pricing)}
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

  const BasePricingFormFields = ({ form }: { form: any }) => (
    <>
      {/* Vehicle Category */}
      <FormField
        control={form.control}
        name="vehicleCategoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Category *</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {vehicleCategories.map((category) => (
                  <SelectItem key={category.vehicleId} value={category.vehicleCategoryId!.toString()}>
                    {category.vehicleCategoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={form.control}
        name="cityId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City *</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.cityId} value={city.cityId!.toString()}>
                    {city.cityName}, {city.state?.stateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
              <FormDescription>Charge per minute</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Minimum Fare */}
        <FormField
          control={form.control}
          name="minimumFare"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Fare ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="25.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Minimum charge for any ride</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Night Charges */}
        <FormField
          control={form.control}
          name="nightCharges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Night Charges ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="5.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Additional night time charges</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Toll Fee Applicable */}
        <FormField
          control={form.control}
          name="tollFeeApplicable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Toll Fee</FormLabel>
                <FormDescription>
                  Apply toll fees to rides
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
                Enable this pricing for new ride bookings
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
                  <DollarSign className="h-8 w-8 text-primary" />
                  Base Pricing Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage base pricing for different vehicle categories and locations
                </p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Base Pricing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Base Pricing</DialogTitle>
                    <DialogDescription>
                      Set up base pricing for a vehicle category in a specific location
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addPricingForm}>
                    <form onSubmit={addPricingForm.handleSubmit(onAddPricingSubmit)} className="space-y-4">
                      <BasePricingFormFields form={addPricingForm} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create Base Pricing
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
                placeholder="Search by city, state, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Base Pricing Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading base pricing</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredPricing}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit Base Pricing Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Edit Base Pricing</DialogTitle>
                <DialogDescription>
                  Update base pricing information
                </DialogDescription>
              </DialogHeader>

              <Form {...editPricingForm}>
                <form onSubmit={editPricingForm.handleSubmit(onEditPricingSubmit)} className="space-y-4">
                  <BasePricingFormFields form={editPricingForm} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update Base Pricing
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
                  This will permanently delete the base pricing for "{pricingToDelete?.city?.cityName}".
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