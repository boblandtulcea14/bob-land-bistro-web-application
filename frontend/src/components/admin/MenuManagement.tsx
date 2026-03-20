import { useState } from 'react';
import { useGetMenuItems, useAddMenuItem, useUpdateMenuItem, useRemoveMenuItem, useAddDefaultClatiteWafflesMenuItems } from '../../hooks/useQueries';
import { MenuItem, MenuCategory } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Pencil, Trash2, Plus, Loader2, Sparkles, IceCream, Cake, Sandwich, Cookie, Pizza, Croissant, Coffee } from 'lucide-react';
import { useFileUpload } from '../../blob-storage/FileStorage';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

export default function MenuManagement() {
  const { data: menuItems, isLoading } = useGetMenuItems();
  const { mutate: addMenuItem, isPending: isAdding } = useAddMenuItem();
  const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem();
  const { mutate: removeMenuItem, isPending: isDeleting } = useRemoveMenuItem();
  const { mutate: addDefaultItems, isPending: isAddingDefaults } = useAddDefaultClatiteWafflesMenuItems();
  const { uploadFile, isUploading } = useFileUpload();

  const [activeCategory, setActiveCategory] = useState<MenuCategory>(MenuCategory.inghetataArtizanalaItaliana);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: MenuCategory.inghetataArtizanalaItaliana,
    imagePath: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: MenuCategory.inghetataArtizanalaItaliana,
      imagePath: '',
    });
    setImageFile(null);
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        imagePath: item.imagePath || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imagePath = formData.imagePath;

    if (imageFile) {
      const path = `menu/${Date.now()}-${imageFile.name}`;
      const result = await uploadFile(path, imageFile);
      imagePath = path;
    }

    const menuItem: MenuItem = {
      id: editingItem?.id || 0n,
      name: formData.name,
      description: formData.description,
      price: BigInt(formData.price),
      category: formData.category,
      imagePath: imagePath || undefined,
      createdAt: editingItem?.createdAt || BigInt(Date.now()) * 1000000n,
    };

    if (editingItem) {
      updateMenuItem(
        { id: editingItem.id, menuItem },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            resetForm();
          },
        }
      );
    } else {
      addMenuItem(menuItem, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleDelete = (id: bigint) => {
    if (confirm('Sigur doriți să ștergeți acest produs?')) {
      removeMenuItem(id);
    }
  };

  const handleAddDefaultItems = () => {
    if (confirm('Sigur doriți să adăugați produsele implicite din categoria Clătite & Waffles? Aceasta va adăuga 5 produse noi.')) {
      addDefaultItems();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const clatiteWafflesCount = menuItems?.filter(item => item.category === MenuCategory.clatiteWaffles).length || 0;
  const filteredItems = menuItems?.filter((item) => item.category === activeCategory) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestionare Meniu</CardTitle>
              <CardDescription>Adaugă, editează sau șterge produse din meniu</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="rounded-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Adaugă Produs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Editează Produs' : 'Adaugă Produs Nou'}</DialogTitle>
                  <DialogDescription>
                    Completează informațiile despre produs
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nume produs *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Ex: Clătite cu ciocolată"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descriere *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      placeholder="Descrierea produsului..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Preț (RON) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categorie *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as MenuCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOrder.map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              {categoryIcons[category]}
                              <span>{categoryLabels[category]}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="image">Imagine produs</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formData.imagePath && !imageFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Imagine curentă: {formData.imagePath}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Anulează
                    </Button>
                    <Button type="submit" disabled={isAdding || isUpdating || isUploading}>
                      {isAdding || isUpdating || isUploading
                        ? 'Se salvează...'
                        : editingItem
                        ? 'Actualizează'
                        : 'Adaugă'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {clatiteWafflesCount === 0 && (
            <Alert className="border-primary/50 bg-primary/5">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Categoria <strong>Clătite & Waffles</strong> este goală. Adaugă produsele implicite pentru a începe rapid!
                </span>
                <Button
                  onClick={handleAddDefaultItems}
                  disabled={isAddingDefaults}
                  variant="outline"
                  size="sm"
                  className="ml-4 rounded-full"
                >
                  {isAddingDefaults ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se adaugă...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Adaugă produse implicite
                    </>
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as MenuCategory)}>
          <ScrollArea className="w-full whitespace-nowrap mb-6">
            <TabsList className="inline-flex h-auto gap-2 bg-transparent p-2">
              {categoryOrder.map((category) => {
                const categoryCount = menuItems?.filter(item => item.category === category).length || 0;
                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="rounded-3xl px-5 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-secondary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-playful hover:scale-105 flex items-center gap-2 whitespace-nowrap border-2 border-border data-[state=active]:border-transparent"
                  >
                    {categoryIcons[category]}
                    <span>{categoryLabels[category]}</span>
                    <span className="ml-1 text-xs opacity-70">({categoryCount})</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {categoryOrder.map((category) => (
            <TabsContent key={category} value={category}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume</TableHead>
                    <TableHead>Descriere</TableHead>
                    <TableHead>Preț</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={Number(item.id)}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="max-w-md truncate">{item.description}</TableCell>
                        <TableCell>{Number(item.price)} RON</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleOpenDialog(item)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                              disabled={isDeleting}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        <div className="flex flex-col items-center gap-2">
                          {categoryIcons[category]}
                          <p>Nu există produse în categoria <strong>{categoryLabels[category]}</strong>.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
