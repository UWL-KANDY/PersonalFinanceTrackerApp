
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useSession } from '@/contexts/SessionContext';
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { user, signOut } = useSession();
  const location = useLocation();

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <TrendingUp size={20} />, label: "Transactions", path: "/transactions" },
    { icon: <Wallet size={20} />, label: "Budgets", path: "/budgets" },
    { icon: <Lightbulb size={20} />, label: "Recommendations", path: "/reports" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Get user email and extract the first letter for the avatar
  const userEmail = user.email || '';
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        {/* Mobile sidebar toggle */}
        <Button
          variant="outline"
          size="icon"
          className={`fixed top-4 left-4 z-50 md:hidden ${isSidebarOpen ? 'hidden' : 'flex'}`}
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu />
        </Button>

        {/* Sidebar overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-50
            w-64 bg-background border-r border-border
            transform transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/dashboard" className="flex items-center space-x-2">
              <img
          src="/public/logo.png"
          alt="FinanceFlow Logo"
          className="h-10 w-10"
        />
                <span className="font-bold text-lg">Finance Flow</span>
              </Link>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden"
                >
                  <X size={20} />
                </Button>
              )}
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className={cn(isActive ? "text-primary" : "text-muted-foreground")}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-medium text-primary">
                    {userInitial}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userEmail}</p>
                  <p className="text-xs text-muted-foreground truncate">User Account</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
