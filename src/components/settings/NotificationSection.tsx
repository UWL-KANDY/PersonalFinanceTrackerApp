
import React, { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function NotificationSection() {
  const { user } = useSession();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const updateNotificationSettings = async (type: 'email' | 'push', value: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          [type === 'email' ? 'email_notifications' : 'push_notifications']: value
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification settings updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="emailNotifications">Email Notifications</Label>
        <Switch
          id="emailNotifications"
          checked={emailNotifications}
          onCheckedChange={(checked) => {
            setEmailNotifications(checked);
            updateNotificationSettings('email', checked);
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="pushNotifications">Push Notifications</Label>
        <Switch
          id="pushNotifications"
          checked={pushNotifications}
          onCheckedChange={(checked) => {
            setPushNotifications(checked);
            updateNotificationSettings('push', checked);
          }}
        />
      </div>
    </div>
  );
}
