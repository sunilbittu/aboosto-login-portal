import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Car, Search, Eye, Phone, Mail, MapPin, Calendar, CheckCircle, XCircle, User, MoreHorizontal, Clock } from "lucide-react";
import { useState, useMemo } from "react";
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
import {
  useRiders,
  useApproveRider,
  useRejectRider,
  useActivateRider,
  useDeactivateRider,
  RiderVO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Validation schema for rider rejection
const riderRejectionSchema = z.object({
  rejectionReason: z.string()
    .trim()
    .min(10, { message: "Rejection reason must be at least 10 characters" })
    .max(500, { message: "Rejection reason must be less than 500 characters" }),
});

type RiderRejectionFormValues = z.infer<typeof riderRejectionSchema>;

export default function Riders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<RiderVO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: ridersResponse, isLoading, error } = useRiders(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const approveMutation = useApproveRider();
  const rejectMutation = useRejectRider();
  const activateMutation = useActivateRider();
  const deactivateMutation = useDeactivateRider();

  const riders = ridersResponse?.data || [];

  // Rejection form
  const rejectionForm = useForm<RiderRejectionFormValues>({
    resolver: zodResolver(riderRejectionSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const onRejectionSubmit = (data: RiderRejectionFormValues) => {
    if (selectedRider) {
      rejectMutation.mutate({
        id: selectedRider.id,
        reason: data.rejectionReason,
      });
      setIsRejectDialogOpen(false);
      setSelectedRider(null);
      rejectionForm.reset();
    }
  };

  const handleViewDetails = (rider: RiderVO) => {
    setSelectedRider(rider);
    setIsDetailsDialogOpen(true);
  };

  const handleApprove = (rider: RiderVO) => {
    approveMutation.mutate(rider.id);
  };

  const handleReject = (rider: RiderVO) => {
    setSelectedRider(rider);
    setIsRejectDialogOpen(true);
  };

  const handleActivate = (rider: RiderVO) => {
    activateMutation.mutate(rider.id);
  };

  const handleDeactivate = (rider: RiderVO) => {
    deactivateMutation.mutate(rider.id);
  };

  const filteredRiders = riders.filter(rider =>
    rider.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.phone?.includes(searchQuery) ||
    rider.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.vehicleCategory?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (isApproved: boolean, isOnline: boolean) => {
    if (!isApproved) return <Badge className="bg-yellow-500">PENDING</Badge>;
    if (isOnline) return <Badge className="bg-green-500">ONLINE</Badge>;
    return <Badge className="bg-gray-500">OFFLINE</Badge>;
  };

  const getApprovalStatusBadge = (isApproved: boolean) => {
    if (isApproved) return <Badge className="bg-green-500">APPROVED</Badge>;
    return <Badge className="bg-yellow-500">PENDING</Badge>;
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Define table columns
  const columns = useMemo<ColumnDef<RiderVO>[]>(
    () => [
      {
        header: "Rider",
        accessorKey: "firstName",
        cell: (rider) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(rider.firstName, rider.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{rider.firstName} {rider.lastName}</div>
              <div className="text-sm text-muted-foreground">ID: {rider.id}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Contact",
        sortable: false,
        cell: (rider) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span>{rider.email}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{rider.phone}</span>
            </div>
          </div>
        ),
      },
      {
        header: "License",
        accessorKey: "licenseNumber",
        cell: (rider) => (
          <div className="text-sm font-mono">{rider.licenseNumber || "N/A"}</div>
        ),
      },
      {
        header: "Vehicle Category",
        accessorKey: "vehicleCategory",
        cell: (rider) => (
          <div className="flex items-center gap-1 text-sm">
            <Car className="h-3 w-3 text-muted-foreground" />
            <span>{rider.vehicleCategory || "N/A"}</span>
          </div>
        ),
      },
      {
        header: "Status",
        sortable: false,
        cell: (rider) => (
          <div className="space-y-1">
            <div>{getApprovalStatusBadge(rider.isApproved)}</div>
            {rider.isApproved && (
              <div className={`text-xs ${rider.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {rider.isOnline ? 'Online' : 'Offline'}
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Registered",
        accessorKey: "registeredAt",
        cell: (rider) => (
          <div className="text-sm">
            <div>{formatDate(rider.registeredAt)}</div>
            <div className="text-xs text-muted-foreground">
              {rider.lastActiveAt ? `Last active: ${formatDate(rider.lastActiveAt)}` : "Never active"}
            </div>
          </div>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (rider) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(rider)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {!rider.isApproved && (
                <DropdownMenuItem onClick={() => handleApprove(rider)} className="text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </DropdownMenuItem>
              )}
              {!rider.isApproved && (
                <DropdownMenuItem onClick={() => handleReject(rider)} className="text-red-600">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              )}
              {rider.isApproved && rider.isOnline && (
                <DropdownMenuItem onClick={() => handleDeactivate(rider)} className="text-orange-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Deactivate
                </DropdownMenuItem>
              )}
              {rider.isApproved && !rider.isOnline && (
                <DropdownMenuItem onClick={() => handleActivate(rider)} className="text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
                  Manage rider registrations, approvals, and activity status
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mt-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, phone, license, or vehicle category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Riders Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading riders</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredRiders}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Rider Details Dialog */}
          <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
            <DialogContent className="max-w-2xl bg-background">
              <DialogHeader>
                <DialogTitle>Rider Details</DialogTitle>
                <DialogDescription>
                  Complete information about the rider
                </DialogDescription>
              </DialogHeader>

              {selectedRider && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {getInitials(selectedRider.firstName, selectedRider.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedRider.firstName} {selectedRider.lastName}
                      </h3>
                      <p className="text-muted-foreground">Rider ID: {selectedRider.id}</p>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(selectedRider.isApproved, selectedRider.isOnline)}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-sm">{selectedRider.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-sm">{selectedRider.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">License Number</Label>
                      <p className="text-sm font-mono">{selectedRider.licenseNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Vehicle Category</Label>
                      <p className="text-sm">{selectedRider.vehicleCategory || "Not specified"}</p>
                    </div>
                  </div>

                  {/* Timeline Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Registration Date</Label>
                      <p className="text-sm">{formatDateTime(selectedRider.registeredAt)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Last Active</Label>
                      <p className="text-sm">
                        {selectedRider.lastActiveAt ? formatDateTime(selectedRider.lastActiveAt) : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Rejection Dialog */}
          <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <AlertDialogContent className="max-w-md bg-background">
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Rider Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Please provide a reason for rejecting {selectedRider?.firstName} {selectedRider?.lastName}'s application.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <Form {...rejectionForm}>
                <form onSubmit={rejectionForm.handleSubmit(onRejectionSubmit)} className="space-y-4">
                  <FormField
                    control={rejectionForm.control}
                    name="rejectionReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rejection Reason *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please explain why this rider application is being rejected..."
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Reject Application
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </Form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </DashboardLayout>
  );
}