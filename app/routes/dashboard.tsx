import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../components/theme-provider";
import { SidebarProvider, useSidebar } from "../components/ui/sidebar";
import { DashboardSidebar } from "../components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "../components/dashboard/dashboard-header";
import { useAuth } from "../lib/contexts/AuthContext";
import { useEffect, useState } from "react";

// Overlay component for mobile sidebar
const MobileSidebarOverlay = () => {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if we're in a mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobileView || !isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-30"
      onClick={() => setIsMobileOpen(false)}
      aria-hidden="true"
    />
  );
};

// This component handles auth + layout
function DashboardLayoutContent() {
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
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      <MobileSidebarOverlay />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Wrap with providers
export default function DashboardLayout() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <SidebarProvider>
        <DashboardLayoutContent />
      </SidebarProvider>
    </ThemeProvider>
  );
}
