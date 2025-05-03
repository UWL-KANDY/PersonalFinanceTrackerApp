
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { NotificationSection } from "@/components/settings/NotificationSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { FileCode } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import ApiDocumentation from "./ApiDocumentation";

const SettingsPage = () => {
  const isMobile = useIsMobile();
  const [developerEnabled, setDeveloperEnabled] = useState(false);
  
  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First row */}
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileSection />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeToggle variant="settings" />
          </CardContent>
        </Card>
        
        {/* Second row */}
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <SecuritySection />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationSection />
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom section - full width */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Developer Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="developer-mode"
              checked={developerEnabled}
              onCheckedChange={setDeveloperEnabled}
            />
            <Label htmlFor="developer-mode">Enable Developer Mode</Label>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-1">
                  <span className="sr-only">Info</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-muted-foreground">?</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Developer Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Enables advanced features and API documentation for developers working with the FinanceFlow application.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          {developerEnabled && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">API Documentation</h3>
              <p className="text-muted-foreground mb-4">
                Access comprehensive documentation about all available API endpoints in the FinanceFlow application.
              </p>
              
              <div className="border border-border rounded-lg p-6 bg-card">
                <ApiDocumentation />
              </div>
            </div>
          )}
          
          {!developerEnabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild className="flex items-center gap-2">
                    <Link to="/api-docs">
                      <FileCode size={18} />
                      <span>View API Documentation</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Browse the complete API reference</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
