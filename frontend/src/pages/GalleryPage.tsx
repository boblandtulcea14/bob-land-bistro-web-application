import { useGetGalleryImages } from '../hooks/useQueries';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuCategory } from '../backend';

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

export default function GalleryPage() {
  const { data: galleryImages, isLoading } = useGetGalleryImages();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Se încarcă galeria...</p>
        </div>
      </div>
    );
  }

  const categoryImages = galleryImages?.filter((img) => img.isCategoryImage) || [];
  const regularImages = galleryImages?.filter((img) => !img.isCategoryImage) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Galeria BOB Land 📸
        </h1>
        <p className="text-xl text-muted-foreground">
          Descoperă atmosfera și deliciile noastre în imagini!
        </p>
      </div>

      {categoryImages.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <span className="text-4xl">🎨</span>
            Categorii Vintage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryImages.map((image) => (
              <Card
                key={Number(image.id)}
                className="group overflow-hidden border-4 border-border hover:border-primary transition-all duration-300 hover:shadow-playful-lg hover:scale-105 rounded-3xl bg-black"
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden bg-black">
                    <img
                      src={`/assets/${image.imagePath}`}
                      alt={image.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="font-bold text-lg mb-2 text-center">{image.title}</h3>
                    {image.category && (
                      <Badge variant="secondary" className="w-full justify-center rounded-full">
                        {categoryLabels[image.category]}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {regularImages.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <span className="text-4xl">🍰</span>
            Galeria Noastră
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularImages.map((image) => (
              <Card
                key={Number(image.id)}
                className="group overflow-hidden border-4 border-border hover:border-primary transition-all duration-300 hover:shadow-playful-lg hover:scale-105 rounded-3xl"
              >
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={`/assets/${image.imagePath}`}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{image.title}</h3>
                    {image.description && (
                      <p className="text-muted-foreground text-sm">{image.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {!galleryImages || galleryImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-24 w-24 mx-auto mb-6 text-muted-foreground/50" />
          <p className="text-xl text-muted-foreground">
            Galeria este în curs de construcție. Reveniți în curând! 🎨
          </p>
        </div>
      ) : null}
    </div>
  );
}
