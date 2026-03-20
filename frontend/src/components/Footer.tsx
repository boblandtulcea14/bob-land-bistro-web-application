import { Heart } from 'lucide-react';
import { useGetContactInfo, useGetLocationInfo } from '../hooks/useQueries';

export default function Footer() {
  const { data: contactInfo } = useGetContactInfo();
  const { data: locationInfo } = useGetLocationInfo();

  return (
    <footer className="border-t-4 border-primary/20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/assets/generated/new-bob-land-logo-transparent.dim_200x200.png" 
                alt="BOB Land" 
                className="h-12 w-12" 
              />
              <h3 className="font-bold text-xl text-primary">BOB Land</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bistro specializat în clătite, waffles, patiserie, snacks și cafea de calitate.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-lg mb-4 text-primary">Contact</h3>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
              {contactInfo?.email && (
                <p>
                  <span className="font-semibold">Email:</span> {contactInfo.email}
                </p>
              )}
              {contactInfo?.phoneNumbers && contactInfo.phoneNumbers.length > 0 && (
                <p>
                  <span className="font-semibold">Telefon:</span> {contactInfo.phoneNumbers.join(' / ')}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-lg mb-4 text-primary">Program</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {locationInfo?.openingHours || 'Luni-Duminică 07.30 - 21.00'}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t-2 border-primary/10 text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            © 2025. Built with <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-accent font-semibold transition-colors hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
