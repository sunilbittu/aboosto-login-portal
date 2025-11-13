import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Search, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
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
  useCountries,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
  CountryMasterDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Use the imported CountryMasterDTO type

// Validation schema for add/edit country
const countrySchema = z.object({
  code: z.string()
    .trim()
    .min(2, { message: "Country code must be at least 2 characters" })
    .max(10, { message: "Country code must be less than 10 characters" })
    .toUpperCase(),
  countryName: z.string()
    .trim()
    .min(2, { message: "Country name must be at least 2 characters" })
    .max(100, { message: "Country name must be less than 100 characters" }),
  status: z.enum(["active", "inactive"]),
  remarks: z.string().max(500, { message: "Remarks must be less than 500 characters" }).optional(),
});

type CountryFormValues = z.infer<typeof countrySchema>;

// Mock data matching CountryMaster DTO
const countriesData: CountryData[] = [
  {
    countryId: 1,
    code: "US",
    countryName: "United States",
    createdBy: "admin",
    createdDate: "2024-01-15T10:30:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-15T10:30:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Primary operating country",
    status: "active",
  },
  {
    countryId: 2,
    code: "UK",
    countryName: "United Kingdom",
    createdBy: "admin",
    createdDate: "2024-01-16T11:00:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-16T11:00:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "European operations",
    status: "active",
  },
  {
    countryId: 3,
    code: "IN",
    countryName: "India",
    createdBy: "admin",
    createdDate: "2024-01-17T09:15:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-17T09:15:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Asia-Pacific hub",
    status: "active",
  },
];

export default function Country() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryMasterDTO | null>(null);
  const [countryToDelete, setCountryToDelete] = useState<CountryMasterDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: countriesResponse, isLoading, error } = useCountries(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const createMutation = useCreateCountry();
  const updateMutation = useUpdateCountry();
  const deleteMutation = useDeleteCountry();

  const countries = countriesResponse?.data || [];

  // Add country form
  const addCountryForm = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      code: "",
      countryName: "",
      status: "active",
      remarks: "",
    },
  });

  // Edit country form
  const editCountryForm = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      code: "",
      countryName: "",
      status: "active",
      remarks: "",
    },
  });

  const onAddCountrySubmit = (data: CountryFormValues) => {
    createMutation.mutate({
      code: data.code,
      countryName: data.countryName,
      status: data.status,
      remarks: data.remarks,
    });
    setIsAddDialogOpen(false);
    addCountryForm.reset();
  };

  const onEditCountrySubmit = (data: CountryFormValues) => {
    if (selectedCountry) {
      updateMutation.mutate({
        id: selectedCountry.countryId!,
        data: {
          countryId: selectedCountry.countryId,
          code: data.code,
          countryName: data.countryName,
          status: data.status,
          remarks: data.remarks,
        },
      });
    }
    setIsEditDialogOpen(false);
    setSelectedCountry(null);
    editCountryForm.reset();
  };

  const handleEditCountry = (country: CountryMasterDTO) => {
    setSelectedCountry(country);
    editCountryForm.reset({
      code: country.code || "",
      countryName: country.countryName || "",
      status: (country.status as "active" | "inactive") || "active",
      remarks: country.remarks || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (country: CountryMasterDTO) => {
    setCountryToDelete(country);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (countryToDelete) {
      deleteMutation.mutate(countryToDelete.countryId!);
      setIsDeleteDialogOpen(false);
      setCountryToDelete(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  const filteredCountries = countriesData.filter(country =>
    country.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns = useMemo<ColumnDef<CountryData>[]>(
    () => [
      {
        header: "Country Code",
        accessorKey: "code",
        cell: (country) => (
          <div className="font-mono font-semibold text-primary">
            {country.code}
          </div>
        ),
      },
      {
        header: "Country Name",
        accessorKey: "countryName",
        cell: (country) => (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{country.countryName}</span>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (country) => (
          <Badge className={getStatusBadgeClass(country.status)}>
            {country.status.toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (country) => (
          <div className="max-w-xs truncate text-sm text-muted-foreground">
            {country.remarks || "—"}
          </div>
        ),
      },
      {
        header: "Created Date",
        accessorKey: "createdDate",
        cell: (country) => (
          <div className="text-sm">
            {new Date(country.createdDate).toLocaleDateString()}
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (country) => (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditCountry(country)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteClick(country)}
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
                  <Globe className="h-8 w-8 text-primary" />
                  Country Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage countries for your fleet operations
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Country
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Country</DialogTitle>
                    <DialogDescription>
                      Create a new country for fleet operations
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...addCountryForm}>
                    <form onSubmit={addCountryForm.handleSubmit(onAddCountrySubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Country Code */}
                        <FormField
                          control={addCountryForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country Code *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="US, UK, IN" 
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Country Name */}
                        <FormField
                          control={addCountryForm.control}
                          name="countryName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="United States" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Status */}
                        <FormField
                          control={addCountryForm.control}
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
                        control={addCountryForm.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Additional information about this country..." 
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
                          Create Country
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search countries by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Countries DataTable */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-900">
            <DataTable
              data={filteredCountries}
              columns={columns}
            />
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle>Edit Country</DialogTitle>
            <DialogDescription>
              Update country information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editCountryForm}>
            <form onSubmit={editCountryForm.handleSubmit(onEditCountrySubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country Code */}
                <FormField
                  control={editCountryForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="US, UK, IN" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country Name */}
                <FormField
                  control={editCountryForm.control}
                  name="countryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={editCountryForm.control}
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
                control={editCountryForm.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about this country..." 
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
                  Update Country
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the country
              <span className="font-semibold text-foreground"> "{countryToDelete?.countryName}" ({countryToDelete?.code})</span> from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
