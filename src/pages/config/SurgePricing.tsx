import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, Search, Plus, Edit, Trash2, Car, MapPin, Clock, MoreHorizontal } from "lucide-react";
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
  useSurgePricingList,
  useActiveVehicleCategoriesList,
  useCitiesList,
  useCreateSurgePricing,
  useUpdateSurgePricing,
  useDeleteSurgePricing,
  useToggleSurgePricingStatus,
  SurgePricingDTO,
  VehicleCategoryDTO,
  CityMasterDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Validation schema for add/edit surge pricing
const surgePricingSchema = z.object({
  vehicleCategoryId: z.number({ required_error: "Please select a vehicle category" }),
  cityId: z.number({ required_error: "Please select a city" }),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)" }),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)" }),
  surgeMultiplier: z.number()
    .min(1, { message: "Surge multiplier must be at least 1.0" })
    .max(10, { message: "Surge multiplier cannot exceed 10.0" }),
  dayOfWeek: z.string({ required_error: "Please select a day" }),
  maxSurgeCap: z.number()
    .min(0, { message: "Max surge cap cannot be negative" })
    .max(1000, { message: "Max surge cap too high" })
    .optional(),
  isActive: z.boolean(),
});

type SurgePricingFormValues = z.infer<typeof surgePricingSchema>;

const daysOfWeek = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
];

