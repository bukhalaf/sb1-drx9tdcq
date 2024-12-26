import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AppRoutes } from '@/routes';
import { Navigation } from '@/components/layout/Navigation';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="events-pro-theme">
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <AppRoutes />
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;