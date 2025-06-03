import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../components/theme-provider";
import { SidebarProvider } from "../components/ui/sidebar";
import { DashboardSidebar } from "../components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "../components/dashboard/dashboard-header";
import { useAuth } from "../lib/contexts/AuthContext";

// This component handles auth + layout
export default function DashboardLayout() {
  const { user, loading } = useAuth();

  // While loading auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is not authenticated, redirect logic should be handled by route guards
  if (!user) return null;

  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900/50">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
