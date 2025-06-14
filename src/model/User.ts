import generateReferralCode from "@/components/Utils/generateReferralCode";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";


export type User =  Database["public"]["Tables"]["users"]["Row"];
export type UserWithRank = Database["public"]["Tables"]["users"]["Row"] & {
  rank: Database["public"]["Tables"]["ranks"]["Row"];
  addresses: Database["public"]["Tables"]["addresses"]["Row"][];
};


export async function createUserData( userId: string, email: string) {
  const referalCode = generateReferralCode();
        // Create a new user record
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            user_id: userId,
            email: email,
            type: 'customer', // Default user type
            referal_code: referalCode,
            is_active: true,
            status: 'active',
            monthly_cancellation_limit: 3,
            monthly_cancellations: 0,
            preferred_work_regions: [],
            preferred_working_days: [],
            preferred_working_hours: [],
            tags: []
          })
          .select()
          .single();

          console.log('New user created:', newUser);
        if (createError) throw createError;
}
// | 'registered' - only have an account no information what so ever
// | 'interview_info_entered' - has entered information about themselves
// | 'interview_applied' - has applied for a interview
// | 'interview_completed' - has completed an interview 
// | 'documents_submitted' - has submitted documents
// | 'active' - is active and working
type UserStatus = 'registered' | 'interview_info_entered' | 'interview_applied' | 'interview_completed' | 'documents_submitted' | 'active';
export  async function changeUserStatus(status: UserStatus, userId: string) {
  // Implement the logic to change user status
  // This could involve making an API call to update the user's status in the database

  console.log("Changing user status to:", status, "for user ID:", userId);
  try {
    const {data, error} = await supabase.from('users').update({status: status}).eq('user_id', userId)
    if (error) {
      console.error("Error updating user status:", error);
      return null;
    }
  } catch (error) {
    console.error("Error changing user status:", error);
    // Handle the error appropriately, e.g., show a notification to the user
  }
}
export async function updateUser({data, id}: {data: Partial<User>, id: string}) {
  try {
    const {data:user} = await supabase.from('users').update(data).eq('user_id',  id).select().single();
    return user;
  }catch (e) {
    console.error("Error updating user:", e);
    return null;
  }

}


export async function checkUserExistAndType(email: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, type')
      .eq('email', email)
      .single();

    if (error) {
      console.error("Error checking user existence:", error);
      return null;
    }

    return { exists: data ? true : false, type: data?.type };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return null;
  }
}


export async function getUserCustomer(): Promise<UserWithRank[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
      *,
      rank:ranks(*),
      addresses(*)
      `) // Select all user fields, all fields from the related rank, and all fields from related addresses
      .eq('type', 'customer') // Ensure the user is a customer
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }

    return  data  as unknown as UserWithRank[]; 
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}