import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '../Utils';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

type MoodType = 'good' | 'neutral' | 'bad';

interface Review {
  id: string;
  reservation_id: string;
  mood: MoodType;
  options: string[];
  comment: string;
  created_at: string;
  created_by: string;
}

const CustomerReviews = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            reservation:reservations!inner (
              cleaner_id
            )
          `)
          .eq('reservation.cleaner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Type assertion to ensure mood is of type MoodType
        const typedReviews = (data || []).map(review => ({
          ...review,
          mood: review.mood as MoodType
        }));
        
        setReviews(typedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  const getMoodEmoji = (mood: MoodType) => {
    switch (mood) {
      case 'good': return '😊';
      case 'neutral': return '😐';
      case 'bad': return '😞';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="pb-20">
        <PageHeader title='고객 후기' />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-cleaner"></div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="pb-20">
        <PageHeader title='고객 후기' />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
          <div className="bg-gray-100 rounded-full p-6 mb-6">
            <Star className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">아직 받은 후기가 없습니다</h2>
          <p className="text-gray-500 mb-6">
            고객님들의 소중한 후기와 피드백을 기다리고 있습니다.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeader title='고객 후기' />
      <div className="px-4 space-y-4 mt-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getMoodEmoji(review.mood)}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (review.mood === 'good' ? 5 : review.mood === 'neutral' ? 3 : 1)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
            </div>
            
            <div className="mb-3">
              <p className="text-gray-700">{review.comment}</p>
            </div>

            {review.options && review.options.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {review.options.map((option, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                  >
                    {option}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
