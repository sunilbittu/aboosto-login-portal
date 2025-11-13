import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Search, Plus, Edit, Trash2, MapPin, Globe, MoreHorizontal } from "lucide-react";
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
} from "@/components/ui/form";
import { DataTable, ColumnDef } from "@/components/DataTable";
import {
  useCities,
  useStatesList,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
  CityMasterDTO,
  StateMasterDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Validation schema for add/edit city
const citySchema = z.object({
  cityName: z.string()
    .trim()
    .min(2, { message: "City name must be at least 2 characters" })
    .max(100, { message: "City name must be less than 100 characters" }),
  code: z.string()
    .trim()
    .min(2, { message: "City code must be at least 2 characters" })
    .max(10, { message: "City code must be less than 10 characters" })
    .toUpperCase(),
  stateId: z.number({ required_error: "Please select a state" }),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status",
  }),
  remarks: z.string()
    .trim()
    .max(500, { message: "Remarks must be less than 500 characters" })
    .optional(),
});

type CityFormValues = z.infer<typeof citySchema>;

export default function City() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityMasterDTO | null>(null);
  const [cityToDelete, setCityToDelete] = useState<CityMasterDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: citiesResponse, isLoading, error } = useCities(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const { data: statesResponse } = useStatesList();

  const createMutation = useCreateCity();
  const updateMutation = useUpdateCity();
  const deleteMutation = useDeleteCity();

  const cities = citiesResponse?.data || [];
  const states = statesResponse?.data || [];

  // Add city form
  const addCityForm = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      cityName: "",
      code: "",
      stateId: undefined,
      status: "active",
      remarks: "",
    },
  });

  // Edit city form
  const editCityForm = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      cityName: "",
      code: "",
      stateId: undefined,
      status: "active",
      remarks: "",
    },
  });

  const onAddCitySubmit = (data: CityFormValues) => {
    const selectedState = states.find(s => s.stateId === data.stateId);
    createMutation.mutate({
      cityName: data.cityName,
      code: data.code,
      state: selectedState,
      status: data.status,
      remarks: data.remarks,
    });
    setIsAddDialogOpen(false);
    addCityForm.reset();
  };

  const onEditCitySubmit = (data: CityFormValues) => {
    if (selectedCity) {
      const selectedState = states.find(s => s.stateId === data.stateId);
      updateMutation.mutate({
        id: selectedCity.cityId!,
        data: {
          cityId: selectedCity.cityId,
          cityName: data.cityName,
          code: data.code,
          state: selectedState,
          status: data.status,
          remarks: data.remarks,
        },
      });
    }
    setIsEditDialogOpen(false);
    setSelectedCity(null);
    editCityForm.reset();
  };

  const handleEditCity = (city: CityMasterDTO) => {
    setSelectedCity(city);
    editCityForm.reset({
      cityName: city.cityName || "",
      code: city.code || "",
      stateId: city.state?.stateId || undefined,
      status: (city.status as "active" | "inactive") || "active",
      remarks: city.remarks || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (city: CityMasterDTO) => {
    setCityToDelete(city);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (cityToDelete) {
      deleteMutation.mutate(cityToDelete.cityId!);
      setIsDeleteDialogOpen(false);
      setCityToDelete(null);
    }
  };

  const filteredCities = cities.filter(city =>
    city.cityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state?.stateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state?.country?.countryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.remarks?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  // Define table columns
  const columns = useMemo<ColumnDef<CityMasterDTO>[]>(
    () => [
      {
        header: "City",
        accessorKey: "cityName",
        cell: (city) => (
          <div className="flex items-center gap-2">
            <span className="text-lg">🏙️</span>
            <div>
              <div className="font-semibold">{city.cityName || "N/A"}</div>
              <div className="text-sm text-muted-foreground">{city.code || "N/A"}</div>
            </div>
          </div>
        ),
      },
      {
        header: "State",
        accessorKey: "state",
        cell: (city) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{city.state?.stateName || "N/A"}</span>
          </div>
        ),
      },
      {
        header: "Country",
        accessorKey: "country",
        cell: (city) => (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>{city.state?.country?.countryName || "N/A"}</span>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (city) => (
          <Badge className={getStatusBadgeClass(city.status || "")}>
            {(city.status || "INACTIVE").toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (city) => (
          <div className="max-w-xs truncate text-sm">
            {city.remarks || "No remarks"}
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (city) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditCity(city)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(city)}
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

  const CityFormFields = ({ form }: { form: any }) => (
    <>
      {/* City Name */}
      <FormField
        control={form.control}
        name="cityName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City Name *</FormLabel>
            <FormControl>
              <Input placeholder="New York, Los Angeles, Toronto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City Code */}
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City Code *</FormLabel>
            <FormControl>
              <Input placeholder="NYC, LA, TOR" {...field} className="uppercase" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* State */}
      <FormField
        control={form.control}
        name="stateId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State *</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.stateId} value={state.stateId!.toString()}>
                    {state.stateName}, {state.country?.countryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Status */}
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Remarks */}
      <FormField
        control={form.control}
        name="remarks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional notes about this city..."
                {...field}
                rows={3}
              />
            </FormControl>
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
                  <Building className="h-8 w-8 text-primary" />
                  City Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage cities and urban areas within states
                </p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add City
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New City</DialogTitle>
                    <DialogDescription>
                      Create a new city within a state
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addCityForm}>
                    <form onSubmit={addCityForm.handleSubmit(onAddCitySubmit)} className="space-y-4">
                      <CityFormFields form={addCityForm} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create City
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
                placeholder="Search by city name, code, state, country, or remarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Cities Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading cities</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredCities}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit City Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md bg-background">
              <DialogHeader>
                <DialogTitle>Edit City</DialogTitle>
                <DialogDescription>
                  Update city information and location
                </DialogDescription>
              </DialogHeader>

              <Form {...editCityForm}>
                <form onSubmit={editCityForm.handleSubmit(onEditCitySubmit)} className="space-y-4">
                  <CityFormFields form={editCityForm} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update City
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
                  This will permanently delete the city "{cityToDelete?.cityName}".
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