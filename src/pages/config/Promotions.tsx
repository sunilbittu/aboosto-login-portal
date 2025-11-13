import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Gift, Search, Plus, Edit, Trash2, Tag, MapPin, Car, MoreHorizontal, CalendarIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
  usePromotionsList,
  useActiveVehicleCategoriesList,
  useCitiesList,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
  useTogglePromotionStatus,
  PromotionsDTO,
  VehicleCategoryDTO,
  CityMasterDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Validation schema for add/edit promotion
const promotionSchema = z.object({
  promoCode: z.string()
    .trim()
    .min(2, { message: "Promo code must be at least 2 characters" })
    .max(20, { message: "Promo code must be less than 20 characters" })
    .toUpperCase(),
  vehicleCategoryId: z.number({ required_error: "Please select a vehicle category" }).optional(),
  cityId: z.number({ required_error: "Please select a city" }).optional(),
  description: z.string()
    .trim()
    .min(5, { message: "Description must be at least 5 characters" })
    .max(200, { message: "Description must be less than 200 characters" }),
  discountType: z.enum(["PERCENTAGE", "FIXED"], {
    required_error: "Please select a discount type",
  }),
  discountValue: z.number()
    .min(0, { message: "Discount value cannot be negative" })
    .max(10000, { message: "Discount value too high" }),
  maxDiscountAmount: z.number()
    .min(0, { message: "Max discount cannot be negative" })
    .max(10000, { message: "Max discount too high" })
    .optional(),
  validFrom: z.string({ required_error: "Please select a valid from date" }),
  validTo: z.string({ required_error: "Please select a valid to date" }),
  applicableUserType: z.enum(["ALL", "NEW", "EXISTING"], {
    required_error: "Please select user type",
  }),
  maxUsesPerUser: z.number()
    .min(1, { message: "Max uses per user must be at least 1" })
    .max(100, { message: "Max uses per user cannot exceed 100" })
    .optional(),
  isActive: z.boolean(),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

export default function Promotions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionsDTO | null>(null);
  const [promotionToDelete, setPromotionToDelete] = useState<PromotionsDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: promotionsResponse, isLoading, error } = usePromotionsList(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const { data: vehicleCategoriesResponse } = useActiveVehicleCategoriesList();
  const { data: citiesResponse } = useCitiesList();

  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const deleteMutation = useDeletePromotion();
  const toggleStatusMutation = useTogglePromotionStatus();

  const promotionsList = promotionsResponse?.data || [];
  const vehicleCategories = vehicleCategoriesResponse?.data || [];
  const cities = citiesResponse?.data || [];

  // Add promotion form
  const addPromotionForm = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      promoCode: "",
      vehicleCategoryId: undefined,
      cityId: undefined,
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      maxDiscountAmount: 0,
      validFrom: "",
      validTo: "",
      applicableUserType: "ALL",
      maxUsesPerUser: 1,
      isActive: true,
    },
  });

  // Edit promotion form
  const editPromotionForm = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      promoCode: "",
      vehicleCategoryId: undefined,
      cityId: undefined,
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      maxDiscountAmount: 0,
      validFrom: "",
      validTo: "",
      applicableUserType: "ALL",
      maxUsesPerUser: 1,
      isActive: true,
    },
  });

  const onAddPromotionSubmit = (data: PromotionFormValues) => {
    const selectedVehicleCategory = data.vehicleCategoryId ? vehicleCategories.find(v => v.vehicleCategoryId === data.vehicleCategoryId) : undefined;
    const selectedCity = data.cityId ? cities.find(c => c.cityId === data.cityId) : undefined;

    createMutation.mutate({
      promoCode: data.promoCode,
      vehicleCategoryId: data.vehicleCategoryId,
      city: selectedCity,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxDiscountAmount: data.maxDiscountAmount,
      validFrom: data.validFrom,
      validTo: data.validTo,
      applicableUserType: data.applicableUserType,
      maxUsesPerUser: data.maxUsesPerUser,
      isActive: data.isActive,
    });
    setIsAddDialogOpen(false);
    addPromotionForm.reset();
  };

  const onEditPromotionSubmit = (data: PromotionFormValues) => {
    if (selectedPromotion) {
      const selectedVehicleCategory = data.vehicleCategoryId ? vehicleCategories.find(v => v.vehicleCategoryId === data.vehicleCategoryId) : undefined;
      const selectedCity = data.cityId ? cities.find(c => c.cityId === data.cityId) : undefined;

      updateMutation.mutate({
        id: selectedPromotion.promoCodeId!,
        data: {
          promoCodeId: selectedPromotion.promoCodeId,
          promoCode: data.promoCode,
          vehicleCategoryId: data.vehicleCategoryId,
          city: selectedCity,
          description: data.description,
          discountType: data.discountType,
          discountValue: data.discountValue,
          maxDiscountAmount: data.maxDiscountAmount,
          validFrom: data.validFrom,
          validTo: data.validTo,
          applicableUserType: data.applicableUserType,
          maxUsesPerUser: data.maxUsesPerUser,
          isActive: data.isActive,
        },
      });
    }
    setIsEditDialogOpen(false);
    setSelectedPromotion(null);
    editPromotionForm.reset();
  };

  const handleEditPromotion = (promotion: PromotionsDTO) => {
    setSelectedPromotion(promotion);
    editPromotionForm.reset({
      promoCode: promotion.promoCode || "",
      vehicleCategoryId: promotion.vehicleCategoryId || undefined,
      cityId: promotion.city?.cityId || undefined,
      description: promotion.description || "",
      discountType: (promotion.discountType as "PERCENTAGE" | "FIXED") || "PERCENTAGE",
      discountValue: promotion.discountValue || 0,
      maxDiscountAmount: promotion.maxDiscountAmount || 0,
      validFrom: promotion.validFrom || "",
      validTo: promotion.validTo || "",
      applicableUserType: (promotion.applicableUserType as "ALL" | "NEW" | "EXISTING") || "ALL",
      maxUsesPerUser: promotion.maxUsesPerUser || 1,
      isActive: promotion.isActive ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (promotion: PromotionsDTO) => {
    setPromotionToDelete(promotion);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (promotionToDelete) {
      deleteMutation.mutate(promotionToDelete.promoCodeId!);
      setIsDeleteDialogOpen(false);
      setPromotionToDelete(null);
    }
  };

  const handleToggleStatus = (promotion: PromotionsDTO) => {
    toggleStatusMutation.mutate(promotion.promoCodeId!);
  };

  const filteredPromotions = promotionsList.filter(promotion =>
    promotion.promoCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promotion.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promotion.city?.cityName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: boolean) => {
    return status ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  const getDiscountTypeBadgeClass = (type: string) => {
    return type === "PERCENTAGE" ? "bg-blue-500" : "bg-purple-500";
  };

  // Define table columns
  const columns = useMemo<ColumnDef<PromotionsDTO>[]>(
    () => [
      {
        header: "Promo Code",
        accessorKey: "promoCode",
        cell: (promotion) => (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-semibold text-lg">{promotion.promoCode || "N/A"}</div>
              <div className="text-xs text-muted-foreground">{promotion.description || "No description"}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Discount",
        accessorKey: "discountType",
        cell: (promotion) => (
          <div>
            <Badge className={getDiscountTypeBadgeClass(promotion.discountType || "")}>
              {promotion.discountType === "PERCENTAGE" ? "%" : "$"}
            </Badge>
            <div className="font-semibold text-lg mt-1">
              {promotion.discountType === "PERCENTAGE"
                ? `${promotion.discountValue || 0}%`
                : `$${(promotion.discountValue || 0).toFixed(2)}`
              }
            </div>
            {promotion.maxDiscountAmount && promotion.discountType === "PERCENTAGE" && (
              <div className="text-xs text-muted-foreground">
                Max: ${promotion.maxDiscountAmount.toFixed(2)}
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Valid Period",
        sortable: false,
        cell: (promotion) => (
          <div className="text-sm">
            {promotion.validFrom && (
              <div>From: {new Date(promotion.validFrom).toLocaleDateString()}</div>
            )}
            {promotion.validTo && (
              <div>To: {new Date(promotion.validTo).toLocaleDateString()}</div>
            )}
          </div>
        ),
      },
      {
        header: "Applicable To",
        sortable: false,
        cell: (promotion) => (
          <div className="space-y-1">
            <Badge variant="outline">
              {promotion.applicableUserType || "ALL"}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {promotion.maxUsesPerUser ? `Max ${promotion.maxUsesPerUser} uses/user` : "Unlimited uses"}
            </div>
          </div>
        ),
      },
      {
        header: "Restrictions",
        sortable: false,
        cell: (promotion) => (
          <div className="space-y-1 text-sm">
            {promotion.vehicleCategoryId && (
              <div className="flex items-center gap-1">
                <Car className="h-3 w-3 text-muted-foreground" />
                <span>Specific Vehicle</span>
              </div>
            )}
            {promotion.cityId && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>{promotion.city?.cityName}</span>
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: (promotion) => (
          <Badge className={getStatusBadgeClass(promotion.isActive ?? false)}>
            {promotion.isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (promotion) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditPromotion(promotion)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatus(promotion)}>
                <Switch className="h-4 w-4 mr-2" />
                {promotion.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(promotion)}
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

  const PromotionFormFields = ({ form }: { form: any }) => (
    <>
      {/* Promo Code */}
      <FormField
        control={form.control}
        name="promoCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Promo Code *</FormLabel>
            <FormControl>
              <Input placeholder="SAVE20, WELCOME10" {...field} className="uppercase" />
            </FormControl>
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
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="20% off on your first ride..."
                {...field}
                rows={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Discount Type */}
        <FormField
          control={form.control}
          name="discountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount Value */}
        <FormField
          control={form.control}
          name="discountValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Value *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={field.value === 100 ? "1" : "0.01"}
                  min="0"
                  placeholder="20"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                {field.value === 100 ? "Percentage value" : "Amount in dollars"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Discount Amount (for percentage) */}
        {form.watch("discountType") === "PERCENTAGE" && (
          <FormField
            control={form.control}
            name="maxDiscountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Discount Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="50.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Maximum discount allowed</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Applicable User Type */}
        <FormField
          control={form.control}
          name="applicableUserType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applicable To *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ALL">All Users</SelectItem>
                  <SelectItem value="NEW">New Users Only</SelectItem>
                  <SelectItem value="EXISTING">Existing Users Only</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Category (Optional) */}
        <FormField
          control={form.control}
          name="vehicleCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Category (Optional)</FormLabel>
              <Select onValueChange={(value) => field.onChange(value ? Number(value) : undefined)} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {vehicleCategories.map((category) => (
                    <SelectItem key={category.vehicleId} value={category.vehicleCategoryId!.toString()}>
                      {category.vehicleCategoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Leave empty for all categories</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City (Optional) */}
        <FormField
          control={form.control}
          name="cityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City (Optional)</FormLabel>
              <Select onValueChange={(value) => field.onChange(value ? Number(value) : undefined)} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.cityId} value={city.cityId!.toString()}>
                      {city.cityName}, {city.state?.stateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Leave empty for all cities</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Uses Per User */}
        <FormField
          control={form.control}
          name="maxUsesPerUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Uses Per User *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>How many times a user can use this promo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Valid From */}
        <FormField
          control={form.control}
          name="validFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valid From *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? field.value.split('T')[0] : ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Valid To */}
        <FormField
          control={form.control}
          name="validTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valid To *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? field.value.split('T')[0] : ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
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
                Enable this promotion code for use
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
                  <Gift className="h-8 w-8 text-primary" />
                  Promotions Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage promotional codes and discount offers
                </p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Promotion</DialogTitle>
                    <DialogDescription>
                      Create a new promotional code with discount offers
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addPromotionForm}>
                    <form onSubmit={addPromotionForm.handleSubmit(onAddPromotionSubmit)} className="space-y-4">
                      <PromotionFormFields form={addPromotionForm} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create Promotion
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
                placeholder="Search by promo code or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Promotions Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading promotions</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredPromotions}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit Promotion Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Edit Promotion</DialogTitle>
                <DialogDescription>
                  Update promotion details and settings
                </DialogDescription>
              </DialogHeader>

              <Form {...editPromotionForm}>
                <form onSubmit={editPromotionForm.handleSubmit(onEditPromotionSubmit)} className="space-y-4">
                  <PromotionFormFields form={editPromotionForm} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update Promotion
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
                  This will permanently delete the promotion code "{promotionToDelete?.promoCode}".
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