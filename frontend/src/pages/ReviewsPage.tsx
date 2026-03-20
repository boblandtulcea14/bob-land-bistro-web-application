import { useState } from 'react';
import { useGetApprovedReviews, useSubmitReview } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { Review, ReviewStatus } from '../backend';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

export default function ReviewsPage() {
  const { data: reviews, isLoading } = useGetApprovedReviews();
  const { mutate: submitReview, isPending } = useSubmitReview();

  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName || rating === 0 || !comment) return;

    const review: Review = {
      id: BigInt(0),
      reviewerName,
      rating: BigInt(rating),
      comment,
      status: ReviewStatus.pending,
      createdAt: BigInt(0),
    };

    submitReview(review, {
      onSuccess: () => {
        setReviewerName('');
        setRating(0);
        setComment('');
      },
    });
  };

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Recenzii Clienți</h1>
          <p className="text-lg text-muted-foreground">
            Vezi ce spun clienții noștri și lasă-ne și tu o recenzie
          </p>
        </div>

        {reviews && reviews.length > 0 && (
          <Card className="mb-12">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Bazat pe {reviews.length} {reviews.length === 1 ? 'recenzie' : 'recenzii'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Lasă o recenzie</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reviewerName">Numele tău *</Label>
                <Input
                  id="reviewerName"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Introduceți numele"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comentariu *</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Spune-ne despre experiența ta..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Se trimite...' : 'Trimite Recenzia'}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Recenzia ta va fi moderată înainte de a fi publicată
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recenzii recente</h2>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id.toString()}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{review.reviewerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(Number(review.createdAt) / 1000000), 'PPP', { locale: ro })}
                      </p>
                    </div>
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
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Nu există recenzii încă. Fii primul care lasă o recenzie!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
