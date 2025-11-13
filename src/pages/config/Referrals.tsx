import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Users, Search, Plus, Edit, Trash2, Gift, MoreHorizontal, UserPlus, UserCheck } from "lucide-react";
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
  FormDescription,
} from "@/components/ui/form";
import { DataTable, ColumnDef } from "@/components/DataTable";
import {
  useReferralCampaignsList,
  useCreateReferralCampaign,
  useUpdateReferralCampaign,
  useDeleteReferralCampaign,
  useToggleReferralCampaignStatus,
  ReferralCampaignDTO
} from "@/services/queryService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Validation schema for add/edit referral campaign
const referralCampaignSchema = z.object({
  referrerRewardType: z.enum(["CASH", "CREDIT", "RIDE"], {
    required_error: "Please select referrer reward type",
  }),
  referrerRewardValue: z.number()
    .min(0, { message: "Referrer reward cannot be negative" })
    .max(10000, { message: "Referrer reward too high" }),
  referredRewardType: z.enum(["CASH", "CREDIT", "RIDE", "DISCOUNT"], {
    required_error: "Please select referred reward type",
  }),
  referredRewardValue: z.number()
    .min(0, { message: "Referred reward cannot be negative" })
    .max(10000, { message: "Referred reward too high" }),
  validityDays: z.number()
    .min(1, { message: "Validity must be at least 1 day" })
    .max(365, { message: "Validity cannot exceed 365 days" }),
  maxUsesPerReferrer: z.number()
    .min(1, { message: "Max uses must be at least 1" })
    .max(1000, { message: "Max uses cannot exceed 1000" })
    .optional(),
  isActive: z.boolean(),
});

type ReferralCampaignFormValues = z.infer<typeof referralCampaignSchema>;

