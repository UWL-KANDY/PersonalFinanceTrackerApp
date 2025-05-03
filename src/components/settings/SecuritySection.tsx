
import React, { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SecuritySection() {
  const { user } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const isEmailVerified = user?.email_confirmed_at !== null && typeof user?.email_confirmed_at !== 'undefined';

  const resendVerification = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email!,
      });
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Verification email sent",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmail = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Verification email sent to new address",
      });
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Email Verification</h3>
          {isEmailVerified ? (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              <Check className="h-3 w-3 mr-1" /> Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
              <AlertTriangle className="h-3 w-3 mr-1" /> Pending verification
            </Badge>
          )}
        </div>
        
        {!isEmailVerified && (
          <Button
            variant="outline"
            onClick={resendVerification}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            Resend Verification Email
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Change Email</Label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New email address"
          />
          <Button onClick={updateEmail} disabled={isLoading || !newEmail}>
            Update
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Change Password</Label>
        <div className="flex gap-2">
          <Input
            id="password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />
          <Button onClick={updatePassword} disabled={isLoading || !newPassword}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
