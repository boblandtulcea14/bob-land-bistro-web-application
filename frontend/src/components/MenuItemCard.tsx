import { MenuItem } from '../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

interface MenuItemCardProps {
  menuItem: MenuItem;
}

export default function MenuItemCard({ menuItem }: MenuItemCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(menuItem);
    toast.success(`${menuItem.name} adăugat în coș!`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border">
      {menuItem.imagePath && (
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={`/assets/${menuItem.imagePath}`}
            alt={menuItem.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight">{menuItem.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">{menuItem.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-2xl font-bold text-primary">{Number(menuItem.price)} RON</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full rounded-lg font-semibold h-11 bg-primary hover:bg-primary/90 transition-all"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Adaugă în coș
        </Button>
      </CardFooter>
    </Card>
  );
}
