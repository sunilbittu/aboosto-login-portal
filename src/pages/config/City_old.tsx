import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Plus, Edit, Trash2, MapPin, Globe } from "lucide-react";
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
} from "@/components/ui/form";
import { DataTable, ColumnDef } from "@/components/DataTable";

// Type for country data
type CountryMaster = {
  countryId: number;
  code: string;
  countryName: string;
  status: string;
};

// Type for state data
type StateMaster = {
  stateId: number;
  code: string;
  stateName: string;
  country: CountryMaster;
  status: string;
};

// Type for city data matching CityMaster DTO
type CityData = {
  cityId: number;
  code: string;
  cityName: string;
  state: StateMaster;
  createdBy: string;
  createdDate: string;
  createdSystemIp: string;
  isDeletedValue: boolean;
  modifiedBy: string;
  modifiedDate: string;
  modifiedSystemIp: string;
  remarks: string;
  status: string;
};

// Validation schema for add/edit city
const citySchema = z.object({
  code: z.string()
    .trim()
    .min(2, { message: "City code must be at least 2 characters" })
    .max(10, { message: "City code must be less than 10 characters" })
    .toUpperCase(),
  cityName: z.string()
    .trim()
    .min(2, { message: "City name must be at least 2 characters" })
    .max(100, { message: "City name must be less than 100 characters" }),
  countryId: z.number({ required_error: "Please select a country" }),
  stateId: z.number({ required_error: "Please select a state" }),
  status: z.enum(["active", "inactive"]),
  remarks: z.string().max(500, { message: "Remarks must be less than 500 characters" }).optional(),
});

type CityFormValues = z.infer<typeof citySchema>;

// Mock countries data
const countriesData: CountryMaster[] = [
  {
    countryId: 1,
    code: "US",
    countryName: "United States",
    status: "active",
  },
  {
    countryId: 2,
    code: "UK",
    countryName: "United Kingdom",
    status: "active",
  },
  {
    countryId: 3,
    code: "IN",
    countryName: "India",
    status: "active",
  },
];

// Mock states data
const statesData: StateMaster[] = [
  {
    stateId: 1,
    code: "CA",
    stateName: "California",
    country: countriesData[0],
    status: "active",
  },
  {
    stateId: 2,
    code: "TX",
    stateName: "Texas",
    country: countriesData[0],
    status: "active",
  },
  {
    stateId: 3,
    code: "MH",
    stateName: "Maharashtra",
    country: countriesData[2],
    status: "active",
  },
  {
    stateId: 4,
    code: "LDN",
    stateName: "London",
    country: countriesData[1],
    status: "active",
  },
  {
    stateId: 5,
    code: "KA",
    stateName: "Karnataka",
    country: countriesData[2],
    status: "active",
  },
];

// Mock cities data matching CityMaster DTO
const citiesData: CityData[] = [
  {
    cityId: 1,
    code: "LA",
    cityName: "Los Angeles",
    state: statesData[0],
    createdBy: "admin",
    createdDate: "2024-01-15T10:30:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-15T10:30:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Major metropolitan area",
    status: "active",
  },
  {
    cityId: 2,
    code: "SF",
    cityName: "San Francisco",
    state: statesData[0],
    createdBy: "admin",
    createdDate: "2024-01-16T11:00:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-16T11:00:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Tech hub",
    status: "active",
  },
  {
    cityId: 3,
    code: "HOU",
    cityName: "Houston",
    state: statesData[1],
    createdBy: "admin",
    createdDate: "2024-01-17T09:15:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-17T09:15:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Energy capital",
    status: "active",
  },
  {
    cityId: 4,
    code: "MUM",
    cityName: "Mumbai",
    state: statesData[2],
    createdBy: "admin",
    createdDate: "2024-01-18T14:20:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-18T14:20:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Financial capital of India",
    status: "active",
  },
  {
    cityId: 5,
    code: "BLR",
    cityName: "Bangalore",
    state: statesData[4],
    createdBy: "admin",
    createdDate: "2024-01-19T16:45:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-19T16:45:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Silicon Valley of India",
    status: "active",
  },
];

