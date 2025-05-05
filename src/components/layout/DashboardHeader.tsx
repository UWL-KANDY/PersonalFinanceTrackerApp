
import { Link } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface DashboardHeaderProps {
  onSidebarToggle: () => void;
}

export function DashboardHeader({ onSidebarToggle }: DashboardHeaderProps) {
  const { session, signOut } = useSession();
  const user = session?.user;
  
  // Get first letter of email for avatar fallback
  const fallbackText = user?.email ? user.email[0].toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <Button variant="outline" size="icon" onClick={onSidebarToggle}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-semibold">FinanceTrack</span>
        </Link>
      </div>
      
      <div className="hidden lg:block" />
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="border-l pl-4">
          <Link to="/settings">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{fallbackText}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
