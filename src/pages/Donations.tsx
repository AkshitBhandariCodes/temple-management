import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Donations = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donations Management</h1>
          <p className="text-gray-600 mt-1">Track and manage temple donations</p>
        </div>
        <Button className="bg-gradient-to-r from-temple-saffron to-temple-accent hover:from-temple-accent hover:to-temple-saffron text-white">
          <Plus className="w-4 h-4 mr-2" />
          Record Donation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-temple-saffron" />
            <span>Donations Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-4 text-temple-saffron/50" />
            <p className="text-lg mb-2">Donations Tracking System</p>
            <p>This section will contain donation records, receipts, and financial reports.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Donations;