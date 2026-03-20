import { useGetPreOrders, useUpdatePreOrderStatus } from '../../hooks/useQueries';
import { PreOrderStatus } from '../../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Truck, Package } from 'lucide-react';

const statusLabels: Record<PreOrderStatus, string> = {
  [PreOrderStatus.pending]: 'În așteptare',
  [PreOrderStatus.confirmed]: 'Confirmată',
  [PreOrderStatus.completed]: 'Finalizată',
  [PreOrderStatus.cancelled]: 'Anulată',
};

const statusVariants: Record<PreOrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [PreOrderStatus.pending]: 'outline',
  [PreOrderStatus.confirmed]: 'default',
  [PreOrderStatus.completed]: 'secondary',
  [PreOrderStatus.cancelled]: 'destructive',
};

export default function OrderManagement() {
  const { data: preOrders, isLoading } = useGetPreOrders();
  const { mutate: updatePreOrderStatus } = useUpdatePreOrderStatus();

  const handleStatusChange = (preOrderId: bigint, status: PreOrderStatus) => {
    updatePreOrderStatus({ id: preOrderId, status });
  };

  const getOrderTypeInfo = (preOrder: any) => {
    if (preOrder.orderType.__kind__ === 'delivery') {
      const delivery = preOrder.orderType.delivery;
      return {
        type: 'Livrare',
        icon: <Truck className="h-4 w-4 inline mr-1" />,
        details: `${delivery.address.street}, ${delivery.address.city}`,
        timeSlot: `${delivery.timeSlot.start} - ${delivery.timeSlot.end}`,
      };
    } else {
      const pickup = preOrder.orderType.pickup;
      return {
        type: 'Ridicare',
        icon: <Package className="h-4 w-4 inline mr-1" />,
        details: 'La restaurant',
        timeSlot: pickup.pickupTime || 'Nespecificat',
      };
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestionare Precomenzi</h2>

      <Card>
        <CardHeader>
          <CardTitle>Precomenzi recente</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : preOrders && preOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Detalii</TableHead>
                    <TableHead>Interval orar</TableHead>
                    <TableHead>Creat la</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preOrders.map((preOrder) => {
                    const statusKey = preOrder.status as PreOrderStatus;
                    const orderInfo = getOrderTypeInfo(preOrder);
                    return (
                      <TableRow key={preOrder.id.toString()}>
                        <TableCell className="font-medium">#{preOrder.id.toString()}</TableCell>
                        <TableCell>{preOrder.customerName}</TableCell>
                        <TableCell>{preOrder.contactInfo}</TableCell>
                        <TableCell>
                          <span className="flex items-center whitespace-nowrap">
                            {orderInfo.icon}
                            {orderInfo.type}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={orderInfo.details}>
                          {orderInfo.details}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{orderInfo.timeSlot}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {format(new Date(Number(preOrder.createdAt) / 1000000), 'PPp', { locale: ro })}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={statusKey}
                            onValueChange={(value) => handleStatusChange(preOrder.id, value as PreOrderStatus)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue>
                                <Badge variant={statusVariants[statusKey]}>{statusLabels[statusKey]}</Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Nu există precomenzi momentan.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
