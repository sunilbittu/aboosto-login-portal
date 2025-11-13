import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Search, UserPlus, Edit, Trash2, Phone, Mail, MapPin, Wallet } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DataTable, ColumnDef } from "@/components/DataTable";

// Type for rider data matching RiderDTO
type RiderData = {
  riderId: number;
  signupDate: string;
  status: string;
  deviceToken: string;
  phoneNumber: string;
  otpVerified: boolean;
  emailId: string;
  signupMethod: string;
  fullName: string;
  profilePhotoUrl: string;
  dateOfBirth: string;
  gender: string;
  homeAddress: string;
  workAddress: string;
  locationAccessPermission: boolean;
  kycIdType: string;
  kycIdNumber: string;
  kycDocumentPhotoUrl: string;
  preferredPaymentMethod: string;
  walletBalance: number;
  savedPaymentMethods: string[];
  preferredLanguage: string;
  notificationPreferences: string[];
  promotionalConsent: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  isDeleted: boolean;
  isDeletedValue: boolean;
};

// Validation schema for add/edit rider
const riderSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name must be less than 100 characters" }),
  emailId: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phoneNumber: z.string()
    .trim()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .max(15, { message: "Phone number must be less than 15 characters" }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  homeAddress: z.string().optional(),
  workAddress: z.string().optional(),
  signupMethod: z.enum(["Email", "Phone", "Google", "Facebook"]),
  preferredPaymentMethod: z.enum(["Cash", "Credit Card", "Debit Card", "Wallet", "UPI"]),
  preferredLanguage: z.string(),
  status: z.enum(["active", "inactive", "suspended"]),
  otpVerified: z.boolean().default(false),
  locationAccessPermission: z.boolean().default(false),
  promotionalConsent: z.boolean().default(false),
  profilePhotoUrl: z.string().optional(),
  kycIdType: z.string().optional(),
  kycIdNumber: z.string().optional(),
  kycDocumentPhotoUrl: z.string().optional(),
});

type RiderFormValues = z.infer<typeof riderSchema>;

// Mock data matching RiderDTO
const ridersData: RiderData[] = [
  {
    riderId: 1,
    signupDate: "2024-01-15T10:30:00Z",
    status: "active",
    deviceToken: "device_token_1",
    phoneNumber: "+1234567890",
    otpVerified: true,
    emailId: "alice.johnson@example.com",
    signupMethod: "Email",
    fullName: "Alice Johnson",
    profilePhotoUrl: "",
    dateOfBirth: "1990-05-15",
    gender: "Female",
    homeAddress: "123 Main St, New York, NY 10001",
    workAddress: "456 Business Ave, New York, NY 10002",
    locationAccessPermission: true,
    kycIdType: "Driving License",
    kycIdNumber: "DL123456789",
    kycDocumentPhotoUrl: "",
    preferredPaymentMethod: "Credit Card",
    walletBalance: 150.50,
    savedPaymentMethods: ["Credit Card", "Wallet"],
    preferredLanguage: "English",
    notificationPreferences: ["Email", "SMS", "Push"],
    promotionalConsent: true,
    createdBy: "system",
    createdDate: "2024-01-15T10:30:00Z",
    modifiedBy: "system",
    modifiedDate: "2024-01-15T10:30:00Z",
    isDeleted: false,
    isDeletedValue: false,
  },
  {
    riderId: 2,
    signupDate: "2024-02-20T14:45:00Z",
    status: "active",
    deviceToken: "device_token_2",
    phoneNumber: "+1987654321",
    otpVerified: true,
    emailId: "bob.smith@example.com",
    signupMethod: "Phone",
    fullName: "Bob Smith",
    profilePhotoUrl: "",
    dateOfBirth: "1985-08-22",
    gender: "Male",
    homeAddress: "789 Oak Rd, Los Angeles, CA 90001",
    workAddress: "321 Tech Blvd, Los Angeles, CA 90002",
    locationAccessPermission: true,
    kycIdType: "Passport",
    kycIdNumber: "PS987654321",
    kycDocumentPhotoUrl: "",
    preferredPaymentMethod: "Wallet",
    walletBalance: 245.75,
    savedPaymentMethods: ["Wallet", "UPI"],
    preferredLanguage: "English",
    notificationPreferences: ["Push"],
    promotionalConsent: false,
    createdBy: "system",
    createdDate: "2024-02-20T14:45:00Z",
    modifiedBy: "system",
    modifiedDate: "2024-02-20T14:45:00Z",
    isDeleted: false,
    isDeletedValue: false,
  },
  {
    riderId: 3,
    signupDate: "2024-03-10T09:15:00Z",
    status: "suspended",
    deviceToken: "device_token_3",
    phoneNumber: "+1122334455",
    otpVerified: false,
    emailId: "carol.white@example.com",
    signupMethod: "Google",
    fullName: "Carol White",
    profilePhotoUrl: "",
    dateOfBirth: "1992-11-30",
    gender: "Female",
    homeAddress: "555 Pine St, Chicago, IL 60601",
    workAddress: "",
    locationAccessPermission: false,
    kycIdType: "National ID",
    kycIdNumber: "NID456789123",
    kycDocumentPhotoUrl: "",
    preferredPaymentMethod: "Cash",
    walletBalance: 0,
    savedPaymentMethods: [],
    preferredLanguage: "English",
    notificationPreferences: ["Email"],
    promotionalConsent: true,
    createdBy: "system",
    createdDate: "2024-03-10T09:15:00Z",
    modifiedBy: "admin",
    modifiedDate: "2024-03-15T16:20:00Z",
    isDeleted: false,
    isDeletedValue: false,
  },
];

