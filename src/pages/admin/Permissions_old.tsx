import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

const permissionsData = [
  { category: "Fleet Management", permissions: ["View Vehicles", "Add Vehicle", "Edit Vehicle", "Delete Vehicle"] },
  { category: "Driver Management", permissions: ["View Drivers", "Add Driver", "Edit Driver", "Assign Vehicle"] },
  { category: "User Management", permissions: ["View Users", "Create User", "Edit User", "Delete User"] },
  { category: "Reports", permissions: ["View Reports", "Export Reports", "Create Reports"] },
];

const Permissions = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container px-4 py-8">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Lock className="h-8 w-8 text-primary" />
              Permission Management
            </h2>
            <p className="text-muted-foreground mt-1">
              Configure system permissions and access control
            </p>
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {permissionsData.map((category, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                  <CardDescription>
                    {category.permissions.length} permissions available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.permissions.map((permission, pIdx) => (
                      <Badge key={pIdx} variant="outline" className="text-sm">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Permissions;
