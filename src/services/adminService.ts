
import { supabase } from "@/integrations/supabase/client";
import { CustomerWithStats, CleanerWithStats, ReservationWithDetails } from "@/types/admin";
import { ReservationStatus } from "@/types/reservation";

/**
 * Fetch users with specific type
 * @param type - The type of users to fetch (customer, cleaner, etc.)
 * @returns Users data with reservation counts and rank information
 */
export const fetchUsersWithStats = async (type: string): Promise<CustomerWithStats[] | CleanerWithStats[]> => {
  // First, get all users of the specified type
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, name, type, status, created_at, address, rank_id')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (usersError) throw usersError;

  // Get all ranks for lookup
  const { data: ranks, error: ranksError } = await supabase
    .from('ranks')
    .select('id, name, color, bg_color');
    
  if (ranksError) throw ranksError;
  
  // Create a rank lookup map
  const rankMap = (ranks || []).reduce((acc, rank) => {
    acc[rank.id] = rank;
    return acc;
  }, {} as Record<string, any>);

  // For each user, count their reservations and add rank info
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const { count, error: countError } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('user', user.id);

      if (countError) console.error("Error counting reservations:", countError);
      
      // Get rank information if available
      const rank = user.rank_id ? rankMap[user.rank_id] : null;
      
      return {
        ...user,
        reservation_count: count || 0,
        rank_name: rank?.name || null,
        rank_color: rank?.color || null,
        rank_bg_color: rank?.bg_color || null
      };
    })
  );

  return usersWithStats;
};

/**
 * Fetch all reservations with customer and cleaner details
 */
export const getReservationsWithDetails = async (): Promise<ReservationWithDetails[]> => {
  // Fetch all reservations
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id, date, time, address, status, type, 
      user, cleaner_id, amount, created_at, infant, pet, parking,
      supply_location, dispose_types, duration, entry, unit_pass, lobby_pass,
      custom_message, phone_number, additional_service, cancellation_reason
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Get customer and cleaner names for each reservation
  const enhancedReservations = await Promise.all((data || []).map(async (reservation) => {
    // Initialize with base reservation data
    const enhancedReservation: ReservationWithDetails = {
      ...reservation,
      status: reservation.status as ReservationStatus, // Cast status to ReservationStatus
      customer_name: null,
      customer_email: null,
      cleaner_name: null,
      is_resident: false,
      resident_name: "",
      resident_phone: 0
    };

    // Get customer name and email
    const customerId = reservation.user;
    if (customerId) {
      const { data: customerData } = await supabase
        .from('users')
        .select('name, email')
        .eq('user_id', customerId)
        .maybeSingle();
      enhancedReservation.customer_name = customerData?.name;
      enhancedReservation.customer_email = customerData?.email;
    }

    // Get cleaner name
    if (reservation.cleaner_id) {
      const { data: cleanerData } = await supabase
        .from('users')
        .select('name')
        .eq('user_id', reservation.cleaner_id)
        .maybeSingle();
      enhancedReservation.cleaner_name = cleanerData?.name;
    }

    return enhancedReservation;
  }));

  return enhancedReservations;
};

/**
 * Update a user's rank
 * @param userId - The ID of the user to update
 * @param rankId - The ID of the rank to assign
 */
export const updateUserRank = async (userId: string, rankId: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ rank_id: rankId })
    .eq('user_id', userId);
    
  if (error) throw error;
};
