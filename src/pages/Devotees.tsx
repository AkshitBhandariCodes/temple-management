import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search, Filter } from "lucide-react";

const Devotees = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Devotees Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage temple members and devotees
            </p>
          </div>
          <Button className="bg-gradient-to-r from-temple-saffron to-temple-accent hover:from-temple-accent hover:to-temple-saffron text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Devotee
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-temple-saffron" />
              <span>Devotees Directory</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Search and filter functionality coming soon...</span>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 text-temple-saffron/50" />
              <p className="text-lg mb-2">Devotees management section</p>
              <p>This section will contain devotee registration, profiles, and contact management.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Devotees;