export default function SurgePricing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<SurgePricingDTO | null>(null);
  const [pricingToDelete, setPricingToDelete] = useState<SurgePricingDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: pricingResponse, isLoading, error } = useSurgePricingList(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const { data: vehicleCategoriesResponse } = useActiveVehicleCategoriesList();
  const { data: citiesResponse } = useCitiesList();

  const createMutation = useCreateSurgePricing();
  const updateMutation = useUpdateSurgePricing();
  const deleteMutation = useDeleteSurgePricing();
  const toggleStatusMutation = useToggleSurgePricingStatus();

  const pricingList = pricingResponse?.data || [];
  const vehicleCategories = vehicleCategoriesResponse?.data || [];
  const cities = citiesResponse?.data || [];

  // Add pricing form
  const addPricingForm = useForm<SurgePricingFormValues>({
    resolver: zodResolver(surgePricingSchema),
    defaultValues: {
      vehicleCategoryId: undefined,
      cityId: undefined,
      startTime: "08:00",
      endTime: "10:00",
      surgeMultiplier: 1.5,
      dayOfWeek: "MONDAY",
      maxSurgeCap: 100,
      isActive: true,
    },
  });

  // Edit pricing form
  const editPricingForm = useForm<SurgePricingFormValues>({
    resolver: zodResolver(surgePricingSchema),
    defaultValues: {
      vehicleCategoryId: undefined,
      cityId: undefined,
      startTime: "08:00",
      endTime: "10:00",
      surgeMultiplier: 1.5,
      dayOfWeek: "MONDAY",
      maxSurgeCap: 100,
      isActive: true,
    },
  });

  const timeToString = (time?: { hour?: number; minute?: number }) => {
    if (!time) return "00:00";
    const hour = time.hour || 0;
    const minute = time.minute || 0;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const onAddPricingSubmit = (data: SurgePricingFormValues) => {
    const selectedVehicleCategory = vehicleCategories.find(v => v.vehicleCategoryId === data.vehicleCategoryId);
    const selectedCity = cities.find(c => c.cityId === data.cityId);

    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);

    createMutation.mutate({
      vehicleCategoryId: data.vehicleCategoryId,
      city: selectedCity,
      startTime: { hour: startHour, minute: startMinute, second: 0, nano: 0 },
      endTime: { hour: endHour, minute: endMinute, second: 0, nano: 0 },
      surgeMultiplier: data.surgeMultiplier,
      dayOfWeek: data.dayOfWeek,
      maxSurgeCap: data.maxSurgeCap,
      isActive: data.isActive,
    });
    setIsAddDialogOpen(false);
    addPricingForm.reset();
  };

  const onEditPricingSubmit = (data: SurgePricingFormValues) => {
    if (selectedPricing) {
      const selectedVehicleCategory = vehicleCategories.find(v => v.vehicleCategoryId === data.vehicleCategoryId);
      const selectedCity = cities.find(c => c.cityId === data.cityId);

      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);

      updateMutation.mutate({
        id: selectedPricing.surgeRuleId!,
        data: {
          surgeRuleId: selectedPricing.surgeRuleId,
          vehicleCategoryId: data.vehicleCategoryId,
          city: selectedCity,
          startTime: { hour: startHour, minute: startMinute, second: 0, nano: 0 },
          endTime: { hour: endHour, minute: endMinute, second: 0, nano: 0 },
          surgeMultiplier: data.surgeMultiplier,
          dayOfWeek: data.dayOfWeek,
          maxSurgeCap: data.maxSurgeCap,
          isActive: data.isActive,
        },
      });
    }
    setIsEditDialogOpen(false);
    setSelectedPricing(null);
    editPricingForm.reset();
  };

  const handleEditPricing = (pricing: SurgePricingDTO) => {
    setSelectedPricing(pricing);
    editPricingForm.reset({
      vehicleCategoryId: pricing.vehicleCategoryId || undefined,
      cityId: pricing.city?.cityId || undefined,
      startTime: timeToString(pricing.startTime),
      endTime: timeToString(pricing.endTime),
      surgeMultiplier: pricing.surgeMultiplier || 1.5,
      dayOfWeek: pricing.dayOfWeek || "MONDAY",
      maxSurgeCap: pricing.maxSurgeCap || 100,
      isActive: pricing.isActive ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (pricing: SurgePricingDTO) => {
    setPricingToDelete(pricing);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (pricingToDelete) {
      deleteMutation.mutate(pricingToDelete.surgeRuleId!);
      setIsDeleteDialogOpen(false);
      setPricingToDelete(null);
    }
  };

  const handleToggleStatus = (pricing: SurgePricingDTO) => {
    toggleStatusMutation.mutate(pricing.surgeRuleId!);
  };

  const filteredPricing = pricingList.filter(pricing =>
    pricing.city?.cityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pricing.city?.state?.stateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pricing.city?.country?.countryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pricing.dayOfWeek?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: boolean) => {
    return status ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  // Define table columns
  const columns = useMemo<ColumnDef<SurgePricingDTO>[]>(
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
        header: "Day",
        accessorKey: "dayOfWeek",
        cell: (pricing) => (
          <Badge variant="outline">
            {pricing.dayOfWeek || "N/A"}
          </Badge>
        ),
      },
      {
        header: "Time Range",
        sortable: false,
        cell: (pricing) => (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{timeToString(pricing.startTime)} - {timeToString(pricing.endTime)}</span>
          </div>
        ),
      },
      {
        header: "Multiplier",
        accessorKey: "surgeMultiplier",
        cell: (pricing) => (
          <div className="flex items-center gap-1 font-semibold text-orange-500">
            <TrendingUp className="h-3 w-3" />
            {pricing.surgeMultiplier?.toFixed(1)}x
          </div>
        ),
      },
      {
        header: "Max Cap",
        accessorKey: "maxSurgeCap",
        cell: (pricing) => (
          <div className="text-sm text-muted-foreground">
            ${(pricing.maxSurgeCap || 0).toFixed(2)}
          </div>
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

  const SurgePricingFormFields = ({ form }: { form: any }) => (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Day of Week */}
        <FormField
          control={form.control}
          name="dayOfWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Time */}
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Time */}
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Surge Multiplier */}
        <FormField
          control={form.control}
          name="surgeMultiplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surge Multiplier *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  placeholder="1.5"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Multiplier for pricing during surge (1.0x - 10.0x)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Surge Cap */}
        <FormField
          control={form.control}
          name="maxSurgeCap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Surge Cap ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="100"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Maximum surge charge allowed</FormDescription>
              <FormMessage />
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
                Enable this surge pricing rule
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
                  <TrendingUp className="h-8 w-8 text-primary" />
                  Surge Pricing Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage dynamic pricing rules for peak demand periods
                </p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Surge Pricing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Surge Pricing Rule</DialogTitle>
                    <DialogDescription>
                      Set up surge pricing for specific times and days
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addPricingForm}>
                    <form onSubmit={addPricingForm.handleSubmit(onAddPricingSubmit)} className="space-y-4">
                      <SurgePricingFormFields form={addPricingForm} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create Surge Pricing
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
                placeholder="Search by city, state, country, or day..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Surge Pricing Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading surge pricing</p>
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

          {/* Edit Surge Pricing Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Edit Surge Pricing</DialogTitle>
                <DialogDescription>
                  Update surge pricing rule
                </DialogDescription>
              </DialogHeader>

              <Form {...editPricingForm}>
                <form onSubmit={editPricingForm.handleSubmit(onEditPricingSubmit)} className="space-y-4">
                  <SurgePricingFormFields form={editPricingForm} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update Surge Pricing
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
                  This will permanently delete the surge pricing rule for "{pricingToDelete?.city?.cityName}".
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