const Riders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<RiderData | null>(null);
  const [riderToDelete, setRiderToDelete] = useState<RiderData | null>(null);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Add rider form
  const addRiderForm = useForm<RiderFormValues>({
    resolver: zodResolver(riderSchema),
    defaultValues: {
      fullName: "",
      emailId: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "Prefer not to say",
      homeAddress: "",
      workAddress: "",
      signupMethod: "Email",
      preferredPaymentMethod: "Cash",
      preferredLanguage: "English",
      status: "active",
      otpVerified: false,
      locationAccessPermission: false,
      promotionalConsent: false,
      profilePhotoUrl: "",
      kycIdType: "",
      kycIdNumber: "",
      kycDocumentPhotoUrl: "",
    },
  });

  // Edit rider form
  const editRiderForm = useForm<RiderFormValues>({
    resolver: zodResolver(riderSchema),
    defaultValues: {
      fullName: "",
      emailId: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "Prefer not to say",
      homeAddress: "",
      workAddress: "",
      signupMethod: "Email",
      preferredPaymentMethod: "Cash",
      preferredLanguage: "English",
      status: "active",
      otpVerified: false,
      locationAccessPermission: false,
      promotionalConsent: false,
      profilePhotoUrl: "",
      kycIdType: "",
      kycIdNumber: "",
      kycDocumentPhotoUrl: "",
    },
  });

  const onAddRiderSubmit = (data: RiderFormValues) => {
    console.log("Adding rider:", data);
    toast({
      title: "Rider Created",
      description: `Rider "${data.fullName}" has been successfully created.`,
    });
    setIsAddDialogOpen(false);
    addRiderForm.reset();
  };

  const onEditRiderSubmit = (data: RiderFormValues) => {
    console.log("Updating rider:", data);
    toast({
      title: "Rider Updated",
      description: `Rider "${data.fullName}" has been successfully updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedRider(null);
    editRiderForm.reset();
  };

  const handleEditRider = (rider: RiderData) => {
    setSelectedRider(rider);
    editRiderForm.reset({
      fullName: rider.fullName,
      emailId: rider.emailId,
      phoneNumber: rider.phoneNumber,
      dateOfBirth: rider.dateOfBirth,
      gender: rider.gender as "Male" | "Female" | "Other" | "Prefer not to say",
      homeAddress: rider.homeAddress,
      workAddress: rider.workAddress,
      signupMethod: rider.signupMethod as "Email" | "Phone" | "Google" | "Facebook",
      preferredPaymentMethod: rider.preferredPaymentMethod as "Cash" | "Credit Card" | "Debit Card" | "Wallet" | "UPI",
      preferredLanguage: rider.preferredLanguage,
      status: rider.status as "active" | "inactive" | "suspended",
      otpVerified: rider.otpVerified,
      locationAccessPermission: rider.locationAccessPermission,
      promotionalConsent: rider.promotionalConsent,
      profilePhotoUrl: rider.profilePhotoUrl,
      kycIdType: rider.kycIdType,
      kycIdNumber: rider.kycIdNumber,
      kycDocumentPhotoUrl: rider.kycDocumentPhotoUrl,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (rider: RiderData) => {
    setRiderToDelete(rider);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (riderToDelete) {
      console.log("Deleting rider:", riderToDelete.riderId);
      toast({
        title: "Rider Deleted",
        description: `Rider "${riderToDelete.fullName}" has been permanently deleted.`,
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setRiderToDelete(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "active":
        return "bg-green-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredRiders = ridersData.filter(rider =>
    rider.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.emailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.phoneNumber.includes(searchQuery)
  );

  // Define table columns
  const columns = useMemo<ColumnDef<RiderData>[]>(
    () => [
      {
        header: "Rider",
        accessorKey: "fullName",
        cell: (rider) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                {getInitials(rider.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{rider.fullName}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {rider.phoneNumber}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Contact",
        accessorKey: "emailId",
        cell: (rider) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              {rider.emailId}
            </div>
            <Badge variant="outline" className="text-xs">
              {rider.signupMethod}
            </Badge>
          </div>
        ),
      },
      {
        header: "Location",
        accessorKey: "homeAddress",
        cell: (rider) => (
          <div className="max-w-xs">
            {rider.homeAddress ? (
              <div className="flex items-start gap-1 text-sm">
                <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="truncate">{rider.homeAddress}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">No address</span>
            )}
          </div>
        ),
      },
      {
        header: "Wallet",
        accessorKey: "walletBalance",
        cell: (rider) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1 font-semibold">
              <Wallet className="h-4 w-4 text-primary" />
              ${rider.walletBalance.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              {rider.preferredPaymentMethod}
            </div>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (rider) => (
          <div className="space-y-1">
            <Badge className={getStatusBadgeClass(rider.status)}>
              {rider.status.toUpperCase()}
            </Badge>
            {rider.otpVerified && (
              <Badge variant="outline" className="text-xs block w-fit">
                ✓ Verified
              </Badge>
            )}
          </div>
        ),
      },
      {
        header: "Signup Date",
        accessorKey: "signupDate",
        cell: (rider) => (
          <div className="text-sm">
            {new Date(rider.signupDate).toLocaleDateString()}
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (rider) => (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditRider(rider)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteClick(rider)}
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
                  <Car className="h-8 w-8 text-primary" />
                  Rider Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage riders and their profiles
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Rider
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Rider</DialogTitle>
                    <DialogDescription>
                      Create a new rider profile with required information
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...addRiderForm}>
                    <form onSubmit={addRiderForm.handleSubmit(onAddRiderSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <FormField
                          control={addRiderForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email */}
                        <FormField
                          control={addRiderForm.control}
                          name="emailId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Phone Number */}
                        <FormField
                          control={addRiderForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+1234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Date of Birth */}
                        <FormField
                          control={addRiderForm.control}
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

                        {/* Gender */}
                        <FormField
                          control={addRiderForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background">
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Signup Method */}
                        <FormField
                          control={addRiderForm.control}
                          name="signupMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Signup Method *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background">
                                  <SelectItem value="Email">Email</SelectItem>
                                  <SelectItem value="Phone">Phone</SelectItem>
                                  <SelectItem value="Google">Google</SelectItem>
                                  <SelectItem value="Facebook">Facebook</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Preferred Payment Method */}
                        <FormField
                          control={addRiderForm.control}
                          name="preferredPaymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Payment *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select payment" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background">
                                  <SelectItem value="Cash">Cash</SelectItem>
                                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                                  <SelectItem value="Wallet">Wallet</SelectItem>
                                  <SelectItem value="UPI">UPI</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Preferred Language */}
                        <FormField
                          control={addRiderForm.control}
                          name="preferredLanguage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Language *</FormLabel>
                              <FormControl>
                                <Input placeholder="English" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Status */}
                        <FormField
                          control={addRiderForm.control}
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
                                  <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Home Address */}
                      <FormField
                        control={addRiderForm.control}
                        name="homeAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Home Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="123 Main St, City, State, ZIP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Work Address */}
                      <FormField
                        control={addRiderForm.control}
                        name="workAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="456 Business Ave, City, State, ZIP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Document Upload Section */}
                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-semibold">Profile & KYC Documents</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Profile Photo */}
                          <FormField
                            control={addRiderForm.control}
                            name="profilePhotoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Profile Photo</FormLabel>
                                <FormControl>
                                  <div className="space-y-2">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          field.onChange(URL.createObjectURL(file));
                                        }
                                      }}
                                      className="cursor-pointer"
                                    />
                                    {field.value && (
                                      <p className="text-sm text-muted-foreground">✓ File selected</p>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* KYC ID Type */}
                          <FormField
                            control={addRiderForm.control}
                            name="kycIdType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>KYC ID Type</FormLabel>
                                <FormControl>
                                  <Input placeholder="Passport, Driving License, National ID" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* KYC ID Number */}
                          <FormField
                            control={addRiderForm.control}
                            name="kycIdNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>KYC ID Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="ID number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* KYC Document Photo */}
                          <FormField
                            control={addRiderForm.control}
                            name="kycDocumentPhotoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>KYC Document Photo</FormLabel>
                                <FormControl>
                                  <div className="space-y-2">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          field.onChange(URL.createObjectURL(file));
                                        }
                                      }}
                                      className="cursor-pointer"
                                    />
                                    {field.value && (
                                      <p className="text-sm text-muted-foreground">✓ File selected</p>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="space-y-3 pt-4 border-t">
                        <FormField
                          control={addRiderForm.control}
                          name="otpVerified"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>OTP Verified</FormLabel>
                                <FormDescription>
                                  Mark if the rider's phone/email is verified
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addRiderForm.control}
                          name="locationAccessPermission"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Location Access Permission</FormLabel>
                                <FormDescription>
                                  Grant location access for better service
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addRiderForm.control}
                          name="promotionalConsent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Promotional Consent</FormLabel>
                                <FormDescription>
                                  Allow sending promotional messages
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create Rider
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
                placeholder="Search riders by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Riders DataTable */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-900">
            <DataTable
              data={filteredRiders}
              columns={columns}
            />
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>Edit Rider</DialogTitle>
            <DialogDescription>
              Update rider information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editRiderForm}>
            <form onSubmit={editRiderForm.handleSubmit(onEditRiderSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <FormField
                  control={editRiderForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={editRiderForm.control}
                  name="emailId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={editRiderForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Birth */}
                <FormField
                  control={editRiderForm.control}
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

                {/* Gender */}
                <FormField
                  control={editRiderForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background">
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Signup Method */}
                <FormField
                  control={editRiderForm.control}
                  name="signupMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signup Method *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background">
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Phone">Phone</SelectItem>
                          <SelectItem value="Google">Google</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferred Payment Method */}
                <FormField
                  control={editRiderForm.control}
                  name="preferredPaymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Payment *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select payment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background">
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Debit Card">Debit Card</SelectItem>
                          <SelectItem value="Wallet">Wallet</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferred Language */}
                <FormField
                  control={editRiderForm.control}
                  name="preferredLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language *</FormLabel>
                      <FormControl>
                        <Input placeholder="English" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={editRiderForm.control}
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
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Home Address */}
              <FormField
                control={editRiderForm.control}
                name="homeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="123 Main St, City, State, ZIP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Work Address */}
              <FormField
                control={editRiderForm.control}
                name="workAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="456 Business Ave, City, State, ZIP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document Upload Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Profile & KYC Documents</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Profile Photo */}
                  <FormField
                    control={editRiderForm.control}
                    name="profilePhotoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Photo</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(URL.createObjectURL(file));
                                }
                              }}
                              className="cursor-pointer"
                            />
                            {field.value && (
                              <p className="text-sm text-muted-foreground">✓ File selected</p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* KYC ID Type */}
                  <FormField
                    control={editRiderForm.control}
                    name="kycIdType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KYC ID Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Passport, Driving License, National ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* KYC ID Number */}
                  <FormField
                    control={editRiderForm.control}
                    name="kycIdNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KYC ID Number</FormLabel>
                        <FormControl>
                          <Input placeholder="ID number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* KYC Document Photo */}
                  <FormField
                    control={editRiderForm.control}
                    name="kycDocumentPhotoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KYC Document Photo</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(URL.createObjectURL(file));
                                }
                              }}
                              className="cursor-pointer"
                            />
                            {field.value && (
                              <p className="text-sm text-muted-foreground">✓ File selected</p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-4 border-t">
                <FormField
                  control={editRiderForm.control}
                  name="otpVerified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>OTP Verified</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editRiderForm.control}
                  name="locationAccessPermission"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Location Access Permission</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editRiderForm.control}
                  name="promotionalConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Promotional Consent</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                  Update Rider
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
              This action cannot be undone. This will permanently delete the rider
              <span className="font-semibold"> {riderToDelete?.fullName}</span> and remove
              all associated data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Rider
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Riders;
