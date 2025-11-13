import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/DataTable";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Types
interface CountryData {
  countryId: number;
  code: string;
  countryName: string;
  status: string;
  remarks: string;
  createdDate: string;
}

interface StateData {
  stateId: number;
  code: string;
  stateName: string;
  country: CountryData;
  status: string;
  remarks: string;
  createdDate: string;
}

interface CityData {
  cityId: number;
  code: string;
  cityName: string;
  state: StateData;
  status: string;
  remarks: string;
  createdDate: string;
}

interface VehicleCategoryData {
  vehicleCategoryId: number;
  vehicleCategoryName: string;
  vehicleDescription: string;
  baseFare: number;
  ratePerKm: number;
  ratePerMinute: number;
  isActive: boolean;
}

interface BasePricingData {
  pricingId: number;
  vehicleCategoryId: number;
  vehicleCategoryName: string;
  city: CityData;
  baseFare: number;
  ratePerKm: number;
  ratePerMinute: number;
  minimumFare: number;
  nightCharges: number;
  tollFeeApplicable: boolean;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
}

// Form schema
const formSchema = z.object({
  vehicleCategoryId: z.string().min(1, "Vehicle category is required"),
  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
  cityId: z.string().min(1, "City is required"),
  baseFare: z.string().min(1, "Base fare is required"),
  ratePerKm: z.string().min(1, "Rate per km is required"),
  ratePerMinute: z.string().min(1, "Rate per minute is required"),
  minimumFare: z.string().min(1, "Minimum fare is required"),
  nightCharges: z.string().min(1, "Night charges is required"),
  tollFeeApplicable: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export default function BasePricing() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<BasePricingData | null>(null);

  // Mock data
  const [pricingData, setPricingData] = useState<BasePricingData[]>([
    {
      pricingId: 1,
      vehicleCategoryId: 1,
      vehicleCategoryName: "Sedan",
      city: {
        cityId: 1,
        code: "NYC",
        cityName: "New York",
        state: {
          stateId: 1,
          code: "NY",
          stateName: "New York",
          country: {
            countryId: 1,
            code: "US",
            countryName: "United States",
            status: "Active",
            remarks: "",
            createdDate: "2024-01-01",
          },
          status: "Active",
          remarks: "",
          createdDate: "2024-01-01",
        },
        status: "Active",
        remarks: "",
        createdDate: "2024-01-01",
      },
      baseFare: 5.0,
      ratePerKm: 1.5,
      ratePerMinute: 0.3,
      minimumFare: 8.0,
      nightCharges: 2.0,
      tollFeeApplicable: true,
      isActive: true,
      createdBy: "admin",
      createdDate: "2024-01-15",
    },
    {
      pricingId: 2,
      vehicleCategoryId: 2,
      vehicleCategoryName: "SUV",
      city: {
        cityId: 1,
        code: "NYC",
        cityName: "New York",
        state: {
          stateId: 1,
          code: "NY",
          stateName: "New York",
          country: {
            countryId: 1,
            code: "US",
            countryName: "United States",
            status: "Active",
            remarks: "",
            createdDate: "2024-01-01",
          },
          status: "Active",
          remarks: "",
          createdDate: "2024-01-01",
        },
        status: "Active",
        remarks: "",
        createdDate: "2024-01-01",
      },
      baseFare: 8.0,
      ratePerKm: 2.0,
      ratePerMinute: 0.4,
      minimumFare: 12.0,
      nightCharges: 3.0,
      tollFeeApplicable: true,
      isActive: true,
      createdBy: "admin",
      createdDate: "2024-01-15",
    },
  ]);

  const [countries] = useState<CountryData[]>([
    {
      countryId: 1,
      code: "US",
      countryName: "United States",
      status: "Active",
      remarks: "",
      createdDate: "2024-01-01",
    },
    {
      countryId: 2,
      code: "UK",
      countryName: "United Kingdom",
      status: "Active",
      remarks: "",
      createdDate: "2024-01-01",
    },
  ]);

  const [states] = useState<StateData[]>([
    {
      stateId: 1,
      code: "NY",
      stateName: "New York",
      country: countries[0],
      status: "Active",
      remarks: "",
      createdDate: "2024-01-01",
    },
    {
      stateId: 2,
      code: "CA",
      stateName: "California",
      country: countries[0],
      status: "Active",
      remarks: "",
      createdDate: "2024-01-01",
    },
  ]);

  const [cities] = useState<CityData[]>([
    {
      cityId: 1,
      code: "NYC",
      cityName: "New York",
      state: states[0],
      status: "Active",
      remarks: "",
      createdDate: "2024-01-01",
    },
    {
      cityId: 2,
      code: "LA",
      cityName: "Los Angeles",
      state: states[1],
      status: "Active",
      remarks: "",
      createdDate: "2024-01-01",
    },
  ]);

  const [vehicleCategories] = useState<VehicleCategoryData[]>([
    {
      vehicleCategoryId: 1,
      vehicleCategoryName: "Sedan",
      vehicleDescription: "Standard sedan car",
      baseFare: 5.0,
      ratePerKm: 1.5,
      ratePerMinute: 0.3,
      isActive: true,
    },
    {
      vehicleCategoryId: 2,
      vehicleCategoryName: "SUV",
      vehicleDescription: "Sport utility vehicle",
      baseFare: 8.0,
      ratePerKm: 2.0,
      ratePerMinute: 0.4,
      isActive: true,
    },
  ]);

  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleCategoryId: "",
      countryId: "",
      stateId: "",
      cityId: "",
      baseFare: "",
      ratePerKm: "",
      ratePerMinute: "",
      minimumFare: "",
      nightCharges: "",
      tollFeeApplicable: false,
      isActive: true,
    },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const columns: ColumnDef<BasePricingData>[] = [
    {
      header: "Pricing ID",
      accessorKey: "pricingId",
    },
    {
      header: "Vehicle Category",
      accessorKey: "vehicleCategoryName",
    },
    {
      header: "City",
      accessorKey: "city",
      cell: (row) => row.city.cityName,
    },
    {
      header: "State",
      accessorKey: "city",
      cell: (row) => row.city.state.stateName,
    },
    {
      header: "Country",
      accessorKey: "city",
      cell: (row) => row.city.state.country.countryName,
    },
    {
      header: "Base Fare",
      accessorKey: "baseFare",
      cell: (row) => `$${row.baseFare.toFixed(2)}`,
    },
    {
      header: "Rate/Km",
      accessorKey: "ratePerKm",
      cell: (row) => `$${row.ratePerKm.toFixed(2)}`,
    },
    {
      header: "Rate/Min",
      accessorKey: "ratePerMinute",
      cell: (row) => `$${row.ratePerMinute.toFixed(2)}`,
    },
    {
      header: "Min Fare",
      accessorKey: "minimumFare",
      cell: (row) => `$${row.minimumFare.toFixed(2)}`,
    },
    {
      header: "Night Charges",
      accessorKey: "nightCharges",
      cell: (row) => `$${row.nightCharges.toFixed(2)}`,
    },
    {
      header: "Toll Fee",
      accessorKey: "tollFeeApplicable",
      cell: (row) => (
        <Badge variant={row.tollFeeApplicable ? "default" : "secondary"}>
          {row.tollFeeApplicable ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (row) => (
        <Badge variant={row.isActive ? "default" : "secondary"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Created Date",
      accessorKey: "createdDate",
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = pricingData.filter(
    (pricing) =>
      pricing.vehicleCategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pricing.city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pricing.city.state.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pricing.city.state.country.countryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (values: z.infer<typeof formSchema>) => {
    const selectedCity = cities.find((c) => c.cityId === parseInt(values.cityId));
    const selectedCategory = vehicleCategories.find(
      (vc) => vc.vehicleCategoryId === parseInt(values.vehicleCategoryId)
    );

    if (!selectedCity || !selectedCategory) return;

    const newPricing: BasePricingData = {
      pricingId: Math.max(...pricingData.map((p) => p.pricingId), 0) + 1,
      vehicleCategoryId: parseInt(values.vehicleCategoryId),
      vehicleCategoryName: selectedCategory.vehicleCategoryName,
      city: selectedCity,
      baseFare: parseFloat(values.baseFare),
      ratePerKm: parseFloat(values.ratePerKm),
      ratePerMinute: parseFloat(values.ratePerMinute),
      minimumFare: parseFloat(values.minimumFare),
      nightCharges: parseFloat(values.nightCharges),
      tollFeeApplicable: values.tollFeeApplicable,
      isActive: values.isActive,
      createdBy: "admin",
      createdDate: new Date().toISOString().split("T")[0],
    };

    setPricingData([...pricingData, newPricing]);
    setIsAddDialogOpen(false);
    addForm.reset();
    toast({
      title: "Success",
      description: "Base pricing added successfully",
    });
  };

  const handleEdit = (pricing: BasePricingData) => {
    setSelectedPricing(pricing);
    editForm.reset({
      vehicleCategoryId: pricing.vehicleCategoryId.toString(),
      countryId: pricing.city.state.country.countryId.toString(),
      stateId: pricing.city.state.stateId.toString(),
      cityId: pricing.city.cityId.toString(),
      baseFare: pricing.baseFare.toString(),
      ratePerKm: pricing.ratePerKm.toString(),
      ratePerMinute: pricing.ratePerMinute.toString(),
      minimumFare: pricing.minimumFare.toString(),
      nightCharges: pricing.nightCharges.toString(),
      tollFeeApplicable: pricing.tollFeeApplicable,
      isActive: pricing.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (values: z.infer<typeof formSchema>) => {
    if (!selectedPricing) return;

    const selectedCity = cities.find((c) => c.cityId === parseInt(values.cityId));
    const selectedCategory = vehicleCategories.find(
      (vc) => vc.vehicleCategoryId === parseInt(values.vehicleCategoryId)
    );

    if (!selectedCity || !selectedCategory) return;

    const updatedData = pricingData.map((pricing) =>
      pricing.pricingId === selectedPricing.pricingId
        ? {
            ...pricing,
            vehicleCategoryId: parseInt(values.vehicleCategoryId),
            vehicleCategoryName: selectedCategory.vehicleCategoryName,
            city: selectedCity,
            baseFare: parseFloat(values.baseFare),
            ratePerKm: parseFloat(values.ratePerKm),
            ratePerMinute: parseFloat(values.ratePerMinute),
            minimumFare: parseFloat(values.minimumFare),
            nightCharges: parseFloat(values.nightCharges),
            tollFeeApplicable: values.tollFeeApplicable,
            isActive: values.isActive,
          }
        : pricing
    );

    setPricingData(updatedData);
    setIsEditDialogOpen(false);
    setSelectedPricing(null);
    toast({
      title: "Success",
      description: "Base pricing updated successfully",
    });
  };

  const handleDeleteClick = (pricing: BasePricingData) => {
    setSelectedPricing(pricing);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedPricing) return;

    setPricingData(pricingData.filter((p) => p.pricingId !== selectedPricing.pricingId));
    setIsDeleteDialogOpen(false);
    setSelectedPricing(null);
    toast({
      title: "Success",
      description: "Base pricing deleted successfully",
    });
  };

  const [selectedCountryForAdd, setSelectedCountryForAdd] = useState<string>("");
  const [selectedStateForAdd, setSelectedStateForAdd] = useState<string>("");
  const [selectedCountryForEdit, setSelectedCountryForEdit] = useState<string>("");
  const [selectedStateForEdit, setSelectedStateForEdit] = useState<string>("");

  const filteredStatesForAdd = states.filter(
    (state) => state.country.countryId === parseInt(selectedCountryForAdd)
  );

  const filteredCitiesForAdd = cities.filter(
    (city) => city.state.stateId === parseInt(selectedStateForAdd)
  );

  const filteredStatesForEdit = states.filter(
    (state) => state.country.countryId === parseInt(selectedCountryForEdit)
  );

  const filteredCitiesForEdit = cities.filter(
    (city) => city.state.stateId === parseInt(selectedStateForEdit)
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Base Pricing</h1>
            <p className="text-muted-foreground">
              Configure base pricing for your fleet services
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Base Pricing
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Base Pricing List</CardTitle>
            <div className="flex items-center gap-2 mt-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle category, city, state, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={filteredData} />
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Base Pricing</DialogTitle>
              <DialogDescription>
                Add a new base pricing configuration
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="vehicleCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleCategories.map((category) => (
                            <SelectItem
                              key={category.vehicleCategoryId}
                              value={category.vehicleCategoryId.toString()}
                            >
                              {category.vehicleCategoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCountryForAdd(value);
                          addForm.setValue("stateId", "");
                          addForm.setValue("cityId", "");
                          setSelectedStateForAdd("");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.countryId}
                              value={country.countryId.toString()}
                            >
                              {country.countryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedStateForAdd(value);
                          addForm.setValue("cityId", "");
                        }}
                        defaultValue={field.value}
                        disabled={!selectedCountryForAdd}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredStatesForAdd.map((state) => (
                            <SelectItem
                              key={state.stateId}
                              value={state.stateId.toString()}
                            >
                              {state.stateName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedStateForAdd}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredCitiesForAdd.map((city) => (
                            <SelectItem
                              key={city.cityId}
                              value={city.cityId.toString()}
                            >
                              {city.cityName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="baseFare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Fare ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="ratePerKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate Per Km ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="ratePerMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate Per Minute ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="minimumFare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Fare ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="nightCharges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Night Charges ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addForm.control}
                  name="tollFeeApplicable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Toll Fee Applicable</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Pricing</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Base Pricing</DialogTitle>
              <DialogDescription>
                Update the base pricing configuration
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="vehicleCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleCategories.map((category) => (
                            <SelectItem
                              key={category.vehicleCategoryId}
                              value={category.vehicleCategoryId.toString()}
                            >
                              {category.vehicleCategoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCountryForEdit(value);
                          editForm.setValue("stateId", "");
                          editForm.setValue("cityId", "");
                          setSelectedStateForEdit("");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.countryId}
                              value={country.countryId.toString()}
                            >
                              {country.countryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedStateForEdit(value);
                          editForm.setValue("cityId", "");
                        }}
                        defaultValue={field.value}
                        disabled={!selectedCountryForEdit}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredStatesForEdit.map((state) => (
                            <SelectItem
                              key={state.stateId}
                              value={state.stateId.toString()}
                            >
                              {state.stateName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedStateForEdit}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredCitiesForEdit.map((city) => (
                            <SelectItem
                              key={city.cityId}
                              value={city.cityId.toString()}
                            >
                              {city.cityName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="baseFare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Fare ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="ratePerKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate Per Km ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="ratePerMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate Per Minute ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="minimumFare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Fare ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="nightCharges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Night Charges ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="tollFeeApplicable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Toll Fee Applicable</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Pricing</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete the base pricing for{" "}
                <span className="font-semibold">
                  {selectedPricing?.vehicleCategoryName}
                </span>{" "}
                in{" "}
                <span className="font-semibold">
                  {selectedPricing?.city.cityName}
                </span>
                . This action cannot be undone.
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