export default function City() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [cityToDelete, setCityToDelete] = useState<CityData | null>(null);
  const [selectedCountryIdAdd, setSelectedCountryIdAdd] = useState<number | null>(null);
  const [selectedCountryIdEdit, setSelectedCountryIdEdit] = useState<number | null>(null);
  const { toast } = useToast();

  // Add city form
  const addCityForm = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      code: "",
      cityName: "",
      countryId: undefined,
      stateId: undefined,
      status: "active",
      remarks: "",
    },
  });

  // Edit city form
  const editCityForm = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      code: "",
      cityName: "",
      countryId: undefined,
      stateId: undefined,
      status: "active",
      remarks: "",
    },
  });

  // Filter states based on selected country for Add form
  const filteredStatesAdd = useMemo(() => {
    if (!selectedCountryIdAdd) return [];
    return statesData.filter(state => state.country.countryId === selectedCountryIdAdd);
  }, [selectedCountryIdAdd]);

  // Filter states based on selected country for Edit form
  const filteredStatesEdit = useMemo(() => {
    if (!selectedCountryIdEdit) return [];
    return statesData.filter(state => state.country.countryId === selectedCountryIdEdit);
  }, [selectedCountryIdEdit]);

  const onAddCitySubmit = (data: CityFormValues) => {
    const selectedState = statesData.find(s => s.stateId === data.stateId);
    console.log("Adding city:", data);
    toast({
      title: "City Created",
      description: `City "${data.cityName}" (${data.code}) in ${selectedState?.stateName} has been successfully created.`,
    });
    setIsAddDialogOpen(false);
    setSelectedCountryIdAdd(null);
    addCityForm.reset();
  };

  const onEditCitySubmit = (data: CityFormValues) => {
    const selectedState = statesData.find(s => s.stateId === data.stateId);
    console.log("Updating city:", data);
    toast({
      title: "City Updated",
      description: `City "${data.cityName}" (${data.code}) in ${selectedState?.stateName} has been successfully updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedCity(null);
    setSelectedCountryIdEdit(null);
    editCityForm.reset();
  };

  const handleEditCity = (city: CityData) => {
    setSelectedCity(city);
    setSelectedCountryIdEdit(city.state.country.countryId);
    editCityForm.reset({
      code: city.code,
      cityName: city.cityName,
      countryId: city.state.country.countryId,
      stateId: city.state.stateId,
      status: city.status as "active" | "inactive",
      remarks: city.remarks,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (city: CityData) => {
    setCityToDelete(city);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (cityToDelete) {
      console.log("Deleting city:", cityToDelete.cityId);
      toast({
        title: "City Deleted",
        description: `City "${cityToDelete.cityName}" has been permanently deleted.`,
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setCityToDelete(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  const filteredCities = citiesData.filter(city =>
    city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.country.countryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns = useMemo<ColumnDef<CityData>[]>(
    () => [
      {
        header: "City Code",
        accessorKey: "code",
        cell: (city) => (
          <div className="font-mono font-semibold text-primary">
            {city.code}
          </div>
        ),
      },
      {
        header: "City Name",
        accessorKey: "cityName",
        cell: (city) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{city.cityName}</span>
          </div>
        ),
      },
      {
        header: "State",
        accessorKey: "state",
        cell: (city) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{city.state.stateName}</div>
              <div className="text-xs text-muted-foreground">{city.state.code}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Country",
        sortable: false,
        cell: (city) => (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{city.state.country.countryName}</div>
              <div className="text-xs text-muted-foreground">{city.state.country.code}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (city) => (
          <Badge className={getStatusBadgeClass(city.status)}>
            {city.status.toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (city) => (
          <div className="max-w-xs truncate text-sm text-muted-foreground">
            {city.remarks || "—"}
          </div>
        ),
      },
      {
        header: "Created Date",
        accessorKey: "createdDate",
        cell: (city) => (
          <div className="text-sm">
            {new Date(city.createdDate).toLocaleDateString()}
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (city) => (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditCity(city)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteClick(city)}
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container px-4 py-8">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <Building2 className="h-8 w-8 text-primary" />
                  City Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage cities for your fleet operations
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  setSelectedCountryIdAdd(null);
                  addCityForm.reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add City
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New City</DialogTitle>
                    <DialogDescription>
                      Create a new city for fleet operations
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...addCityForm}>
                    <form onSubmit={addCityForm.handleSubmit(onAddCitySubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Country Selection */}
                        <FormField
                          control={addCityForm.control}
                          name="countryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <Select 
                                onValueChange={(value) => {
                                  const countryId = Number(value);
                                  field.onChange(countryId);
                                  setSelectedCountryIdAdd(countryId);
                                  // Reset state when country changes
                                  addCityForm.setValue("stateId", undefined as any);
                                }} 
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background">
                                  {countriesData.map((country) => (
                                    <SelectItem key={country.countryId} value={country.countryId.toString()}>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs">{country.code}</span>
                                        <span>{country.countryName}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* State Selection (Cascading) */}
                        <FormField
                          control={addCityForm.control}
                          name="stateId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(Number(value))} 
                                value={field.value?.toString()}
                                disabled={!selectedCountryIdAdd}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder={selectedCountryIdAdd ? "Select state" : "Select country first"} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background">
                                  {filteredStatesAdd.map((state) => (
                                    <SelectItem key={state.stateId} value={state.stateId.toString()}>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs">{state.code}</span>
                                        <span>{state.stateName}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* City Code */}
                        <FormField
                          control={addCityForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City Code *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="LA, NYC, MUM" 
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* City Name */}
                        <FormField
                          control={addCityForm.control}
                          name="cityName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Los Angeles" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Status */}
                        <FormField
                          control={addCityForm.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background">
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Remarks */}
                      <FormField
                        control={addCityForm.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Additional information about this city..." 
                                {...field} 
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                placeholder="Search by city name, code, state, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Cities Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <DataTable
              data={filteredCities}
              columns={columns}
              pageSize={10}
            />
          </div>

          {/* Edit City Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setSelectedCity(null);
              setSelectedCountryIdEdit(null);
              editCityForm.reset();
            }
          }}>
            <DialogContent className="max-w-2xl bg-background">
              <DialogHeader>
                <DialogTitle>Edit City</DialogTitle>
                <DialogDescription>
                  Update city information
                </DialogDescription>
              </DialogHeader>
              
              <Form {...editCityForm}>
                <form onSubmit={editCityForm.handleSubmit(onEditCitySubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Country Selection */}
                    <FormField
                      control={editCityForm.control}
                      name="countryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              const countryId = Number(value);
                              field.onChange(countryId);
                              setSelectedCountryIdEdit(countryId);
                              // Reset state when country changes
                              editCityForm.setValue("stateId", undefined as any);
                            }} 
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background">
                              {countriesData.map((country) => (
                                <SelectItem key={country.countryId} value={country.countryId.toString()}>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs">{country.code}</span>
                                    <span>{country.countryName}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* State Selection (Cascading) */}
                    <FormField
                      control={editCityForm.control}
                      name="stateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(Number(value))} 
                            value={field.value?.toString()}
                            disabled={!selectedCountryIdEdit}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder={selectedCountryIdEdit ? "Select state" : "Select country first"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background">
                              {filteredStatesEdit.map((state) => (
                                <SelectItem key={state.stateId} value={state.stateId.toString()}>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs">{state.code}</span>
                                    <span>{state.stateName}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* City Code */}
                    <FormField
                      control={editCityForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City Code *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="LA, NYC, MUM" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* City Name */}
                    <FormField
                      control={editCityForm.control}
                      name="cityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Los Angeles" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Status */}
                    <FormField
                      control={editCityForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background">
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Remarks */}
                  <FormField
                    control={editCityForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional information about this city..." 
                            {...field} 
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                  This will permanently delete the city "{cityToDelete?.cityName}" ({cityToDelete?.code}).
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
