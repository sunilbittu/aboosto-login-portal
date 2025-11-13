import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Plus, Edit, Trash2, Globe, MoreHorizontal } from "lucide-react";
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
  useStates,
  useCountriesList,
  useCreateState,
  useUpdateState,
  useDeleteState,
  StateMasterDTO,
  CountryMasterDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Validation schema for add/edit state
const stateSchema = z.object({
  stateName: z.string()
    .trim()
    .min(2, { message: "State name must be at least 2 characters" })
    .max(100, { message: "State name must be less than 100 characters" }),
  code: z.string()
    .trim()
    .min(2, { message: "State code must be at least 2 characters" })
    .max(10, { message: "State code must be less than 10 characters" })
    .toUpperCase(),
  countryId: z.number({ required_error: "Please select a country" }),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status",
  }),
  remarks: z.string()
    .trim()
    .max(500, { message: "Remarks must be less than 500 characters" })
    .optional(),
});

type StateFormValues = z.infer<typeof stateSchema>;

export default function State() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<StateMasterDTO | null>(null);
  const [stateToDelete, setStateToDelete] = useState<StateMasterDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: statesResponse, isLoading, error } = useStates(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const { data: countriesResponse } = useCountriesList();

  const createMutation = useCreateState();
  const updateMutation = useUpdateState();
  const deleteMutation = useDeleteState();

  const states = statesResponse?.data || [];
  const countries = countriesResponse?.data || [];

  // Add state form
  const addStateForm = useForm<StateFormValues>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      stateName: "",
      code: "",
      countryId: undefined,
      status: "active",
      remarks: "",
    },
  });

  // Edit state form
  const editStateForm = useForm<StateFormValues>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      stateName: "",
      code: "",
      countryId: undefined,
      status: "active",
      remarks: "",
    },
  });

  const onAddStateSubmit = (data: StateFormValues) => {
    const selectedCountry = countries.find(c => c.countryId === data.countryId);
    createMutation.mutate({
      stateName: data.stateName,
      code: data.code,
      country: selectedCountry,
      status: data.status,
      remarks: data.remarks,
    });
    setIsAddDialogOpen(false);
    addStateForm.reset();
  };

  const onEditStateSubmit = (data: StateFormValues) => {
    if (selectedState) {
      const selectedCountry = countries.find(c => c.countryId === data.countryId);
      updateMutation.mutate({
        id: selectedState.stateId!,
        data: {
          stateId: selectedState.stateId,
          stateName: data.stateName,
          code: data.code,
          country: selectedCountry,
          status: data.status,
          remarks: data.remarks,
        },
      });
    }
    setIsEditDialogOpen(false);
    setSelectedState(null);
    editStateForm.reset();
  };

  const handleEditState = (state: StateMasterDTO) => {
    setSelectedState(state);
    editStateForm.reset({
      stateName: state.stateName || "",
      code: state.code || "",
      countryId: state.country?.countryId || undefined,
      status: (state.status as "active" | "inactive") || "active",
      remarks: state.remarks || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (state: StateMasterDTO) => {
    setStateToDelete(state);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (stateToDelete) {
      deleteMutation.mutate(stateToDelete.stateId!);
      setIsDeleteDialogOpen(false);
      setStateToDelete(null);
    }
  };

  const filteredStates = states.filter(state =>
    state.stateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.country?.countryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.remarks?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  // Define table columns
  const columns = useMemo<ColumnDef<StateMasterDTO>[]>(
    () => [
      {
        header: "State",
        accessorKey: "stateName",
        cell: (state) => (
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <div>
              <div className="font-semibold">{state.stateName || "N/A"}</div>
              <div className="text-sm text-muted-foreground">{state.code || "N/A"}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Country",
        accessorKey: "country",
        cell: (state) => (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>{state.country?.countryName || "N/A"}</span>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (state) => (
          <Badge className={getStatusBadgeClass(state.status || "")}>
            {(state.status || "INACTIVE").toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (state) => (
          <div className="max-w-xs truncate text-sm">
            {state.remarks || "No remarks"}
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (state) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditState(state)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(state)}
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

  const StateFormFields = ({ form }: { form: any }) => (
    <>
      {/* State Name */}
      <FormField
        control={form.control}
        name="stateName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State Name *</FormLabel>
            <FormControl>
              <Input placeholder="California, Texas, Ontario" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* State Code */}
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State Code *</FormLabel>
            <FormControl>
              <Input placeholder="CA, TX, ON" {...field} className="uppercase" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Country */}
      <FormField
        control={form.control}
        name="countryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country *</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.countryId} value={country.countryId!.toString()}>
                    {country.countryName}
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
                placeholder="Additional notes about this state..."
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
                  <MapPin className="h-8 w-8 text-primary" />
                  State Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage states and provinces within countries
                </p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add State
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New State</DialogTitle>
                    <DialogDescription>
                      Create a new state within a country
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addStateForm}>
                    <form onSubmit={addStateForm.handleSubmit(onAddStateSubmit)} className="space-y-4">
                      <StateFormFields form={addStateForm} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create State
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
                placeholder="Search by state name, code, country, or remarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* States Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading states</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredStates}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit State Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md bg-background">
              <DialogHeader>
                <DialogTitle>Edit State</DialogTitle>
                <DialogDescription>
                  Update state information and country
                </DialogDescription>
              </DialogHeader>

              <Form {...editStateForm}>
                <form onSubmit={editStateForm.handleSubmit(onEditStateSubmit)} className="space-y-4">
                  <StateFormFields form={editStateForm} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update State
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
                  This will permanently delete the state "{stateToDelete?.stateName}".
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