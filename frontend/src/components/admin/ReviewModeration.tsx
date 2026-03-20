import { useGetReviews, useModerateReview } from '../../hooks/useQueries';
import { ReviewStatus } from '../../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

const statusLabels: Record<ReviewStatus, string> = {
  [ReviewStatus.pending]: 'În așteptare',
  [ReviewStatus.approved]: 'Aprobată',
  [ReviewStatus.rejected]: 'Respinsă',
};

const statusVariants: Record<ReviewStatus, 'default' | 'secondary' | 'destructive'> = {
  [ReviewStatus.pending]: 'secondary',
  [ReviewStatus.approved]: 'default',
  [ReviewStatus.rejected]: 'destructive',
};

export default function ReviewModeration() {
  const { data: reviews, isLoading } = useGetReviews();
  const { mutate: moderateReview } = useModerateReview();

  const handleApprove = (reviewId: bigint) => {
    moderateReview({ id: reviewId, status: ReviewStatus.approved });
  };

  const handleReject = (reviewId: bigint) => {
    moderateReview({ id: reviewId, status: ReviewStatus.rejected });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Moderare Recenzii</h2>

      <Card>
        <CardHeader>
          <CardTitle>Recenzii</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : reviews && reviews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Autor</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comentariu</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => {
                  const statusKey = review.status as ReviewStatus;
                  return (
                    <TableRow key={review.id.toString()}>
                      <TableCell className="font-medium">{review.reviewerName}</TableCell>
                      <TableCell>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Number(review.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2 text-sm">{review.comment}</p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(Number(review.createdAt) / 1000000), 'PPp', { locale: ro })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[statusKey]}>{statusLabels[statusKey]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {statusKey === ReviewStatus.pending && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApprove(review.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Aprobă
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleReject(review.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Respinge
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Nu există recenzii momentan.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
