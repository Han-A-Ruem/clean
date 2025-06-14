
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserWithReservations } from "@/types/admin";
import { getUserCustomer } from "@/model/User";

export const useAdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"name" | "reservation_count" | "address" | "created_at" | "rank_name">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [rankUpdateDialogOpen, setRankUpdateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithReservations | null>(null);
  const itemsPerPage = 10;

  // Fetch users with reservation count and rank information
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getUserCustomer,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rank.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Sort users based on sort field and order
  const sortedUsers = [...filteredUsers].sort((a, b) => {
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

  // Paginate users
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort changes
  const handleSort = (field: "name" | "reservation_count" | "address" | "created_at" | "rank_name") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Handle checkbox selection
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Handle select all users on current page
  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      // Deselect all if all are currently selected
      setSelectedUsers([]);
    } else {
      // Select all users on current page
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  // Open rank update dialog
  const openRankUpdateDialog = (user: UserWithReservations) => {
    setSelectedUser(user);
    setRankUpdateDialogOpen(true);
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    sortField,
    sortOrder,
    handleSort,
    filteredUsers,
    sortedUsers,
    paginatedUsers,
    totalPages,
    isLoading,
    error,
    selectedUsers,
    handleSelectUser,
    handleSelectAll,
    itemsPerPage,
    rankUpdateDialogOpen,
    setRankUpdateDialogOpen,
    selectedUser,
    openRankUpdateDialog,
    refetch
  };
};
