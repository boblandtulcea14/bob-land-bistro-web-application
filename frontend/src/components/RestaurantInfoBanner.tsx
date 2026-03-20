import { useGetLocationInfo, useGetContactInfo } from '../hooks/useQueries';
import { Phone, Clock, MapPin, ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RestaurantInfoBanner() {
  const { data: locationInfo, isLoading: locationLoading } = useGetLocationInfo();
  const { data: contactInfo, isLoading: contactLoading } = useGetContactInfo();

  if (locationLoading || contactLoading) {
    return (
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefon</p>
              {contactInfo?.phoneNumbers && contactInfo.phoneNumbers.length > 0 && (
                <a 
                  href={`tel:${contactInfo.phoneNumbers[0]}`}
                  className="text-base font-bold text-foreground hover:text-primary transition-colors"
                >
                  {contactInfo.phoneNumbers[0]}
                </a>
              )}
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Program</p>
              <p className="text-base font-bold text-foreground">
                {locationInfo?.openingHours || 'Luni-Duminică 07:30-21:00'}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Locație</p>
              <p className="text-base font-bold text-foreground">
                {locationInfo?.location || 'Tulcea'}
              </p>
            </div>
          </div>

          {/* Minimum Order */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Comandă minimă</p>
              <p className="text-base font-bold text-foreground">30 RON</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
