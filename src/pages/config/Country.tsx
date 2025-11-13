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
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status",
  }),
  remarks: z.string()
    .trim()
    .max(500, { message: "Remarks must be less than 500 characters" })
    .optional(),
});

type CountryFormValues = z.infer<typeof countrySchema>;

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

  const filteredCountries = countries.filter(country =>
    country.countryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.remarks?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  // Define table columns
  const columns = useMemo<ColumnDef<CountryMasterDTO>[]>(
    () => [
      {
        header: "Country",
        accessorKey: "countryName",
        cell: (country) => (
          <div className="flex items-center gap-2">
            <span className="text-lg">🏳️</span>
            <div>
              <div className="font-semibold">{country.countryName || "N/A"}</div>
              <div className="text-sm text-muted-foreground">{country.code || "N/A"}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (country) => (
          <Badge className={getStatusBadgeClass(country.status || "")}>
            {(country.status || "INACTIVE").toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (country) => (
          <div className="max-w-xs truncate text-sm">
            {country.remarks || "No remarks"}
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (country) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditCountry(country)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(country)}
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

  const CountryFormFields = ({ form }: { form: any }) => (
    <>
      {/* Country Code */}
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country Code *</FormLabel>
            <FormControl>
              <Input placeholder="US, UK, CA" {...field} className="uppercase" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Country Name */}
      <FormField
        control={form.control}
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
                placeholder="Additional notes about this country..."
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
                  <Globe className="h-8 w-8 text-primary" />
                  Country Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage countries and their operational status
                </p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Country
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Country</DialogTitle>
                    <DialogDescription>
                      Create a new country with operational status
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addCountryForm}>
                    <form onSubmit={addCountryForm.handleSubmit(onAddCountrySubmit)} className="space-y-4">
                      <CountryFormFields form={addCountryForm} />

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

            {/* Search Bar */}
            <div className="relative mt-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by country name, code, or remarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Countries Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading countries</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredCountries}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit Country Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md bg-background">
              <DialogHeader>
                <DialogTitle>Edit Country</DialogTitle>
                <DialogDescription>
                  Update country information and status
                </DialogDescription>
              </DialogHeader>

              <Form {...editCountryForm}>
                <form onSubmit={editCountryForm.handleSubmit(onEditCountrySubmit)} className="space-y-4">
                  <CountryFormFields form={editCountryForm} />

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
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the country "{countryToDelete?.countryName}".
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