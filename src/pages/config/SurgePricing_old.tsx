import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/DataTable";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Types
interface LocalTime {
  hour: number;
  minute: number;
  second?: number;
  nano?: number;
}

interface CityMaster {
  cityId: number;
  cityName: string;
  code: string;
  state: {
    stateId: number;
    stateName: string;
    country: {
      countryId: number;
      countryName: string;
    };
  };
}

interface SurgePricingData {
  surgeRuleId: number;
  vehicleCategoryId: number;
  vehicleCategoryName: string;
  city: CityMaster;
  startTime: LocalTime;
  endTime: LocalTime;
  surgeMultiplier: number;
  dayOfWeek: string;
  maxSurgeCap: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  isDeletedValue: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
}

// Mock data
const mockCountries = [
  { countryId: 1, countryName: "United States", code: "US" },
  { countryId: 2, countryName: "Canada", code: "CA" },
  { countryId: 3, countryName: "United Kingdom", code: "UK" },
];

const mockStates = [
  { stateId: 1, stateName: "California", code: "CA", countryId: 1 },
  { stateId: 2, stateName: "Texas", code: "TX", countryId: 1 },
  { stateId: 3, stateName: "Ontario", code: "ON", countryId: 2 },
  { stateId: 4, stateName: "England", code: "EN", countryId: 3 },
];

const mockCities = [
  { cityId: 1, cityName: "Los Angeles", code: "LA", stateId: 1 },
  { cityId: 2, cityName: "San Francisco", code: "SF", stateId: 1 },
  { cityId: 3, cityName: "Houston", code: "HOU", stateId: 2 },
  { cityId: 4, cityName: "Toronto", code: "TOR", stateId: 3 },
];

const mockVehicleCategories = [
  { vehicleCategoryId: 1, vehicleCategoryName: "Economy" },
  { vehicleCategoryId: 2, vehicleCategoryName: "Comfort" },
  { vehicleCategoryId: 3, vehicleCategoryName: "Premium" },
  { vehicleCategoryId: 4, vehicleCategoryName: "SUV" },
];

const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY", "ALL"];

// Form validation schema
const surgePricingSchema = z.object({
  vehicleCategoryId: z.number().min(1, "Vehicle category is required"),
  cityId: z.number().min(1, "City is required"),
  startTime: z.object({
    hour: z.number().min(0).max(23),
    minute: z.number().min(0).max(59),
  }),
  endTime: z.object({
    hour: z.number().min(0).max(23),
    minute: z.number().min(0).max(59),
  }),
  surgeMultiplier: z.number().min(1, "Surge multiplier must be at least 1.0").max(10, "Surge multiplier cannot exceed 10.0"),
  dayOfWeek: z.string().min(1, "Day of week is required"),
  maxSurgeCap: z.number().min(0, "Max surge cap must be positive"),
  isActive: z.boolean(),
});

type SurgePricingFormData = z.infer<typeof surgePricingSchema>;

