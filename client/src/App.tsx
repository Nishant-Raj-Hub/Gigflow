import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from 'react-redux';
import { store } from './store';
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import GigList from "@/pages/Gigs/GigList";
import GigDetail from "@/pages/Gigs/GigDetail";
import CreateGig from "@/pages/Gigs/CreateGig";
import Dashboard from "@/pages/Dashboard";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Initialize auth state on app load
  useAuth();
  return <>{children}</>;
}

function Router() {
  return (
    <AuthInitializer>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        <Route path="/gigs" component={GigList} />
        <Route path="/gigs/new" component={CreateGig} />
        <Route path="/gigs/:id" component={GigDetail} />
        
        <Route path="/dashboard" component={Dashboard} />
        
        <Route component={NotFound} />
      </Switch>
    </AuthInitializer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
