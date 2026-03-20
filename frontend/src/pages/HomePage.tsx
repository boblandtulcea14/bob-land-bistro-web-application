import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ShoppingBag, Clock, Award, Truck } from 'lucide-react';
import RestaurantInfoBanner from '../components/RestaurantInfoBanner';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-food.dim_1200x400.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg">
            BOB Land
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-medium drop-shadow-md">
            Cele mai delicioase clătite, waffles și înghețată artizanală din Tulcea
          </p>
          <Link to="/menu">
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold bg-primary hover:bg-primary/90"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Comandă Acum
            </Button>
          </Link>
        </div>
      </section>

      {/* Restaurant Info Banner */}
      <RestaurantInfoBanner />

      {/* Value Propositions */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ingrediente Proaspete</h3>
              <p className="text-muted-foreground">
                Folosim doar ingrediente de cea mai bună calitate pentru preparatele noastre
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Livrare Rapidă</h3>
              <p className="text-muted-foreground">
                Livrăm comenzile tale rapid și în condiții optime
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Program Flexibil</h3>
              <p className="text-muted-foreground">
                Alege intervalul orar care ți se potrivește pentru livrare
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Specialitățile Noastre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-card">
              <div className="relative overflow-hidden">
                <img 
                  src="/assets/generated/gelato-artizanal-italian.dim_400x300.jpg" 
                  alt="Înghețată artizanală italiană" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Înghețată artizanală</h3>
                <p className="text-sm text-muted-foreground">Autentică și cremoasă</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-card">
              <div className="relative overflow-hidden">
                <img 
                  src="/assets/generated/clatite-traditional.dim_400x300.jpg" 
                  alt="Clătite" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Clătite</h3>
                <p className="text-sm text-muted-foreground">Tradiționale și delicioase</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-card">
              <div className="relative overflow-hidden">
                <img 
                  src="/assets/generated/waffle-berries.dim_400x300.jpg" 
                  alt="Waffles" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Waffles</h3>
                <p className="text-sm text-muted-foreground">Crocante și aromate</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-card">
              <div className="relative overflow-hidden">
                <img 
                  src="/assets/generated/coffee-latte-art.dim_400x300.jpg" 
                  alt="Cafea" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Cafea</h3>
                <p className="text-sm text-muted-foreground">De specialitate</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
