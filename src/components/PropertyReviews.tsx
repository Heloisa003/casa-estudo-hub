import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface PropertyReviewsProps {
  propertyId: string;
}

export const PropertyReviews = ({ propertyId }: PropertyReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    loadReviews();
    if (user) {
      checkCanReview();
    }
  }, [propertyId, user]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  const checkCanReview = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('tenant_id', user.id)
        .eq('property_id', propertyId)
        .eq('status', 'completed')
        .limit(1);

      if (error) throw error;
      setCanReview((data || []).length > 0);
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          property_id: propertyId,
          user_id: user.id,
          rating,
          comment
        });

      if (error) throw error;

      toast({
        title: "✨ Avaliação enviada!",
        description: "Obrigado por compartilhar sua experiência"
      });

      setRating(0);
      setComment('');
      setShowForm(false);
      loadReviews();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Avaliações</h3>
          {reviews.length > 0 ? (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= averageRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviews.length} avaliações)
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              Nenhuma avaliação ainda
            </p>
          )}
        </div>

        {canReview && !showForm && (
          <Button onClick={() => setShowForm(true)}>
            Avaliar Propriedade
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 border rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Sua avaliação
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Comentário
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Compartilhe sua experiência..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || rating === 0}>
              Enviar Avaliação
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setRating(0);
                setComment('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Ainda não há avaliações para esta propriedade
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={review.profiles.avatar_url || undefined} />
                  <AvatarFallback>
                    {review.profiles.full_name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{review.profiles.full_name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
