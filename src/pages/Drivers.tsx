import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTable, ColumnDef } from "@/components/DataTable";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus,
  Pencil,
  Trash2,
  Star,
  TrendingUp,
  Truck,
  UserCheck,
  Phone,
  Mail
} from "lucide-react";

// Driver type based on DriverDTO
type Driver = {
  driverId: number;
  phoneNumber: string;
  otpVerified: boolean;
  email: string;
  signupMethod: string;
  fullName: string;
  profilePhotoUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContactNumber?: string;
  preferredLanguage: string;
  govtIdType?: string;
  govtIdNumber?: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleRegistrationNumber: string;
  yearOfManufacture?: number;
  vehicleColor?: string;
  seatingCapacity?: number;
  luggageCapacity?: number;
  bankAccountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  driverRating: number;
  signupStatus: string;
  approvalDate?: string;
  lastLogin?: string;
  termsConsent: boolean;
  fraudFlag: boolean;
  suspensionStatus: boolean;
  createdDate: string;
  modifiedDate?: string;
  isDeletedValue: boolean;
};

// Mock data
const mockDriversData: Driver[] = [
  {
    driverId: 1,
    fullName: "John Okoro",
    email: "john.okoro@aboosto.com",
    phoneNumber: "+234 801 234 5678",
    otpVerified: true,
    signupMethod: "Email",
    preferredLanguage: "English",
    vehicleType: "Sedan",
    vehicleMake: "Toyota",
    vehicleModel: "Camry",
    vehicleRegistrationNumber: "LAG-123-AB",
    yearOfManufacture: 2020,
    vehicleColor: "Black",
    seatingCapacity: 4,
    driverRating: 4.8,
    signupStatus: "Approved",
    approvalDate: "2024-01-15T10:00:00Z",
    lastLogin: "2024-03-10T08:30:00Z",
    termsConsent: true,
    fraudFlag: false,
    suspensionStatus: false,
    createdDate: "2024-01-10T09:00:00Z",
    isDeletedValue: false,
  },
  {
    driverId: 2,
    fullName: "Sarah Johnson",
    email: "sarah.johnson@aboosto.com",
    phoneNumber: "+234 802 345 6789",
    otpVerified: true,
    signupMethod: "Phone",
    preferredLanguage: "English",
    vehicleType: "SUV",
    vehicleMake: "Honda",
    vehicleModel: "CR-V",
    vehicleRegistrationNumber: "LAG-456-CD",
    yearOfManufacture: 2021,
    vehicleColor: "White",
    seatingCapacity: 5,
    driverRating: 4.9,
    signupStatus: "Approved",
    approvalDate: "2024-01-20T11:00:00Z",
    lastLogin: "2024-03-11T09:15:00Z",
    termsConsent: true,
    fraudFlag: false,
    suspensionStatus: false,
    createdDate: "2024-01-15T10:30:00Z",
    isDeletedValue: false,
  },
  {
    driverId: 3,
    fullName: "Mike Wilson",
    email: "mike.wilson@aboosto.com",
    phoneNumber: "+234 803 456 7890",
    otpVerified: true,
    signupMethod: "Email",
    preferredLanguage: "English",
    vehicleType: "Hatchback",
    vehicleMake: "Volkswagen",
    vehicleModel: "Golf",
    vehicleRegistrationNumber: "LAG-789-EF",
    yearOfManufacture: 2019,
    vehicleColor: "Blue",
    seatingCapacity: 4,
    driverRating: 4.6,
    signupStatus: "Pending",
    termsConsent: true,
    fraudFlag: false,
    suspensionStatus: false,
    createdDate: "2024-02-01T14:00:00Z",
    isDeletedValue: false,
  },
];