export default function Referrals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<ReferralCampaignDTO | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<ReferralCampaignDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  // API hooks
  const { data: campaignsResponse, isLoading, error } = useReferralCampaignsList(
    { page: pagination.page, size: pagination.size, sort: [] },
    searchQuery || undefined
  );

  const createMutation = useCreateReferralCampaign();
  const updateMutation = useUpdateReferralCampaign();
  const deleteMutation = useDeleteReferralCampaign();
  const toggleStatusMutation = useToggleReferralCampaignStatus();

  const campaignsList = campaignsResponse?.data || [];

  // Add campaign form
  const addCampaignForm = useForm<ReferralCampaignFormValues>({
    resolver: zodResolver(referralCampaignSchema),
    defaultValues: {
      referrerRewardType: "CREDIT",
      referrerRewardValue: 10,
      referredRewardType: "DISCOUNT",
      referredRewardValue: 5,
      validityDays: 30,
      maxUsesPerReferrer: 10,
      isActive: true,
    },
  });

  // Edit campaign form
  const editCampaignForm = useForm<ReferralCampaignFormValues>({
    resolver: zodResolver(referralCampaignSchema),
    defaultValues: {
      referrerRewardType: "CREDIT",
      referrerRewardValue: 10,
      referredRewardType: "DISCOUNT",
      referredRewardValue: 5,
      validityDays: 30,
      maxUsesPerReferrer: 10,
      isActive: true,
    },
  });

  const onAddCampaignSubmit = (data: ReferralCampaignFormValues) => {
    createMutation.mutate({
      referrerRewardType: data.referrerRewardType,
      referrerRewardValue: data.referrerRewardValue,
      referredRewardType: data.referredRewardType,
      referredRewardValue: data.referredRewardValue,
      validityDays: data.validityDays,
      maxUsesPerReferrer: data.maxUsesPerReferrer,
      isActive: data.isActive,
    });
    setIsAddDialogOpen(false);
    addCampaignForm.reset();
  };

  const onEditCampaignSubmit = (data: ReferralCampaignFormValues) => {
    if (selectedCampaign) {
      updateMutation.mutate({
        id: selectedCampaign.referralCampaignId!,
        data: {
          referralCampaignId: selectedCampaign.referralCampaignId,
          referrerRewardType: data.referrerRewardType,
          referrerRewardValue: data.referrerRewardValue,
          referredRewardType: data.referredRewardType,
          referredRewardValue: data.referredRewardValue,
          validityDays: data.validityDays,
          maxUsesPerReferrer: data.maxUsesPerReferrer,
          isActive: data.isActive,
        },
      });
    }
    setIsEditDialogOpen(false);
    setSelectedCampaign(null);
    editCampaignForm.reset();
  };

  const handleEditCampaign = (campaign: ReferralCampaignDTO) => {
    setSelectedCampaign(campaign);
    editCampaignForm.reset({
      referrerRewardType: (campaign.referrerRewardType as "CASH" | "CREDIT" | "RIDE") || "CREDIT",
      referrerRewardValue: campaign.referrerRewardValue || 10,
      referredRewardType: (campaign.referredRewardType as "CASH" | "CREDIT" | "RIDE" | "DISCOUNT") || "DISCOUNT",
      referredRewardValue: campaign.referredRewardValue || 5,
      validityDays: campaign.validityDays || 30,
      maxUsesPerReferrer: campaign.maxUsesPerReferrer || 10,
      isActive: campaign.isActive ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (campaign: ReferralCampaignDTO) => {
    setCampaignToDelete(campaign);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (campaignToDelete) {
      deleteMutation.mutate(campaignToDelete.referralCampaignId!);
      setIsDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleToggleStatus = (campaign: ReferralCampaignDTO) => {
    toggleStatusMutation.mutate(campaign.referralCampaignId!);
  };

  const filteredCampaigns = campaignsList.filter(campaign =>
    campaign.referrerRewardType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.referredRewardType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: boolean) => {
    return status ? "bg-green-500" : "bg-muted text-muted-foreground";
  };

  const getRewardTypeBadgeClass = (type: string) => {
    switch (type) {
      case "CASH": return "bg-green-500";
      case "CREDIT": return "bg-blue-500";
      case "RIDE": return "bg-purple-500";
      case "DISCOUNT": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const formatRewardValue = (value: number, type: string) => {
    switch (type) {
      case "CASH":
        return `$${value.toFixed(2)}`;
      case "CREDIT":
        return `${value} credits`;
      case "RIDE":
        return `${value} ride${value !== 1 ? 's' : ''}`;
      case "DISCOUNT":
        return `${value}% off`;
      default:
        return value.toString();
    }
  };

  // Define table columns
  const columns = useMemo<ColumnDef<ReferralCampaignDTO>[]>(
    () => [
      {
        header: "Campaign ID",
        accessorKey: "referralCampaignId",
        cell: (campaign) => (
          <div className="font-mono text-sm">
            #{campaign.referralCampaignId}
          </div>
        ),
      },
      {
        header: "Referrer Reward",
        sortable: false,
        cell: (campaign) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-blue-500" />
              <Badge className={getRewardTypeBadgeClass(campaign.referrerRewardType || "")}>
                {campaign.referrerRewardType || "N/A"}
              </Badge>
            </div>
            <div className="font-semibold text-lg">
              {formatRewardValue(campaign.referrerRewardValue || 0, campaign.referrerRewardType || "")}
            </div>
          </div>
        ),
      },
      {
        header: "Referred Reward",
        sortable: false,
        cell: (campaign) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-500" />
              <Badge className={getRewardTypeBadgeClass(campaign.referredRewardType || "")}>
                {campaign.referredRewardType || "N/A"}
              </Badge>
            </div>
            <div className="font-semibold text-lg">
              {formatRewardValue(campaign.referredRewardValue || 0, campaign.referredRewardType || "")}
            </div>
          </div>
        ),
      },
      {
        header: "Validity",
        accessorKey: "validityDays",
        cell: (campaign) => (
          <div className="text-sm">
            <div className="font-semibold">{campaign.validityDays || 0} days</div>
            <div className="text-muted-foreground">From referral date</div>
          </div>
        ),
      },
      {
        header: "Usage Limits",
        sortable: false,
        cell: (campaign) => (
          <div className="text-sm">
            {campaign.maxUsesPerReferrer && (
              <div>Max {campaign.maxUsesPerReferrer} uses/referrer</div>
            )}
            {!campaign.maxUsesPerReferrer && (
              <div className="text-muted-foreground">Unlimited uses</div>
            )}
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: (campaign) => (
          <Badge className={getStatusBadgeClass(campaign.isActive ?? false)}>
            {campaign.isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
        ),
      },
      {
        header: "Actions",
        sortable: false,
        className: "text-right",
        cell: (campaign) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatus(campaign)}>
                <Switch className="h-4 w-4 mr-2" />
                {campaign.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(campaign)}
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

  const ReferralCampaignFormFields = ({ form }: { form: any }) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Referrer Reward Type */}
        <FormField
          control={form.control}
          name="referrerRewardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referrer Reward Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reward type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CASH">Cash ($)</SelectItem>
                  <SelectItem value="CREDIT">Account Credits</SelectItem>
                  <SelectItem value="RIDE">Free Rides</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>What the referrer gets for referring</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Referrer Reward Value */}
        <FormField
          control={form.control}
          name="referrerRewardValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referrer Reward Value *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                {form.watch("referrerRewardType") === "CASH" && "Amount in dollars"}
                {form.watch("referrerRewardType") === "CREDIT" && "Number of credits"}
                {form.watch("referrerRewardType") === "RIDE" && "Number of free rides"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Referred Reward Type */}
        <FormField
          control={form.control}
          name="referredRewardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referred Reward Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reward type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CASH">Cash ($)</SelectItem>
                  <SelectItem value="CREDIT">Account Credits</SelectItem>
                  <SelectItem value="RIDE">Free Rides</SelectItem>
                  <SelectItem value="DISCOUNT">Discount (%)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>What the referred user gets</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Referred Reward Value */}
        <FormField
          control={form.control}
          name="referredRewardValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referred Reward Value *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="5"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                {form.watch("referredRewardType") === "CASH" && "Amount in dollars"}
                {form.watch("referredRewardType") === "CREDIT" && "Number of credits"}
                {form.watch("referredRewardType") === "RIDE" && "Number of free rides"}
                {form.watch("referredRewardType") === "DISCOUNT" && "Discount percentage"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Validity Days */}
        <FormField
          control={form.control}
          name="validityDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validity Period (Days) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  placeholder="30"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>How long the referral is valid</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Uses Per Referrer */}
        <FormField
          control={form.control}
          name="maxUsesPerReferrer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Uses Per Referrer</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Maximum referrals per user (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Is Active */}
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active Status</FormLabel>
              <FormDescription>
                Enable this referral campaign for new users
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
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
                  <Users className="h-8 w-8 text-primary" />
                  Referral Campaign Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage referral programs and reward campaigns
                </p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Referral Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
                  <DialogHeader>
                    <DialogTitle>Add New Referral Campaign</DialogTitle>
                    <DialogDescription>
                      Create a new referral program with rewards
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...addCampaignForm}>
                    <form onSubmit={addCampaignForm.handleSubmit(onAddCampaignSubmit)} className="space-y-4">
                      <ReferralCampaignFormFields form={addCampaignForm} />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create Campaign
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
                placeholder="Search by reward type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Referral Campaigns Table */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading referral campaigns</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <DataTable
                data={filteredCampaigns}
                columns={columns}
                pageSize={pagination.size}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                currentPage={pagination.page}
              />
            )}
          </div>

          {/* Edit Referral Campaign Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Edit Referral Campaign</DialogTitle>
                <DialogDescription>
                  Update referral campaign settings and rewards
                </DialogDescription>
              </DialogHeader>

              <Form {...editCampaignForm}>
                <form onSubmit={editCampaignForm.handleSubmit(onEditCampaignSubmit)} className="space-y-4">
                  <ReferralCampaignFormFields form={editCampaignForm} />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                      Update Campaign
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
                  This will permanently delete the referral campaign #{campaignToDelete?.referralCampaignId}.
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