import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import GoLiveButton from './GoLiveButton';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: '/', label: 'Acasă' },
    { to: '/menu', label: 'Meniu' },
    { to: '/order', label: 'Comandă' },
    { to: '/gallery', label: 'Galerie' },
    { to: '/reviews', label: 'Recenzii' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-playful">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/assets/generated/new-bob-land-logo-transparent.dim_200x200.png" 
                alt="BOB Land" 
                className="h-14 w-14 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300" 
              />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent animate-pulse" />
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight">BOB Land</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-base font-semibold text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative group"
                activeProps={{ className: 'text-primary font-bold scale-105' }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-primary rounded-full transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-base font-semibold text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative group"
                activeProps={{ className: 'text-primary font-bold scale-105' }}
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-primary rounded-full transition-all duration-200 group-hover:w-full" />
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <div className="hidden lg:block">
                <GoLiveButton />
              </div>
            )}
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              className="hidden md:inline-flex rounded-full font-semibold shadow-playful hover:shadow-playful-lg transition-all duration-200 hover:scale-105"
              size="lg"
            >
              {loginStatus === 'logging-in' ? 'Se conectează...' : isAuthenticated ? 'Deconectare' : 'Conectare'}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-primary/10 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t-2 border-primary/20 animate-slide-in">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-base font-semibold text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-2xl hover:bg-primary/5"
                  activeProps={{ className: 'text-primary font-bold bg-primary/10' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-base font-semibold text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-2xl hover:bg-primary/5"
                  activeProps={{ className: 'text-primary font-bold bg-primary/10' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {isAdmin && (
                <div className="pt-2">
                  <GoLiveButton />
                </div>
              )}
              <Button 
                onClick={handleAuth} 
                disabled={disabled} 
                variant={isAuthenticated ? 'outline' : 'default'} 
                className="w-full rounded-full font-semibold shadow-playful"
                size="lg"
              >
                {loginStatus === 'logging-in' ? 'Se conectează...' : isAuthenticated ? 'Deconectare' : 'Conectare'}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
