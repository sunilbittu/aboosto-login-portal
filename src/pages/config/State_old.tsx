import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Plus, Edit, Trash2, Globe } from "lucide-react";
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

// Type for state data matching StateMaster DTO
type StateData = {
  stateId: number;
  code: string;
  stateName: string;
  country: CountryMaster;
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

// Validation schema for add/edit state
const stateSchema = z.object({
  code: z.string()
    .trim()
    .min(2, { message: "State code must be at least 2 characters" })
    .max(10, { message: "State code must be less than 10 characters" })
    .toUpperCase(),
  stateName: z.string()
    .trim()
    .min(2, { message: "State name must be at least 2 characters" })
    .max(100, { message: "State name must be less than 100 characters" }),
  countryId: z.number({ required_error: "Please select a country" }),
  status: z.enum(["active", "inactive"]),
  remarks: z.string().max(500, { message: "Remarks must be less than 500 characters" }).optional(),
});

type StateFormValues = z.infer<typeof stateSchema>;

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

// Mock states data matching StateMaster DTO
const statesData: StateData[] = [
  {
    stateId: 1,
    code: "CA",
    stateName: "California",
    country: countriesData[0],
    createdBy: "admin",
    createdDate: "2024-01-15T10:30:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-15T10:30:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "West Coast state",
    status: "active",
  },
  {
    stateId: 2,
    code: "TX",
    stateName: "Texas",
    country: countriesData[0],
    createdBy: "admin",
    createdDate: "2024-01-16T11:00:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-16T11:00:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Southern state",
    status: "active",
  },
  {
    stateId: 3,
    code: "MH",
    stateName: "Maharashtra",
    country: countriesData[2],
    createdBy: "admin",
    createdDate: "2024-01-17T09:15:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-17T09:15:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Financial hub state",
    status: "active",
  },
  {
    stateId: 4,
    code: "LDN",
    stateName: "London",
    country: countriesData[1],
    createdBy: "admin",
    createdDate: "2024-01-18T14:20:00Z",
    createdSystemIp: "192.168.1.1",
    isDeletedValue: false,
    modifiedBy: "admin",
    modifiedDate: "2024-01-18T14:20:00Z",
    modifiedSystemIp: "192.168.1.1",
    remarks: "Capital region",
    status: "active",
  },
];

export default function State() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [stateToDelete, setStateToDelete] = useState<StateData | null>(null);
  const { toast } = useToast();

  // Add state form
  const addStateForm = useForm<StateFormValues>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      code: "",
      stateName: "",
      countryId: undefined,
      status: "active",
      remarks: "",
    },
  });

  // Edit state form
  const editStateForm = useForm<StateFormValues>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      code: "",
      stateName: "",
      countryId: undefined,
      status: "active",
      remarks: "",
    },
  });

  const onAddStateSubmit = (data: StateFormValues) => {
    const selectedCountry = countriesData.find(c => c.countryId === data.countryId);
    console.log("Adding state:", data);
    toast({
      title: "State Created",
      description: `State "${data.stateName}" (${data.code}) in ${selectedCountry?.countryName} has been successfully created.`,
    });
    setIsAddDialogOpen(false);
    addStateForm.reset();
  };

  const onEditStateSubmit = (data: StateFormValues) => {
    const selectedCountry = countriesData.find(c => c.countryId === data.countryId);
    console.log("Updating state:", data);
    toast({
      title: "State Updated",
      description: `State "${data.stateName}" (${data.code}) in ${selectedCountry?.countryName} has been successfully updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedState(null);
    editStateForm.reset();
  };

  const handleEditState = (state: StateData) => {
    setSelectedState(state);
    editStateForm.reset({
      code: state.code,
      stateName: state.stateName,
      countryId: state.country.countryId,
      status: state.status as "active" | "inactive",
      remarks: state.remarks,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (state: StateData) => {
    setStateToDelete(state);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (stateToDelete) {
      console.log("Deleting state:", stateToDelete.stateId);
      toast({
        title: "State Deleted",
        description: `State "${stateToDelete.stateName}" has been permanently deleted.`,
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setStateToDelete(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  const filteredStates = statesData.filter(state =>
    state.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.country.countryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns = useMemo<ColumnDef<StateData>[]>(
    () => [
      {
        header: "State Code",
        accessorKey: "code",
        cell: (state) => (
          <div className="font-mono font-semibold text-primary">
            {state.code}
          </div>
        ),
      },
      {
        header: "State Name",
        accessorKey: "stateName",
        cell: (state) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{state.stateName}</span>
          </div>
        ),
      },
      {
        header: "Country",
        accessorKey: "country",
        cell: (state) => (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{state.country.countryName}</div>
              <div className="text-xs text-muted-foreground">{state.country.code}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (state) => (
          <Badge className={getStatusBadgeClass(state.status)}>
            {state.status.toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (state) => (
          <div className="max-w-xs truncate text-sm text-muted-foreground">
            {state.remarks || "—"}
          </div>
        ),
      },
      {
        header: "Created Date",
        accessorKey: "createdDate",
        cell: (state) => (
          <div className="text-sm">
            {new Date(state.createdDate).toLocaleDateString()}
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (state) => (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditState(state)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteClick(state)}
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
                  <MapPin className="h-8 w-8 text-primary" />
                  State Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage states for your fleet operations
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add State
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New State</DialogTitle>
                    <DialogDescription>
                      Create a new state for fleet operations
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...addStateForm}>
                    <form onSubmit={addStateForm.handleSubmit(onAddStateSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Country Selection */}
                        <FormField
                          control={addStateForm.control}
                          name="countryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(Number(value))} 
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

                        {/* State Code */}
                        <FormField
                          control={addStateForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State Code *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="CA, TX, MH" 
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* State Name */}
                        <FormField
                          control={addStateForm.control}
                          name="stateName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="California" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Status */}
                        <FormField
                          control={addStateForm.control}
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
                        control={addStateForm.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Additional information about this state..." 
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
                          Create State
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
                placeholder="Search states by name, code, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* States DataTable */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-900">
            <DataTable
              data={filteredStates}
              columns={columns}
            />
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle>Edit State</DialogTitle>
            <DialogDescription>
              Update state information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editStateForm}>
            <form onSubmit={editStateForm.handleSubmit(onEditStateSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country Selection */}
                <FormField
                  control={editStateForm.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
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

                {/* State Code */}
                <FormField
                  control={editStateForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State Code *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="CA, TX, MH" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State Name */}
                <FormField
                  control={editStateForm.control}
                  name="stateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="California" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={editStateForm.control}
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
                control={editStateForm.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about this state..." 
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the state
              <span className="font-semibold text-foreground"> "{stateToDelete?.stateName}" ({stateToDelete?.code})</span> from the system.
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