// Form schema
const driverFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  preferredLanguage: z.string().min(1, "Language is required"),
  signupMethod: z.string().min(1, "Signup method is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleRegistrationNumber: z.string().min(1, "Registration number is required"),
  yearOfManufacture: z.string().optional(),
  vehicleColor: z.string().optional(),
  seatingCapacity: z.string().optional(),
  signupStatus: z.string().min(1, "Status is required"),
  otpVerified: z.boolean(),
  termsConsent: z.boolean(),
  suspensionStatus: z.boolean(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

const Drivers = () => {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>(mockDriversData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const addForm = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      preferredLanguage: "English",
      signupMethod: "Email",
      vehicleType: "Sedan",
      vehicleMake: "",
      vehicleModel: "",
      vehicleRegistrationNumber: "",
      signupStatus: "Pending",
      otpVerified: false,
      termsConsent: false,
      suspensionStatus: false,
    },
  });

  const editForm = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
  });

  const filteredDrivers = drivers.filter(driver =>
    !driver.isDeletedValue && (
      driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddDriver = (data: DriverFormValues) => {
    const newDriver: Driver = {
      driverId: Math.max(...drivers.map(d => d.driverId)) + 1,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      otpVerified: data.otpVerified,
      signupMethod: data.signupMethod,
      preferredLanguage: data.preferredLanguage,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      emergencyContactNumber: data.emergencyContactNumber,
      vehicleType: data.vehicleType,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      vehicleRegistrationNumber: data.vehicleRegistrationNumber,
      yearOfManufacture: data.yearOfManufacture ? parseInt(data.yearOfManufacture) : undefined,
      vehicleColor: data.vehicleColor,
      seatingCapacity: data.seatingCapacity ? parseInt(data.seatingCapacity) : undefined,
      driverRating: 0,
      signupStatus: data.signupStatus,
      termsConsent: data.termsConsent,
      fraudFlag: false,
      suspensionStatus: data.suspensionStatus,
      createdDate: new Date().toISOString(),
      isDeletedValue: false,
    };

    setDrivers([...drivers, newDriver]);
    setIsAddDialogOpen(false);
    addForm.reset();
    toast({
      title: "Driver Added",
      description: `${data.fullName} has been added successfully.`,
    });
  };

  const handleEditDriver = (data: DriverFormValues) => {
    if (!selectedDriver) return;

    const updatedDrivers = drivers.map(driver =>
      driver.driverId === selectedDriver.driverId
        ? {
            ...driver,
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            otpVerified: data.otpVerified,
            signupMethod: data.signupMethod,
            preferredLanguage: data.preferredLanguage,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            address: data.address,
            emergencyContactNumber: data.emergencyContactNumber,
            vehicleType: data.vehicleType,
            vehicleMake: data.vehicleMake,
            vehicleModel: data.vehicleModel,
            vehicleRegistrationNumber: data.vehicleRegistrationNumber,
            yearOfManufacture: data.yearOfManufacture ? parseInt(data.yearOfManufacture) : undefined,
            vehicleColor: data.vehicleColor,
            seatingCapacity: data.seatingCapacity ? parseInt(data.seatingCapacity) : undefined,
            signupStatus: data.signupStatus,
            termsConsent: data.termsConsent,
            suspensionStatus: data.suspensionStatus,
            modifiedDate: new Date().toISOString(),
          }
        : driver
    );

    setDrivers(updatedDrivers);
    setIsEditDialogOpen(false);
    setSelectedDriver(null);
    toast({
      title: "Driver Updated",
      description: `${data.fullName}'s information has been updated.`,
    });
  };

  const handleDeleteDriver = () => {
    if (!selectedDriver) return;

    const updatedDrivers = drivers.map(driver =>
      driver.driverId === selectedDriver.driverId
        ? { ...driver, isDeletedValue: true }
        : driver
    );

    setDrivers(updatedDrivers);
    setIsDeleteDialogOpen(false);
    setSelectedDriver(null);
    toast({
      title: "Driver Deleted",
      description: "The driver has been removed successfully.",
      variant: "destructive",
    });
  };

  const openEditDialog = (driver: Driver) => {
    setSelectedDriver(driver);
    editForm.reset({
      fullName: driver.fullName,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      dateOfBirth: driver.dateOfBirth,
      gender: driver.gender,
      address: driver.address,
      emergencyContactNumber: driver.emergencyContactNumber,
      preferredLanguage: driver.preferredLanguage,
      signupMethod: driver.signupMethod,
      vehicleType: driver.vehicleType,
      vehicleMake: driver.vehicleMake,
      vehicleModel: driver.vehicleModel,
      vehicleRegistrationNumber: driver.vehicleRegistrationNumber,
      yearOfManufacture: driver.yearOfManufacture?.toString(),
      vehicleColor: driver.vehicleColor,
      seatingCapacity: driver.seatingCapacity?.toString(),
      signupStatus: driver.signupStatus,
      otpVerified: driver.otpVerified,
      termsConsent: driver.termsConsent,
      suspensionStatus: driver.suspensionStatus,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDeleteDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const columns: ColumnDef<Driver>[] = [
    {
      header: "Driver",
      accessorKey: "fullName",
      cell: (driver) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              {getInitials(driver.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{driver.fullName}</div>
            <div className="text-sm text-muted-foreground">{driver.phoneNumber}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Contact",
      accessorKey: "email",
      cell: (driver) => (
        <div className="space-y-1">
          <div className="text-sm flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {driver.email}
          </div>
          <div className="text-sm text-muted-foreground">{driver.signupMethod}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Vehicle",
      accessorKey: "vehicleMake",
      cell: (driver) => (
        <div className="space-y-1">
          <div className="font-medium">{driver.vehicleMake} {driver.vehicleModel}</div>
          <div className="text-sm text-muted-foreground">{driver.vehicleRegistrationNumber}</div>
          <Badge variant="outline" className="text-xs">{driver.vehicleType}</Badge>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Rating",
      accessorKey: "driverRating",
      cell: (driver) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="font-semibold">{driver.driverRating.toFixed(1)}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "signupStatus",
      cell: (driver) => (
        <div className="space-y-1">
          <Badge
            className={
              driver.signupStatus === "Approved"
                ? "bg-gradient-to-r from-primary to-secondary"
                : driver.signupStatus === "Pending"
                ? "bg-muted text-muted-foreground"
                : "bg-destructive"
            }
          >
            {driver.signupStatus}
          </Badge>
          {driver.otpVerified && (
            <Badge variant="outline" className="text-xs block w-fit">Verified</Badge>
          )}
          {driver.suspensionStatus && (
            <Badge variant="destructive" className="text-xs block w-fit">Suspended</Badge>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Actions",
      accessorKey: "driverId",
      cell: (driver) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openEditDialog(driver)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => openDeleteDialog(driver)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  const activeDrivers = drivers.filter(d => !d.isDeletedValue && d.signupStatus === "Approved");
  const avgRating = drivers.length > 0 
    ? (drivers.reduce((sum, d) => sum + d.driverRating, 0) / drivers.length).toFixed(1)
    : "0.0";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container px-4 py-8">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{drivers.filter(d => !d.isDeletedValue).length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-primary">{activeDrivers.length}</span> approved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgRating}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all drivers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeDrivers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">On the road</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {drivers.filter(d => !d.isDeletedValue && d.signupStatus === "Pending").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Add */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Driver
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Driver</DialogTitle>
                  <DialogDescription>
                    Fill in the driver details below to add them to the system.
                  </DialogDescription>
                </DialogHeader>
                <Form {...addForm}>
                  <form onSubmit={addForm.handleSubmit(handleAddDriver)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="preferredLanguage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="signupMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Signup Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Email">Email</SelectItem>
                                <SelectItem value="Phone">Phone</SelectItem>
                                <SelectItem value="Social">Social</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="emergencyContactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="vehicleType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sedan">Sedan</SelectItem>
                                <SelectItem value="SUV">SUV</SelectItem>
                                <SelectItem value="Hatchback">Hatchback</SelectItem>
                                <SelectItem value="Van">Van</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="vehicleMake"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Make</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="vehicleModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Model</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="vehicleRegistrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="yearOfManufacture"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year of Manufacture</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="vehicleColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Color</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="seatingCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seating Capacity</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="signupStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="otpVerified"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">OTP Verified</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="termsConsent"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Terms Consent</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="suspensionStatus"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Suspended</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                        Add Driver
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Data Table */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-900">
            <DataTable
              data={filteredDrivers}
              columns={columns}
              pageSize={10}
            />
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>
              Update the driver's information below.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditDriver)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="preferredLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="signupMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signup Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Phone">Phone</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="emergencyContactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sedan">Sedan</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Hatchback">Hatchback</SelectItem>
                          <SelectItem value="Van">Van</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="vehicleMake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Make</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Model</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="vehicleRegistrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="yearOfManufacture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Manufacture</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="vehicleColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Color</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="seatingCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seating Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="signupStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="otpVerified"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">OTP Verified</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="termsConsent"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Terms Consent</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="suspensionStatus"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Suspended</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                  Update Driver
                </Button>
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
              This will permanently delete the driver "{selectedDriver?.fullName}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDriver} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Drivers;
