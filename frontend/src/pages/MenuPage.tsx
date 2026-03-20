import { useState } from 'react';
import { useGetMenuItems } from '../hooks/useQueries';
import { MenuCategory } from '../backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import MenuItemCard from '../components/MenuItemCard';
import { Loader2, IceCream, Cake, Sandwich, Sparkles, Cookie, Pizza, Croissant, Coffee } from 'lucide-react';

const categoryLabels: Record<MenuCategory, string> = {
  [MenuCategory.inghetataArtizanalaItaliana]: 'Înghețată artizanală italiană',
  [MenuCategory.clatiteWaffles]: 'Clătite & Waffles',
  [MenuCategory.waffleStickBombs]: 'Waffle Stick & Waffle Bombs',
  [MenuCategory.bobsMagic]: "BOB's Magic",
  [MenuCategory.snacks]: 'Snacks',
  [MenuCategory.focacciaSpecialitati]: 'Focaccia & Specialități',
  [MenuCategory.patiserie]: 'Patiserie',
  [MenuCategory.coffeeMore]: 'Coffee & More',
};

const categoryIcons: Record<MenuCategory, React.ReactNode> = {
  [MenuCategory.inghetataArtizanalaItaliana]: <IceCream className="h-5 w-5" />,
  [MenuCategory.clatiteWaffles]: <Cake className="h-5 w-5" />,
  [MenuCategory.waffleStickBombs]: <Cookie className="h-5 w-5" />,
  [MenuCategory.bobsMagic]: <Sparkles className="h-5 w-5" />,
  [MenuCategory.snacks]: <Sandwich className="h-5 w-5" />,
  [MenuCategory.focacciaSpecialitati]: <Pizza className="h-5 w-5" />,
  [MenuCategory.patiserie]: <Croissant className="h-5 w-5" />,
  [MenuCategory.coffeeMore]: <Coffee className="h-5 w-5" />,
};

const categoryOrder: MenuCategory[] = [
  MenuCategory.inghetataArtizanalaItaliana,
  MenuCategory.clatiteWaffles,
  MenuCategory.waffleStickBombs,
  MenuCategory.bobsMagic,
  MenuCategory.snacks,
  MenuCategory.focacciaSpecialitati,
  MenuCategory.patiserie,
  MenuCategory.coffeeMore,
];

export default function MenuPage() {
  const { data: menuItems, isLoading } = useGetMenuItems();
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');

  const filteredItems = activeCategory === 'all' 
    ? menuItems || []
    : menuItems?.filter((item) => item.category === activeCategory) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Se încarcă meniul...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Meniul Nostru
        </h1>
        <p className="text-lg text-muted-foreground">
          Descoperă deliciile noastre și comandă acum!
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as MenuCategory | 'all')}>
        <ScrollArea className="w-full whitespace-nowrap mb-8">
          <TabsList className="inline-flex h-auto gap-2 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted flex items-center gap-2 whitespace-nowrap"
            >
              Toate
            </TabsTrigger>
            {categoryOrder.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted flex items-center gap-2 whitespace-nowrap"
              >
                {categoryIcons[category]}
                <span className="hidden sm:inline">{categoryLabels[category]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="all">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                Nu există produse disponibile momentan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={Number(item.id)} menuItem={item} />
              ))}
            </div>
          )}
        </TabsContent>

        {categoryOrder.map((category) => (
          <TabsContent key={category} value={category}>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  Nu există produse în această categorie momentan.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard key={Number(item.id)} menuItem={item} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
