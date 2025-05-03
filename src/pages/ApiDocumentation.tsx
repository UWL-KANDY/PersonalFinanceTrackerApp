
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const ApiDocumentation = () => {
  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold">API Documentation</h1>
      <p className="text-muted-foreground">
        This documentation provides details on all the API endpoints used in the FinanceFlow application.
      </p>

      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="savings">Savings Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="auth" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sign Up</CardTitle>
                <Badge>POST</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">supabase.auth.signUp()</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Creates a new user account with email and password.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Request Body</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  email: string;
  password: string;
  options: {
    data: {
      full_name: string;
    },
    emailRedirectTo: string;
  }
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  data: {
    user: User | null;
    session: Session | null;
  },
  error: AuthError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sign In</CardTitle>
                <Badge>POST</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">supabase.auth.signInWithPassword()</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Signs in an existing user with email and password.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Request Body</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  email: string;
  password: string;
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  data: {
    user: User | null;
    session: Session | null;
  },
  error: AuthError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sign Out</CardTitle>
                <Badge>POST</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">supabase.auth.signOut()</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Signs out the current user and removes session from browser.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  error: AuthError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Get Transactions</CardTitle>
                <Badge>GET</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">supabase.from('transactions').select('*')</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Retrieves all transactions for the current user.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Parameters</h3>
                <p>Optional query parameters for filtering, sorting, and pagination:</p>
                <ul className="list-disc pl-5">
                  <li><code>.eq('user_id', userId)</code> - Filter by user ID</li>
                  <li><code>.order('date', {'{ ascending: false }'})</code> - Sort by date</li>
                  <li><code>.limit(10)</code> - Limit results</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  data: [{
    id: string;
    user_id: string;
    name: string;
    type: string;
    category: string;
    amount: number;
    date: string;
    description: string | null;
    created_at: string;
  }],
  error: PostgrestError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Transaction</CardTitle>
                <Badge>POST</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">{'supabase.from(\'transactions\').insert([{...}])'}</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Creates a new transaction for the current user.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Request Body</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  user_id: string;
  name: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  data: [{
    id: string;
    user_id: string;
    name: string;
    type: string;
    category: string;
    amount: number;
    date: string;
    description: string | null;
    created_at: string;
  }],
  error: PostgrestError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budgets" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Get Budgets</CardTitle>
                <Badge>GET</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">supabase.from('budgets').select('*')</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Retrieves all budget entries for the current user.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Parameters</h3>
                <ul className="list-disc pl-5">
                  <li><code>.eq('user_id', userId)</code> - Filter by user ID</li>
                  <li><code>.order('created_at', {'{ ascending: false }'})</code> - Sort by creation date</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  data: [{
    id: string;
    user_id: string;
    category: string;
    amount: number;
    period: string;
    created_at: string;
    updated_at: string;
  }],
  error: PostgrestError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Budget</CardTitle>
                <Badge>POST</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">{'supabase.from(\'budgets\').insert([{...}])'}</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Creates a new budget entry for the current user.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Request Body</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  user_id: string;
  category: string;
  amount: number;
  period: string;
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  data: [{
    id: string;
    user_id: string;
    category: string;
    amount: number;
    period: string;
    created_at: string;
    updated_at: string;
  }],
  error: PostgrestError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="savings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Get Savings Goals</CardTitle>
                <Badge>GET</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">supabase.from('savings_goals').select('*')</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Retrieves all savings goals for the current user.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Parameters</h3>
                <ul className="list-disc pl-5">
                  <li><code>.eq('user_id', userId)</code> - Filter by user ID</li>
                  <li><code>.order('created_at', {'{ ascending: false }'})</code> - Sort by creation date</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  data: [{
    id: string;
    user_id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
  }],
  error: PostgrestError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Savings Goal</CardTitle>
                <Badge>POST</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">{'supabase.from(\'savings_goals\').insert([{...}])'}</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Creates a new savings goal for the current user.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Request Body</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  user_id: string;
  name: string;
  target_amount: number;
  deadline?: string;
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  data: [{
    id: string;
    user_id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
  }],
  error: PostgrestError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Update Savings Goal</CardTitle>
                <Badge>PATCH</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">{'supabase.from(\'savings_goals\').update({...}).eq(\'id\', goalId)'}</code>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>Updates an existing savings goal, typically to update the current amount or mark as completed.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Request Body</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  current_amount?: number;
  completed?: boolean;
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium">Response</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
{`{
  data: [{
    id: string;
    user_id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
  }],
  error: PostgrestError | null;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDocumentation;
