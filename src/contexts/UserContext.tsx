import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Rank } from "@/hooks/useRanks";
import { Json } from "@/integrations/supabase/types";
import { createUserData , UserWithRank, type User as UserData } from "@/model/User";


interface UserContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  fetchUserData: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userData: null,
  loading: true,
  fetchUserData: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserWithRank | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // First check if the user exists in the database
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", userId)
        .single();
      // If user doesn't exist, create a new user record
      if (checkError || !existingUser) {
        // Get the user's email from auth
        const { data: authUser } = await supabase.auth.getUser();
        const email = authUser?.user?.email;
        await createUserData(userId, email);
      }
      
      // Now fetch the user data (either existing or newly created)
      const { data, error } = await supabase
        .from("users")
        .select(`
          *,
          rank:rank_id(*),
          addresses:address(*)
        `)
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      
      // Check if user is inactive
      if (data && data.is_active === false) {
        // Sign out the user if they are inactive
        await supabase.auth.signOut();
        setUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }
      
      // Fetch user preferred manager data (including cleaning supplies)
      const { data: preferredManagerData, error: preferredManagerError } = await supabase
        .from("user_preferred_managers")
        .select("*")
        .eq("user_id", userId);
        
      console.log('Preferred manager data:', preferredManagerData);
      
      if (preferredManagerError) {
        console.warn("Error fetching preferred manager data:", preferredManagerError);
      }

      // Use cleaning supplies from user_preferred_managers if available, otherwise set empty object
      const cleaningSupplies = 
        preferredManagerData && 
        preferredManagerData.length > 0 ? 
        preferredManagerData[0].cleaning_supplies : 
        {};
      
      // Get address string from the related address object if it exists
      const addressStr = data.addresses ? data.addresses.address : null;

      console.log("User data:", data);
      console.log("Address string:", addressStr);
      console.log("Cleaning supplies:", cleaningSupplies);
        setUserData({
          ...data,
          rank: data.rank,
          addresses: [data.addresses],
          address: addressStr,
        });
        console.log("User data set:", { ...data, rank: data.rank, addresses: [data.addresses], address: addressStr });
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate a random referral code


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id);
    } else {
      setUserData(null);
    }
  }, [user?.id]);
  return (
    <UserContext.Provider value={{ user, userData, loading, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
