import { Mail, Phone, MapPin, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetContactInfo, useGetLocationInfo } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactPage() {
  const { data: contactInfo, isLoading: contactLoading } = useGetContactInfo();
  const { data: locationInfo, isLoading: locationLoading } = useGetLocationInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-bounce-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-accent animate-pulse" />
            <h1 className="text-5xl font-bold text-primary">Contact</h1>
            <Sparkles className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Suntem aici pentru tine! Contactează-ne pentru orice întrebare sau sugestie. 📞✨
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="rounded-3xl shadow-playful hover:shadow-playful-lg transition-all duration-300 hover:scale-105 border-4 border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-playful">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {contactLoading ? (
                <Skeleton className="h-6 w-full rounded-full" />
              ) : (
                <a
                  href={`mailto:${contactInfo?.email}`}
                  className="text-lg text-foreground hover:text-primary transition-colors font-medium underline decoration-2 decoration-accent hover:decoration-primary"
                >
                  {contactInfo?.email}
                </a>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-playful hover:shadow-playful-lg transition-all duration-300 hover:scale-105 border-4 border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mb-4 shadow-playful">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Telefon</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              {contactLoading ? (
                <>
                  <Skeleton className="h-6 w-full rounded-full" />
                  <Skeleton className="h-6 w-full rounded-full" />
                </>
              ) : (
                contactInfo?.phoneNumbers.map((phone, index) => (
                  <a
                    key={index}
                    href={`tel:${phone}`}
                    className="block text-lg text-foreground hover:text-primary transition-colors font-medium underline decoration-2 decoration-accent hover:decoration-primary"
                  >
                    {phone}
                  </a>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-playful hover:shadow-playful-lg transition-all duration-300 hover:scale-105 border-4 border-primary/20 md:col-span-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mb-4 shadow-playful">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Locație</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {locationLoading ? (
                <Skeleton className="h-6 w-full rounded-full mb-4" />
              ) : (
                <p className="text-lg text-foreground font-medium mb-4">
                  {locationInfo?.location}
                </p>
              )}
              <p className="text-muted-foreground">
                Te așteptăm cu drag la bistro-ul nostru pentru cele mai delicioase clătite și waffles! 🧇🥞
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-playful hover:shadow-playful-lg transition-all duration-300 hover:scale-105 border-4 border-primary/20 md:col-span-2 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mb-4 shadow-playful">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Program</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {locationLoading ? (
                <Skeleton className="h-6 w-full rounded-full mb-2" />
              ) : (
                <p className="text-lg text-foreground font-medium mb-2">
                  {locationInfo?.openingHours}
                </p>
              )}
              <p className="text-muted-foreground">
                Vino să ne vizitezi în programul nostru de lucru! ⏰
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-8 shadow-playful">
            <p className="text-lg text-foreground font-medium mb-2">
              🎉 Vino să ne vizitezi și să te bucuri de cele mai delicioase preparate! 🎉
            </p>
            <p className="text-muted-foreground">
              Echipa BOB Land te așteaptă cu drag!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
