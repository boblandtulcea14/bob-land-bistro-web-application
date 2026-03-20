import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import MenuManagement from '../components/admin/MenuManagement';
import OrderManagement from '../components/admin/OrderManagement';
import ReviewModeration from '../components/admin/ReviewModeration';
import DomainValidationManagement from '../components/admin/DomainValidationManagement';
import GoLiveButton from '../components/GoLiveButton';

export default function AdminDashboard() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const [activeTab, setActiveTab] = useState('menu');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Se verifică permisiunile...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nu aveți permisiunea de a accesa această pagină. Doar administratorii pot accesa panoul de administrare.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Panou Administrare</h1>
        <GoLiveButton />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="menu">Meniu</TabsTrigger>
          <TabsTrigger value="orders">Precomenzi</TabsTrigger>
          <TabsTrigger value="reviews">Recenzii</TabsTrigger>
          <TabsTrigger value="domain">Domeniu</TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <MenuManagement />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewModeration />
        </TabsContent>

        <TabsContent value="domain">
          <DomainValidationManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
