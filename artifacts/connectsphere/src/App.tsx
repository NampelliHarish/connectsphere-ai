import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import DirectoryPage from "@/pages/DirectoryPage";
import RecognitionPage from "@/pages/RecognitionPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import EventsPage from "@/pages/EventsPage";
import KnowledgePage from "@/pages/KnowledgePage";
import ForumPage from "@/pages/ForumPage";
import LeadershipPage from "@/pages/LeadershipPage";
import AdminPage from "@/pages/AdminPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Redirect logged-in users away from login
  if (user && location === "/login") return <Redirect to="/" />;
  // Redirect logged-out users to login (except login page)
  if (!user && location !== "/login") return <Redirect to="/login" />;

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/announcements" component={() => <ProtectedRoute component={AnnouncementsPage} />} />
      <Route path="/directory" component={() => <ProtectedRoute component={DirectoryPage} />} />
      <Route path="/recognition" component={() => <ProtectedRoute component={RecognitionPage} />} />
      <Route path="/leaderboard" component={() => <ProtectedRoute component={LeaderboardPage} />} />
      <Route path="/events" component={() => <ProtectedRoute component={EventsPage} />} />
      <Route path="/knowledge" component={() => <ProtectedRoute component={KnowledgePage} />} />
      <Route path="/forum" component={() => <ProtectedRoute component={ForumPage} />} />
      <Route path="/leadership" component={() => <ProtectedRoute component={LeadershipPage} />} />
      <Route path="/admin" component={() => <ProtectedRoute component={AdminPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
