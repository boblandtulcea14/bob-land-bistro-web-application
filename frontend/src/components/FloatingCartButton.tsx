import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from '@tanstack/react-router';

export default function FloatingCartButton() {
  const { getTotalItems, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const itemCount = getTotalItems();
  const totalPrice = getTotalPrice();

  // Don't show on order page
  if (location.pathname === '/order' || itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
      <Button
        onClick={() => navigate({ to: '/order' })}
        size="lg"
        className="h-14 px-6 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold text-base gap-3"
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <span className="hidden sm:inline">{totalPrice} RON</span>
      </Button>
    </div>
  );
}
