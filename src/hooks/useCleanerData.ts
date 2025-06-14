
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CleanerWithStats } from "@/types/admin";

export const useCleanerData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"name" | "reservation_count" | "address" | "created_at" | "rank_name">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCleaners, setSelectedCleaners] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Fetch cleaners data
  const { data: cleaners, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-cleaners'],
    queryFn: async () => {
      // First get all cleaners
      const { data: cleaners, error: cleanersError } = await supabase
        .from('users')
        .select('id, email, name, type, status, address, created_at, rank_id')
        .eq('type', 'cleaner')
        .order('created_at', { ascending: false });

      if (cleanersError) throw cleanersError;

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

      // For each cleaner, count their reservations and add rank info
      const cleanersWithDetailsPromises = cleaners.map(async (cleaner) => {
        const { count, error: countError } = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true })
          .eq('cleaner_id', cleaner.id);

        if (countError) console.error("Error counting reservations:", countError);
        
        // Get rank information if available
        const rank = cleaner.rank_id ? rankMap[cleaner.rank_id] : null;
        
        return {
          ...cleaner,
          reservation_count: count || 0,
          rank_name: rank?.name || null,
          rank_color: rank?.color || null,
          rank_bg_color: rank?.bg_color || null
        } as CleanerWithStats;
      });
      
      const cleanersWithDetails = await Promise.all(cleanersWithDetailsPromises);
      return cleanersWithDetails;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter cleaners based on search term
  const filteredCleaners = cleaners?.filter(cleaner => 
    cleaner.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cleaner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cleaner.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cleaner.rank_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Sort cleaners based on sort field and order
  const sortedCleaners = [...filteredCleaners].sort((a, b) => {
    if (sortField === "reservation_count") {
      return sortOrder === "asc" 
        ? (a.reservation_count || 0) - (b.reservation_count || 0)
        : (b.reservation_count || 0) - (a.reservation_count || 0);
    }
    
    if (sortField === "rank_name") {
      const aRank = a.rank_name || '';
      const bRank = b.rank_name || '';
      return sortOrder === "asc" 
        ? aRank.localeCompare(bRank)
        : bRank.localeCompare(aRank);
    }
    
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  // Paginate cleaners
  const totalPages = Math.ceil(sortedCleaners.length / itemsPerPage);
  const paginatedCleaners = sortedCleaners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle checkbox selection
  const handleSelectCleaner = (cleanerId: string) => {
    setSelectedCleaners(prev => {
      if (prev.includes(cleanerId)) {
        return prev.filter(id => id !== cleanerId);
      } else {
        return [...prev, cleanerId];
      }
    });
  };

  // Handle select all cleaners on current page
  const handleSelectAll = () => {
    if (selectedCleaners.length === paginatedCleaners.length) {
      // Deselect all if all are currently selected
      setSelectedCleaners([]);
    } else {
      // Select all cleaners on current page
      setSelectedCleaners(paginatedCleaners.map(cleaner => cleaner.id));
    }
  };

  const handleSort = (field: "name" | "reservation_count" | "address" | "created_at" | "rank_name") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    sortField,
    sortOrder,
    handleSort,
    selectedCleaners,
    handleSelectCleaner,
    handleSelectAll,
    paginatedCleaners,
    totalPages,
    isLoading,
    error,
    refetch,
    filteredCleaners
  };
};
