import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Disputes = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for disputes
  const disputes = [
    {
      disputeId: "DSP-001",
      rideId: "RID-1234",
      rider: "John Doe",
      driver: "Ahmad Hassan",
      reason: "Incorrect fare charged",
      amount: "RM 45.00",
      status: "pending",
      createdDate: "2024-01-15",
    },
    {
      disputeId: "DSP-002",
      rideId: "RID-5678",
      rider: "Sarah Lee",
      driver: "Kumar Singh",
      reason: "Driver took wrong route",
      amount: "RM 32.50",
      status: "in_progress",
      createdDate: "2024-01-14",
    },
    {
      disputeId: "DSP-003",
      rideId: "RID-9012",
      rider: "Michael Chen",
      driver: "Fatima Ali",
      reason: "Payment processing error",
      amount: "RM 28.00",
      status: "resolved",
      createdDate: "2024-01-13",
    },
  ];

  const columns = [
    {
      header: "Dispute ID",
      accessorKey: "disputeId" as keyof typeof disputes[0],
    },
    {
      header: "Ride ID",
      accessorKey: "rideId" as keyof typeof disputes[0],
    },
    {
      header: "Rider",
      accessorKey: "rider" as keyof typeof disputes[0],
    },
    {
      header: "Driver",
      accessorKey: "driver" as keyof typeof disputes[0],
    },
    {
      header: "Reason",
      accessorKey: "reason" as keyof typeof disputes[0],
    },
    {
      header: "Amount",
      accessorKey: "amount" as keyof typeof disputes[0],
    },
    {
      header: "Status",
      accessorKey: "status" as keyof typeof disputes[0],
      cell: (row: typeof disputes[0]) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          pending: "outline",
          in_progress: "secondary",
          resolved: "default",
          rejected: "destructive",
        };
        return (
          <Badge variant={variants[row.status] || "default"}>
            {row.status.replace("_", " ").toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: "Created Date",
      accessorKey: "createdDate" as keyof typeof disputes[0],
    },
  ];

  const filteredDisputes = disputes.filter(
    (dispute) =>
      dispute.disputeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.rideId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.rider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Disputes</h1>
            <p className="text-muted-foreground mt-1">
              Manage and resolve ride disputes
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Dispute
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Disputes</CardTitle>
                <CardDescription>
                  View and manage all ride disputes
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search disputes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable data={filteredDisputes} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Disputes;
