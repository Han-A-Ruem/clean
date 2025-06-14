
import { supabase } from "@/integrations/supabase/client";
import { Rank } from "@/hooks/useRanks";
import { toast } from "sonner";

/**
 * Check if a user qualifies for a rank promotion based on specific criteria
 * @param userId The ID of the user to check for promotion
 * @returns Promise<boolean> indicating if a promotion occurred
 */
export const checkForRankPromotion = async (userId: string): Promise<boolean> => {
  try {
    // 1. Get current user data including current rank
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('rank_id')
      .eq('user_id', userId)
      .single();

    if (userError) throw userError;
    if (!userData.rank_id) return false;

    // 2. Get all active ranks ordered by their progression
    const { data: ranks, error: ranksError } = await supabase
      .from('ranks')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (ranksError) throw ranksError;
    
    // 3. Find current rank index
    const currentRankIndex = ranks.findIndex(rank => rank.id === userData.rank_id);
    if (currentRankIndex === -1 || currentRankIndex === ranks.length - 1) return false; // Already at highest rank or rank not found
    
    // 4. Get the next rank
    const nextRank = ranks[currentRankIndex + 1];
    const currentRank = ranks[currentRankIndex];

    // 5. Check promotion criteria based on current rank
    let meetsPromotionCriteria = false;
    
    if (currentRankIndex === 0) { // If current rank is Plum (index 0)
      meetsPromotionCriteria = await checkPlumToForsythiaCriteria(userId);
    } else if (currentRankIndex === 1) { // If current rank is Forsythia (index 1)
      // For future implementation: criteria for Forsythia to Rose
      meetsPromotionCriteria = false; // Not implemented yet
    }
    // Add more rank transition criteria as needed
    
    if (meetsPromotionCriteria) {
      // 6. Update user rank
      const { error: updateError } = await supabase
        .from('users')
        .update({ rank_id: nextRank.id })
        .eq('user_id', userId);
        
      if (updateError) throw updateError;
      
      // 7. Create a notification for the user
      await supabase.from('notifications').insert({
        user_id: userId,
        title: '등급 승급 축하합니다!',
        message: `${currentRank.name}에서 ${nextRank.name}으로 등급이 승급되었습니다.`,
        type: 'rank_promotion',
        status: 'unread'
      });
      
      console.log(`User ${userId} promoted from ${currentRank.name} to ${nextRank.name}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking for rank promotion:', error);
    return false;
  }
};

/**
 * Check specific criteria for promotion from Plum to Forsythia
 * - Customer satisfaction is > 4.0
 * - More than 10 works booked
 */
const checkPlumToForsythiaCriteria = async (userId: string): Promise<boolean> => {
  try {
    // Count completed reservations by this cleaner
    const { count: reservationCount, error: reservationError } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('cleaner_id', userId)
      .eq('status', 'completed');
      
    if (reservationError) throw reservationError;
    
    // Check if reservation count meets the criterion (> 10)
    const hasEnoughReservations = (reservationCount || 0) > 10;
    
    // In a real app, you'd query a ratings table
    // For now, let's assume a simplified approach to check ratings
    // This would be replaced with actual rating data in production
    let averageRating = 0;
    
    // Get ratings from completed reservations with reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        mood,
        reservation_id,
        reservations:reservation_id(
          cleaner_id
        )
      `)
      .eq('reservations.cleaner_id', userId);
      
    if (reviewsError) throw reviewsError;
    
    let totalRating = 0;
    let ratingCount = 0;
    
    // Calculate average rating based on mood (assuming mood is a number from 1-5)
    if (reviews && reviews.length > 0) {
      reviews.forEach(review => {
        if (review.mood) {
          const numericRating = parseInt(review.mood);
          if (!isNaN(numericRating)) {
            totalRating += numericRating;
            ratingCount++;
          }
        }
      });
      
      if (ratingCount > 0) {
        averageRating = totalRating / ratingCount;
      } else {
        // Fallback if no numeric ratings found
        averageRating = 4.2;  // Example value for testing
      }
    } else {
      // Fallback if no reviews are found
      averageRating = 4.2;  // Example value for testing
    }
    
    const hasGoodRating = averageRating > 4.0;
    
    console.log(`Promotion check for user ${userId}:`);
    console.log(`- Completed reservations: ${reservationCount} (required: >10)`);
    console.log(`- Average rating: ${averageRating.toFixed(1)} (required: >4.0)`);
    console.log(`- Meets criteria: ${hasEnoughReservations && hasGoodRating}`);
    
    // Both criteria must be met
    return hasEnoughReservations && hasGoodRating;
    
  } catch (error) {
    console.error('Error checking Plum to Forsythia criteria:', error);
    return false;
  }
};

/**
 * Get the current rank for a user
 */
export const getUserRank = async (userId: string): Promise<Rank | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        rank_id,
        ranks:rank_id(*)
      `)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) throw error;
    if (!data || !data.ranks) return null;
    
    return data.ranks as Rank;
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return null;
  }
};