export default function SurgePricing() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSurge, setSelectedSurge] = useState<SurgePricingData | null>(null);

  // Form state
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<SurgePricingFormData>>({
    isActive: true,
    surgeMultiplier: 1.5,
    maxSurgeCap: 3.0,
    dayOfWeek: "ALL",
    startTime: { hour: 7, minute: 0 },
    endTime: { hour: 9, minute: 0 },
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock surge pricing data
  const [surgePricingRules] = useState<SurgePricingData[]>([
    {
      surgeRuleId: 1,
      vehicleCategoryId: 1,
      vehicleCategoryName: "Economy",
      city: {
        cityId: 1,
        cityName: "Los Angeles",
        code: "LA",
        state: {
          stateId: 1,
          stateName: "California",
          country: { countryId: 1, countryName: "United States" },
        },
      },
      startTime: { hour: 7, minute: 0 },
      endTime: { hour: 9, minute: 0 },
      surgeMultiplier: 1.5,
      dayOfWeek: "MONDAY",
      maxSurgeCap: 3.0,
      isActive: true,
      createdBy: "admin",
      createdDate: "2024-01-15T10:00:00",
      isDeletedValue: false,
    },
    {
      surgeRuleId: 2,
      vehicleCategoryId: 2,
      vehicleCategoryName: "Comfort",
      city: {
        cityId: 2,
        cityName: "San Francisco",
        code: "SF",
        state: {
          stateId: 1,
          stateName: "California",
          country: { countryId: 1, countryName: "United States" },
        },
      },
      startTime: { hour: 17, minute: 0 },
      endTime: { hour: 19, minute: 30 },
      surgeMultiplier: 2.0,
      dayOfWeek: "FRIDAY",
      maxSurgeCap: 4.0,
      isActive: true,
      createdBy: "admin",
      createdDate: "2024-01-16T11:30:00",
      isDeletedValue: false,
    },
  ]);

  // Filtered data based on search
  const filteredSurgePricing = surgePricingRules.filter(
    (rule) =>
      rule.city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.vehicleCategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.dayOfWeek.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get filtered states and cities based on selection
  const filteredStates = selectedCountry
    ? mockStates.filter((state) => state.countryId === selectedCountry)
    : [];

  const filteredCities = selectedState
    ? mockCities.filter((city) => city.stateId === selectedState)
    : [];

  // Helper to format time
  const formatTime = (time: LocalTime) => {
    const hour = time.hour.toString().padStart(2, "0");
    const minute = time.minute.toString().padStart(2, "0");
    return `${hour}:${minute}`;
  };

  // Table columns
  const columns: ColumnDef<SurgePricingData>[] = [
    {
      header: "Vehicle Category",
      accessorKey: "vehicleCategoryName",
    },
    {
      header: "City",
      cell: (row: SurgePricingData) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.city.cityName}</span>
          <span className="text-xs text-muted-foreground">
            {row.city.state.stateName}, {row.city.state.country.countryName}
          </span>
        </div>
      ),
    },
    {
      header: "Time Range",
      cell: (row: SurgePricingData) => (
        <span className="font-mono text-sm">
          {formatTime(row.startTime)} - {formatTime(row.endTime)}
        </span>
      ),
    },
    {
      header: "Day",
      accessorKey: "dayOfWeek",
      cell: (row: SurgePricingData) => (
        <Badge variant="outline" className="font-medium">
          {row.dayOfWeek}
        </Badge>
      ),
    },
    {
      header: "Surge Multiplier",
      cell: (row: SurgePricingData) => (
        <span className="font-semibold text-primary">{row.surgeMultiplier}x</span>
      ),
    },
    {
      header: "Max Cap",
      cell: (row: SurgePricingData) => <span>{row.maxSurgeCap}x</span>,
    },
    {
      header: "Status",
      cell: (row: SurgePricingData) => (
        <Badge variant={row.isActive ? "default" : "secondary"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (row: SurgePricingData) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const validateForm = (data: Partial<SurgePricingFormData>): boolean => {
    try {
      surgePricingSchema.parse(data);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path.join(".")] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      isActive: true,
      surgeMultiplier: 1.5,
      maxSurgeCap: 3.0,
      dayOfWeek: "ALL",
      startTime: { hour: 7, minute: 0 },
      endTime: { hour: 9, minute: 0 },
    });
    setSelectedCountry(null);
    setSelectedState(null);
    setFormErrors({});
  };

  const handleAdd = () => {
    setIsAddDialogOpen(true);
    resetForm();
  };

  const handleEdit = (surge: SurgePricingData) => {
    setSelectedSurge(surge);
    setSelectedCountry(surge.city.state.country.countryId);
    setSelectedState(surge.city.state.stateId);
    setFormData({
      vehicleCategoryId: surge.vehicleCategoryId,
      cityId: surge.city.cityId,
      startTime: surge.startTime,
      endTime: surge.endTime,
      surgeMultiplier: surge.surgeMultiplier,
      dayOfWeek: surge.dayOfWeek,
      maxSurgeCap: surge.maxSurgeCap,
      isActive: surge.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (surge: SurgePricingData) => {
    setSelectedSurge(surge);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (validateForm(formData as SurgePricingFormData)) {
      toast({
        title: "Success",
        description: "Surge pricing rule created successfully",
      });
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleSaveEdit = () => {
    if (validateForm(formData as SurgePricingFormData)) {
      toast({
        title: "Success",
        description: "Surge pricing rule updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedSurge(null);
      resetForm();
    }
  };

  const handleConfirmDelete = () => {
    toast({
      title: "Success",
      description: "Surge pricing rule deleted successfully",
    });
    setIsDeleteDialogOpen(false);
    setSelectedSurge(null);
  };

  const renderFormFields = () => (
    <div className="grid gap-4 py-4">
      {/* Vehicle Category */}
      <div className="grid gap-2">
        <Label htmlFor="vehicleCategory">Vehicle Category *</Label>
        <Select
          value={formData.vehicleCategoryId?.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, vehicleCategoryId: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select vehicle category" />
          </SelectTrigger>
          <SelectContent>
            {mockVehicleCategories.map((category) => (
              <SelectItem key={category.vehicleCategoryId} value={category.vehicleCategoryId.toString()}>
                {category.vehicleCategoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.vehicleCategoryId && (
          <p className="text-sm text-destructive">{formErrors.vehicleCategoryId}</p>
        )}
      </div>

      {/* Country Selection */}
      <div className="grid gap-2">
        <Label htmlFor="country">Country *</Label>
        <Select
          value={selectedCountry?.toString()}
          onValueChange={(value) => {
            setSelectedCountry(parseInt(value));
            setSelectedState(null);
            setFormData({ ...formData, cityId: undefined });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {mockCountries.map((country) => (
              <SelectItem key={country.countryId} value={country.countryId.toString()}>
                {country.countryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State Selection */}
      <div className="grid gap-2">
        <Label htmlFor="state">State *</Label>
        <Select
          value={selectedState?.toString()}
          onValueChange={(value) => {
            setSelectedState(parseInt(value));
            setFormData({ ...formData, cityId: undefined });
          }}
          disabled={!selectedCountry}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {filteredStates.map((state) => (
              <SelectItem key={state.stateId} value={state.stateId.toString()}>
                {state.stateName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Selection */}
      <div className="grid gap-2">
        <Label htmlFor="city">City *</Label>
        <Select
          value={formData.cityId?.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, cityId: parseInt(value) })
          }
          disabled={!selectedState}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {filteredCities.map((city) => (
              <SelectItem key={city.cityId} value={city.cityId.toString()}>
                {city.cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.cityId && (
          <p className="text-sm text-destructive">{formErrors.cityId}</p>
        )}
      </div>

      {/* Day of Week */}
      <div className="grid gap-2">
        <Label htmlFor="dayOfWeek">Day of Week *</Label>
        <Select
          value={formData.dayOfWeek}
          onValueChange={(value) =>
            setFormData({ ...formData, dayOfWeek: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.dayOfWeek && (
          <p className="text-sm text-destructive">{formErrors.dayOfWeek}</p>
        )}
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              max="23"
              placeholder="HH"
              value={formData.startTime?.hour ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startTime: { ...formData.startTime!, hour: parseInt(e.target.value) || 0 },
                })
              }
              className="w-20"
            />
            <span className="self-center">:</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              value={formData.startTime?.minute ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startTime: { ...formData.startTime!, minute: parseInt(e.target.value) || 0 },
                })
              }
              className="w-20"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="endTime">End Time *</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              max="23"
              placeholder="HH"
              value={formData.endTime?.hour ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endTime: { ...formData.endTime!, hour: parseInt(e.target.value) || 0 },
                })
              }
              className="w-20"
            />
            <span className="self-center">:</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              value={formData.endTime?.minute ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endTime: { ...formData.endTime!, minute: parseInt(e.target.value) || 0 },
                })
              }
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Surge Multiplier */}
      <div className="grid gap-2">
        <Label htmlFor="surgeMultiplier">Surge Multiplier (1.0 - 10.0) *</Label>
        <Input
          id="surgeMultiplier"
          type="number"
          step="0.1"
          min="1"
          max="10"
          placeholder="1.5"
          value={formData.surgeMultiplier ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, surgeMultiplier: parseFloat(e.target.value) || 1.0 })
          }
        />
        {formErrors.surgeMultiplier && (
          <p className="text-sm text-destructive">{formErrors.surgeMultiplier}</p>
        )}
      </div>

      {/* Max Surge Cap */}
      <div className="grid gap-2">
        <Label htmlFor="maxSurgeCap">Max Surge Cap *</Label>
        <Input
          id="maxSurgeCap"
          type="number"
          step="0.1"
          min="0"
          placeholder="3.0"
          value={formData.maxSurgeCap ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, maxSurgeCap: parseFloat(e.target.value) || 0 })
          }
        />
        {formErrors.maxSurgeCap && (
          <p className="text-sm text-destructive">{formErrors.maxSurgeCap}</p>
        )}
      </div>

      {/* Active Status */}
      <div className="grid gap-2">
        <Label htmlFor="isActive">Status *</Label>
        <Select
          value={formData.isActive ? "true" : "false"}
          onValueChange={(value) =>
            setFormData({ ...formData, isActive: value === "true" })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Surge Pricing</h1>
          <p className="text-muted-foreground">Manage dynamic pricing based on demand</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Surge Pricing Rules</CardTitle>
                <CardDescription>Configure time-based surge multipliers and peak hour pricing</CardDescription>
              </div>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city, vehicle category, or day..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={filteredSurgePricing} />
          </CardContent>
        </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Surge Pricing Rule</DialogTitle>
            <DialogDescription>
              Create a new surge pricing rule with time-based multipliers
            </DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdd}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Surge Pricing Rule</DialogTitle>
            <DialogDescription>
              Update the surge pricing rule configuration
            </DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the surge pricing rule for{" "}
              <span className="font-semibold">{selectedSurge?.vehicleCategoryName}</span> in{" "}
              <span className="font-semibold">{selectedSurge?.city.cityName}</span> on{" "}
              <span className="font-semibold">{selectedSurge?.dayOfWeek}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
