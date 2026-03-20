import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { usePlaceDeliveryOrder } from '../hooks/useQueries';
import { PreOrder, PreOrderStatus, PaymentMethod } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DeliveryTimeSlotPicker from '../components/DeliveryTimeSlotPicker';

export default function OrderPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { mutate: placeOrder, isPending } = usePlaceDeliveryOrder();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Tulcea');
  const [zipCode, setZipCode] = useState('');
  const [addressInstructions, setAddressInstructions] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cashOnDelivery' | 'cardOnDelivery'>('cashOnDelivery');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null);

  const totalPrice = getTotalPrice();
  const minimumOrder = 30;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    if (!selectedTimeSlot) {
      return;
    }

    const order: PreOrder = {
      id: 0n,
      customerName,
      contactInfo,
      items: cartItems.map((item) => item.menuItem.id),
      status: PreOrderStatus.pending,
      createdAt: BigInt(Date.now()) * 1000000n,
      orderType: {
        __kind__: 'delivery',
        delivery: {
          address: {
            street,
            city,
            zipCode,
            instructions: addressInstructions || undefined,
          },
          timeSlot: selectedTimeSlot,
          paymentMethod: paymentMethod === 'cashOnDelivery' ? PaymentMethod.cashOnDelivery : PaymentMethod.cardOnDelivery,
          specialInstructions: specialInstructions || undefined,
        },
      },
    };

    placeOrder(order, {
      onSuccess: () => {
        clearCart();
        setCustomerName('');
        setContactInfo('');
        setStreet('');
        setCity('Tulcea');
        setZipCode('');
        setAddressInstructions('');
        setSpecialInstructions('');
        setSelectedTimeSlot(null);
        navigate({ to: '/' });
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Coșul tău este gol</CardTitle>
            <CardDescription>Adaugă produse din meniu pentru a plasa o comandă</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => navigate({ to: '/menu' })}>
              Mergi la Meniu
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Finalizare Comandă</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Produsele tale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={Number(item.menuItem.id)} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                  {item.menuItem.imagePath && (
                    <img
                      src={`/assets/${item.menuItem.imagePath}`}
                      alt={item.menuItem.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{item.menuItem.name}</h3>
                    <p className="text-sm text-muted-foreground">{Number(item.menuItem.price)} RON</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.menuItem.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Form */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Detalii Livrare</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Nume complet *</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="h-12"
                      placeholder="Ion Popescu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Telefon *</Label>
                    <Input
                      id="contactInfo"
                      type="tel"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      required
                      className="h-12"
                      placeholder="0740123456"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Adresă (Stradă, Număr, Bloc, Scară, Apartament) *</Label>
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="h-12"
                    placeholder="Str. Exemplu, Nr. 10, Bl. A, Sc. 1, Ap. 5"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Oraș *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Cod poștal *</Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                      className="h-12"
                      placeholder="820001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressInstructions">Instrucțiuni adresă (opțional)</Label>
                  <Textarea
                    id="addressInstructions"
                    value={addressInstructions}
                    onChange={(e) => setAddressInstructions(e.target.value)}
                    placeholder="Ex: Interfon 5, Ușa din stânga"
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Interval orar livrare *</Label>
                  <DeliveryTimeSlotPicker
                    selectedSlot={selectedTimeSlot}
                    onSelectSlot={setSelectedTimeSlot}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Instrucțiuni speciale (opțional)</Label>
                  <Textarea
                    id="specialInstructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Ex: Fără alergeni, preferințe speciale"
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Metodă de plată *</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'cashOnDelivery' | 'cardOnDelivery')}>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="cashOnDelivery" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer font-normal">
                        Numerar la livrare
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="cardOnDelivery" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer font-normal">
                        Card la livrare
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Sumar Comandă</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{totalPrice} RON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livrare</span>
                  <span className="font-medium">Gratuit</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{totalPrice} RON</span>
              </div>

              {totalPrice < minimumOrder && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Comandă minimă: {minimumOrder} RON. Mai adaugă {minimumOrder - totalPrice} RON.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmitOrder}
                disabled={isPending || totalPrice < minimumOrder || !selectedTimeSlot}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {isPending ? 'Se procesează...' : 'Plasează Comanda'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
