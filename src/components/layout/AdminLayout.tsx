import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Exact sidebar width + minimal padding */}
      <main className="lg:ml-64 min-h-screen lg:pl-0">
        {children}
      </main>
    </div>
  );
};
