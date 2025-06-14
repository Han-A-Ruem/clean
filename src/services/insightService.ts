
import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/types/reservation";

/**
 * Fetch all clients (customers and cleaners) with their latest reservation
 */
export const fetchClientsWithLatestReservation = async (searchTerm = '') => {
  try {
    // First get all users who are either customers or cleaners
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, type, profile_photo')
      .or('type.eq.customer,type.eq.cleaner')
      .ilike('name', `%${searchTerm}%`);

    if (usersError) throw usersError;

    // For each user, find their latest reservation
    const clientsWithReservations = await Promise.all(
      (users || []).map(async (user) => {
        let query = supabase
          .from('reservations')
          .select(`
            id, date, time, status, type, amount, address,
            cleaner_id, user, created_at
          `);

        // Filter query based on user type
        if (user.type === 'customer') {
          query = query.eq('user', user.id);
        } else if (user.type === 'cleaner') {
          query = query.eq('cleaner_id', user.id);
        }

        const { data: reservations, error: reservationsError } = await query
          .order('created_at', { ascending: false })
          .limit(1);

        if (reservationsError) {
          console.error("Error fetching reservations:", reservationsError);
          return {
            ...user,
            latest_reservation: null,
          };
        }

        // Get address details if there's a reservation
        let addressDetails = null;
        if (reservations && reservations.length > 0 && reservations[0].address) {
          const { data: address } = await supabase
            .from('addresses')
            .select('address')
            .eq('id', reservations[0].address)
            .single();
          
          addressDetails = address?.address || null;
        }

        return {
          ...user,
          latest_reservation: reservations && reservations.length > 0 
            ? { 
                ...reservations[0],
                address_details: addressDetails 
              }
            : null,
        };
      })
    );

    // Get details for cleaners and customers related to these reservations
    const clientsWithDetails = await Promise.all(
      clientsWithReservations.map(async (client) => {
        if (!client.latest_reservation) return client;

        let cleanerDetails = null;
        let customerDetails = null;

        // Get cleaner details if there's a cleaner_id
        if (client.latest_reservation.cleaner_id) {
          const { data: cleaner } = await supabase
            .from('users')
            .select('id, name, profile_photo')
            .eq('user_id', client.latest_reservation.cleaner_id)
            .single();
          
          cleanerDetails = cleaner || null;
        }

        // Get customer details if there's a user field
        if (client.latest_reservation.user) {
          const { data: customer } = await supabase
            .from('users')
            .select('id, name, profile_photo')
            .eq('user_id', client.latest_reservation.user)
            .single();
          
          customerDetails = customer || null;
        }

        return {
          ...client,
          latest_reservation: {
            ...client.latest_reservation,
            cleaner_details: cleanerDetails,
            customer_details: customerDetails
          }
        };
      })
    );

    return clientsWithDetails;
  } catch (error) {
    console.error("Error in fetchClientsWithLatestReservation:", error);
    throw error;
  }
};

/**
 * Fetch a client's latest reservation details
 */
export const fetchClientReservationDetails = async (clientId: string) => {
  try {
    // First get the client details
    const { data: client, error: clientError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', clientId)
      .single();

    if (clientError) throw clientError;

    // Get their latest reservation
    let query = supabase
      .from('reservations')
      .select(`
        *
      `);

    // Filter query based on client type
    if (client.type === 'customer') {
      query = query.eq('user', client.id);
    } else if (client.type === 'cleaner') {
      query = query.eq('cleaner_id', client.id);
    }

    const { data: reservation, error: reservationError } = await query
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (reservationError && reservationError.code !== 'PGRST116') {
      throw reservationError;
    }

    // Get address details if there's a reservation
    let addressDetails = null;
    if (reservation && reservation.address) {
      const { data: address } = await supabase
        .from('addresses')
        .select('address')
        .eq('id', reservation.address)
        .single();
      
      addressDetails = address?.address || null;
    }

    // Get cleaner details if there's a cleaner_id
    let cleanerDetails = null;
    if (reservation && reservation.cleaner_id) {
      const { data: cleaner } = await supabase
        .from('users')
        .select('id, name, profile_photo, phone_number, email')
        .eq('user_id', reservation.cleaner_id)
        .single();
      
      cleanerDetails = cleaner || null;
    }

    // Get customer details if there's a user field
    let customerDetails = null;
    if (reservation && reservation.user) {
      const { data: customer } = await supabase
        .from('users')
        .select('id, name, profile_photo, phone_number, email')
        .eq('user_id', reservation.user)
        .single();
      
      customerDetails = customer || null;
    }

    return {
      client,
      reservation: reservation ? {
        ...reservation,
        address_details: addressDetails,
        cleaner_details: cleanerDetails,
        customer_details: customerDetails
      } : null
    };
  } catch (error) {
    console.error("Error in fetchClientReservationDetails:", error);
    throw error;
  }
};
