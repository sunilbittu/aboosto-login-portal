import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, ColumnDef } from "@/components/DataTable";
import { Plus, Edit, Trash2, Search, Users, Gift, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const referralSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required").max(100),
  referrerRewardType: z.string().min(1, "Referrer reward type is required"),
  referrerRewardValue: z.string().min(1, "Referrer reward value is required"),
  referredRewardType: z.string().min(1, "Referee reward type is required"),
  referredRewardValue: z.string().min(1, "Referee reward value is required"),
  validityDays: z.string().min(1, "Validity days is required"),
  maxUsesPerReferrer: z.string().min(1, "Max uses per referrer is required"),
  isActive: z.boolean().default(true),
});

type ReferralFormData = z.infer<typeof referralSchema>;

interface ReferralCampaign {
  referralCampaignId: number;
  campaignName: string;
  referrerRewardType: string;
  referrerRewardValue: number;
  referredRewardType: string;
  referredRewardValue: number;
  validityDays: number;
  maxUsesPerReferrer: number;
  totalReferrals: number;
  successfulReferrals: number;
  isActive: boolean;
  createdDate: string;
}

export default function Referrals() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>([
    {
      referralCampaignId: 1,
      campaignName: "New Year Special",
      referrerRewardType: "CASH",
      referrerRewardValue: 100,
      referredRewardType: "DISCOUNT",
      referredRewardValue: 50,
      validityDays: 30,
      maxUsesPerReferrer: 10,
      totalReferrals: 245,
      successfulReferrals: 189,
      isActive: true,
      createdDate: "2024-01-01",
    },
    {
      referralCampaignId: 2,
      campaignName: "Summer Campaign",
      referrerRewardType: "RIDE_CREDITS",
      referrerRewardValue: 200,
      referredRewardType: "CASH",
      referredRewardValue: 75,
      validityDays: 60,
      maxUsesPerReferrer: 20,
      totalReferrals: 512,
      successfulReferrals: 401,
      isActive: true,
      createdDate: "2024-06-01",
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<ReferralCampaign | null>(null);

  const rewardTypes = ["CASH", "DISCOUNT", "RIDE_CREDITS", "CASHBACK"];

  const form = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      campaignName: "",
      referrerRewardType: "",
      referrerRewardValue: "",
      referredRewardType: "",
      referredRewardValue: "",
      validityDays: "",
      maxUsesPerReferrer: "",
      isActive: true,
    },
  });

  const columns: ColumnDef<ReferralCampaign>[] = [
    {
      header: "Campaign Name",
      accessorKey: "campaignName",
      cell: (row: ReferralCampaign) => (
        <div>
          <div className="font-medium">{row.campaignName}</div>
          <div className="text-xs text-muted-foreground">
            Created: {new Date(row.createdDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      header: "Referrer Reward",
      accessorKey: "referrerRewardValue",
      cell: (row: ReferralCampaign) => (
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-primary" />
          <div>
            <div className="font-medium">
              {row.referrerRewardType === "DISCOUNT" ? `${row.referrerRewardValue}%` : `₹${row.referrerRewardValue}`}
            </div>
            <div className="text-xs text-muted-foreground">{row.referrerRewardType.replace("_", " ")}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Referee Reward",
      accessorKey: "referredRewardValue",
      cell: (row: ReferralCampaign) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-secondary" />
          <div>
            <div className="font-medium">
              {row.referredRewardType === "DISCOUNT" ? `${row.referredRewardValue}%` : `₹${row.referredRewardValue}`}
            </div>
            <div className="text-xs text-muted-foreground">{row.referredRewardType.replace("_", " ")}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Validity",
      accessorKey: "validityDays",
      cell: (row: ReferralCampaign) => (
        <Badge variant="outline">{row.validityDays} days</Badge>
      ),
    },
    {
      header: "Max Uses",
      accessorKey: "maxUsesPerReferrer",
      cell: (row: ReferralCampaign) => (
        <span className="text-sm">{row.maxUsesPerReferrer} per user</span>
      ),
    },
    {
      header: "Performance",
      accessorKey: "totalReferrals",
      cell: (row: ReferralCampaign) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <div>
            <div className="font-medium">{row.successfulReferrals} successful</div>
            <div className="text-xs text-muted-foreground">
              {row.totalReferrals} total ({Math.round((row.successfulReferrals / row.totalReferrals) * 100)}% conversion)
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (row: ReferralCampaign) => (
        <Badge variant={row.isActive ? "default" : "secondary"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "referralCampaignId",
      cell: (row: ReferralCampaign) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = (data: ReferralFormData) => {
    const newCampaign: ReferralCampaign = {
      referralCampaignId: campaigns.length + 1,
      campaignName: data.campaignName,
      referrerRewardType: data.referrerRewardType,
      referrerRewardValue: parseFloat(data.referrerRewardValue),
      referredRewardType: data.referredRewardType,
      referredRewardValue: parseFloat(data.referredRewardValue),
      validityDays: parseInt(data.validityDays),
      maxUsesPerReferrer: parseInt(data.maxUsesPerReferrer),
      totalReferrals: 0,
      successfulReferrals: 0,
      isActive: data.isActive,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setCampaigns([...campaigns, newCampaign]);
    setIsAddDialogOpen(false);
    form.reset();
    toast({
      title: "Success",
      description: "Referral campaign created successfully",
    });
  };

  const handleEdit = (campaign: ReferralCampaign) => {
    setSelectedCampaign(campaign);
    form.reset({
      campaignName: campaign.campaignName,
      referrerRewardType: campaign.referrerRewardType,
      referrerRewardValue: campaign.referrerRewardValue.toString(),
      referredRewardType: campaign.referredRewardType,
      referredRewardValue: campaign.referredRewardValue.toString(),
      validityDays: campaign.validityDays.toString(),
      maxUsesPerReferrer: campaign.maxUsesPerReferrer.toString(),
      isActive: campaign.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: ReferralFormData) => {
    if (!selectedCampaign) return;

    const updatedCampaigns = campaigns.map(c =>
      c.referralCampaignId === selectedCampaign.referralCampaignId
        ? {
            ...c,
            campaignName: data.campaignName,
            referrerRewardType: data.referrerRewardType,
            referrerRewardValue: parseFloat(data.referrerRewardValue),
            referredRewardType: data.referredRewardType,
            referredRewardValue: parseFloat(data.referredRewardValue),
            validityDays: parseInt(data.validityDays),
            maxUsesPerReferrer: parseInt(data.maxUsesPerReferrer),
            isActive: data.isActive,
          }
        : c
    );

    setCampaigns(updatedCampaigns);
    setIsEditDialogOpen(false);
    setSelectedCampaign(null);
    toast({
      title: "Success",
      description: "Referral campaign updated successfully",
    });
  };

  const handleDeleteClick = (campaign: ReferralCampaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedCampaign) return;

    setCampaigns(campaigns.filter(c => c.referralCampaignId !== selectedCampaign.referralCampaignId));
    setIsDeleteDialogOpen(false);
    setSelectedCampaign(null);
    toast({
      title: "Success",
      description: "Referral campaign deleted successfully",
    });
  };

  const filteredCampaigns = campaigns.filter(
    campaign =>
      campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.referrerRewardType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.referredRewardType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReferrals = campaigns.reduce((sum, c) => sum + c.totalReferrals, 0);
  const totalSuccessful = campaigns.reduce((sum, c) => sum + c.successfulReferrals, 0);
  const avgConversion = totalReferrals > 0 ? Math.round((totalSuccessful / totalReferrals) * 100) : 0;

  const ReferralForm = ({ onSubmit }: { onSubmit: (data: ReferralFormData) => void }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="campaignName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New Year Special" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Referrer Rewards (Person who refers)
            </h3>
          </div>

          <FormField
            control={form.control}
            name="referrerRewardType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select reward type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background z-50">
                    {rewardTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referrerRewardValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward Value</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Referee Rewards (New user who signs up)
            </h3>
          </div>

          <FormField
            control={form.control}
            name="referredRewardType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select reward type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background z-50">
                    {rewardTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referredRewardValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward Value</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <h3 className="text-sm font-medium mb-3">Campaign Rules</h3>
          </div>

          <FormField
            control={form.control}
            name="validityDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validity (Days)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxUsesPerReferrer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Uses Per Referrer</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable or disable this referral campaign
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Save Campaign</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Referrals</h1>
            <p className="text-muted-foreground">Manage referral programs and rewards</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Referral Campaign</DialogTitle>
                <DialogDescription>Create a new referral program with rewards for both referrer and referee</DialogDescription>
              </DialogHeader>
              <ReferralForm onSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReferrals}</div>
              <p className="text-xs text-muted-foreground">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSuccessful}</div>
              <p className="text-xs text-muted-foreground">Completed sign-ups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgConversion}%</div>
              <p className="text-xs text-muted-foreground">Average across campaigns</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Referral Campaigns</CardTitle>
            <div className="flex items-center gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by campaign name or reward type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={filteredCampaigns} />
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Referral Campaign</DialogTitle>
              <DialogDescription>Update referral program details and rewards</DialogDescription>
            </DialogHeader>
            <ReferralForm onSubmit={handleUpdate} />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the referral campaign "{selectedCampaign?.campaignName}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
