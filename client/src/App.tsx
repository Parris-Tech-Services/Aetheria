import { Switch, Route, Router as Location } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { isStaticHost } from "./lib/static-mode";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "./pages/Home";
import CreateCharacter from "./pages/CreateCharacter";
import Play from "./pages/Play";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={CreateCharacter} />
      <Route path="/play/:id" component={Play} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* Static hosts have no server rewrites, so routes live in the URL hash. */}
        <Location hook={isStaticHost ? useHashLocation : undefined}>
          <Router />
        </Location>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
