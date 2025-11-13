import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DataTable, ColumnDef } from "@/components/DataTable";
import { Plus, Edit, Trash2, Search, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const promotionSchema = z.object({
  vehicleCategoryId: z.string().min(1, "Vehicle category is required"),
  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
  cityId: z.string().min(1, "City is required"),
  promoCode: z.string().min(1, "Promo code is required").max(50),
  description: z.string().min(1, "Description is required"),
  discountType: z.string().min(1, "Discount type is required"),
  discountValue: z.string().min(1, "Discount value is required"),
  maxDiscountAmount: z.string().min(1, "Max discount amount is required"),
  validFrom: z.date({ required_error: "Valid from date is required" }),
  validTo: z.date({ required_error: "Valid to date is required" }),
  applicableUserType: z.string().min(1, "Applicable user type is required"),
  maxUsesPerUser: z.string().min(1, "Max uses per user is required"),
  isActive: z.boolean().default(true),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface Promotion {
  promoCodeId: number;
  vehicleCategoryId: number;
  vehicleCategoryName: string;
  cityName: string;
  stateName: string;
  countryName: string;
  promoCode: string;
  description: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount: number;
  validFrom: string;
  validTo: string;
  applicableUserType: string;
  maxUsesPerUser: number;
  totalRedemptions: number;
  isActive: boolean;
}

export default function Promotions() {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      promoCodeId: 1,
      vehicleCategoryId: 1,
      vehicleCategoryName: "Sedan",
      cityName: "Mumbai",
      stateName: "Maharashtra",
      countryName: "India",
      promoCode: "FIRST50",
      description: "50% off on first ride",
      discountType: "PERCENTAGE",
      discountValue: 50,
      maxDiscountAmount: 200,
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      applicableUserType: "NEW_USER",
      maxUsesPerUser: 1,
      totalRedemptions: 245,
      isActive: true,
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  // Mock data for dropdowns
  const [countries] = useState([{ id: "1", name: "India" }]);
  const [states] = useState([{ id: "1", name: "Maharashtra" }]);
  const [cities] = useState([{ id: "1", name: "Mumbai" }]);
  const [vehicleCategories] = useState([
    { id: "1", name: "Sedan" },
    { id: "2", name: "SUV" },
    { id: "3", name: "Hatchback" },
  ]);
  const discountTypes = ["PERCENTAGE", "FIXED_AMOUNT"];
  const userTypes = ["NEW_USER", "ALL_USERS", "PREMIUM_USERS"];

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      vehicleCategoryId: "",
      countryId: "",
      stateId: "",
      cityId: "",
      promoCode: "",
      description: "",
      discountType: "",
      discountValue: "",
      maxDiscountAmount: "",
      applicableUserType: "",
      maxUsesPerUser: "",
      isActive: true,
    },
  });

  const columns: ColumnDef<Promotion>[] = [
    {
      header: "Promo Code",
      accessorKey: "promoCode",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Discount",
      accessorKey: "discountValue",
      cell: (row: Promotion) => (
        <span>
          {row.discountType === "PERCENTAGE" ? `${row.discountValue}%` : `₹${row.discountValue}`}
          {row.maxDiscountAmount && ` (Max: ₹${row.maxDiscountAmount})`}
        </span>
      ),
    },
    {
      header: "Vehicle Category",
      accessorKey: "vehicleCategoryName",
    },
    {
      header: "City",
      accessorKey: "cityName",
    },
    {
      header: "Valid Period",
      accessorKey: "validFrom",
      cell: (row: Promotion) => (
        <span className="text-sm">
          {format(new Date(row.validFrom), "MMM dd, yyyy")} - {format(new Date(row.validTo), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      header: "User Type",
      accessorKey: "applicableUserType",
      cell: (row: Promotion) => (
        <span className="text-xs px-2 py-1 rounded-full bg-secondary">
          {row.applicableUserType.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Usage",
      accessorKey: "totalRedemptions",
      cell: (row: Promotion) => (
        <span className="text-sm">
          {row.totalRedemptions} / {row.maxUsesPerUser} per user
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (row: Promotion) => (
        <span className={`text-xs px-2 py-1 rounded-full ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "promoCodeId",
      cell: (row: Promotion) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = (data: PromotionFormData) => {
    const newPromotion: Promotion = {
      promoCodeId: promotions.length + 1,
      vehicleCategoryId: parseInt(data.vehicleCategoryId),
      vehicleCategoryName: vehicleCategories.find(v => v.id === data.vehicleCategoryId)?.name || "",
      cityName: cities.find(c => c.id === data.cityId)?.name || "",
      stateName: states.find(s => s.id === data.stateId)?.name || "",
      countryName: countries.find(c => c.id === data.countryId)?.name || "",
      promoCode: data.promoCode,
      description: data.description,
      discountType: data.discountType,
      discountValue: parseFloat(data.discountValue),
      maxDiscountAmount: parseFloat(data.maxDiscountAmount),
      validFrom: format(data.validFrom, "yyyy-MM-dd"),
      validTo: format(data.validTo, "yyyy-MM-dd"),
      applicableUserType: data.applicableUserType,
      maxUsesPerUser: parseInt(data.maxUsesPerUser),
      totalRedemptions: 0,
      isActive: data.isActive,
    };

    setPromotions([...promotions, newPromotion]);
    setIsAddDialogOpen(false);
    form.reset();
    toast({
      title: "Success",
      description: "Promotion created successfully",
    });
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    form.reset({
      vehicleCategoryId: promotion.vehicleCategoryId.toString(),
      countryId: "1",
      stateId: "1",
      cityId: "1",
      promoCode: promotion.promoCode,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue.toString(),
      maxDiscountAmount: promotion.maxDiscountAmount.toString(),
      validFrom: new Date(promotion.validFrom),
      validTo: new Date(promotion.validTo),
      applicableUserType: promotion.applicableUserType,
      maxUsesPerUser: promotion.maxUsesPerUser.toString(),
      isActive: promotion.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: PromotionFormData) => {
    if (!selectedPromotion) return;

    const updatedPromotions = promotions.map(p =>
      p.promoCodeId === selectedPromotion.promoCodeId
        ? {
            ...p,
            vehicleCategoryId: parseInt(data.vehicleCategoryId),
            vehicleCategoryName: vehicleCategories.find(v => v.id === data.vehicleCategoryId)?.name || "",
            cityName: cities.find(c => c.id === data.cityId)?.name || "",
            stateName: states.find(s => s.id === data.stateId)?.name || "",
            countryName: countries.find(c => c.id === data.countryId)?.name || "",
            promoCode: data.promoCode,
            description: data.description,
            discountType: data.discountType,
            discountValue: parseFloat(data.discountValue),
            maxDiscountAmount: parseFloat(data.maxDiscountAmount),
            validFrom: format(data.validFrom, "yyyy-MM-dd"),
            validTo: format(data.validTo, "yyyy-MM-dd"),
            applicableUserType: data.applicableUserType,
            maxUsesPerUser: parseInt(data.maxUsesPerUser),
            isActive: data.isActive,
          }
        : p
    );

    setPromotions(updatedPromotions);
    setIsEditDialogOpen(false);
    setSelectedPromotion(null);
    toast({
      title: "Success",
      description: "Promotion updated successfully",
    });
  };

  const handleDeleteClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedPromotion) return;

    setPromotions(promotions.filter(p => p.promoCodeId !== selectedPromotion.promoCodeId));
    setIsDeleteDialogOpen(false);
    setSelectedPromotion(null);
    toast({
      title: "Success",
      description: "Promotion deleted successfully",
    });
  };

  const filteredPromotions = promotions.filter(
    promotion =>
      promotion.promoCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.vehicleCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PromotionForm = ({ onSubmit }: { onSubmit: (data: PromotionFormData) => void }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="promoCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promo Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., FIRST50" {...field} className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {discountTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 50 or 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxDiscountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Discount Amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valid From</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validTo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valid To</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicableUserType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicable User Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxUsesPerUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Uses Per User</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter promotion description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable or disable this promotion
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Save Promotion</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Promotions</h1>
            <p className="text-muted-foreground">Create and manage promotional campaigns</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Promotion</DialogTitle>
                <DialogDescription>Create a new promotional code with discount rules</DialogDescription>
              </DialogHeader>
              <PromotionForm onSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Promotional Codes</CardTitle>
            <div className="flex items-center gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by promo code, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={filteredPromotions} />
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Promotion</DialogTitle>
              <DialogDescription>Update promotional code details</DialogDescription>
            </DialogHeader>
            <PromotionForm onSubmit={handleUpdate} />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the promotion "{selectedPromotion?.promoCode}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
