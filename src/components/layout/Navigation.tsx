import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function Navigation() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <CalendarDays className="h-6 w-6" />
          <span className="font-bold">Events Pro</span>
        </Link>

        <div className="flex items-center space-x-6 ml-6">
          <Link
            to="/events"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Events
          </Link>
          <Link
            to="/ushers"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Ushers
          </Link>
        </div>

        <div className="flex items-center ml-auto space-x-4">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}