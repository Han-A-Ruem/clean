
import { UserWithReservations } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserTableProps {
  users: UserWithReservations[];
  isLoading: boolean;
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  onAddressView: (user: UserWithReservations) => void;
  onRankUpdate?: (user: UserWithReservations) => void;
  sortField: string;
  sortOrder: string;
  onSort: (field: "name" | "reservation_count" | "address" | "created_at") => void;
  searchTerm: string;
}

const UserTable = ({
  users,
  isLoading,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onAddressView,
  onRankUpdate,
  sortField,
  sortOrder,
  onSort,
  searchTerm
}: UserTableProps) => {
  // Track copied state for each user by their ID
  const [copiedIds, setCopiedIds] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const copyToClipboard = (user: UserWithReservations) => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
      
      // Only update the state for this specific user
      setCopiedIds(prev => ({
        ...prev,
        [user.id]: true
      }));

      toast({
        title: "주소 복사 완료",
        description: "클립보드에 주소가 복사되었습니다.",
      });

      // Reset the copied state after 2 seconds for this specific user
      setTimeout(() => {
        setCopiedIds(prev => ({
          ...prev,
          [user.id]: false
        }));
      }, 2000);
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={users.length > 0 && selectedUsers.length === users.length}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
              이름 {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>이메일</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("address")}>
              주소 {sortField === "address" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            {/* {onRankUpdate && (
              <TableHead>등급</TableHead>
            )} */}
            <TableHead className="cursor-pointer" onClick={() => onSort("reservation_count")}>
              예약 수 {sortField === "reservation_count" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("created_at")}>
              가입일 {sortField === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>상태</TableHead>
            <TableHead>주소 보기</TableHead>
            {/* {onRankUpdate && (
              <TableHead>등급 관리</TableHead>
            )} */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                {/* {onRankUpdate && (
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                )} */}
                <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                {onRankUpdate && (
                  <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                )}
              </TableRow>
            ))
          ) : users.length > 0 ? (
            users.map((user) => (
              <TableRow
                key={user.id}
                isSelected={selectedUsers.includes(user.id)}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => onSelectUser(user.id)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.name || "이름 없음"}</TableCell>
                <TableCell>{user.email || "이메일 없음"}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={user.address || ""}>{user.address || "주소 없음"}</TableCell>
                {/* {onRankUpdate && (
                  <TableCell>
                    {user.rank_name ? (
                      <div className="flex items-center">
                        <Avatar className={`${user.rank_bg_color || 'bg-gray-100'} h-6 w-6 mr-2`}>
                          <AvatarFallback className={user.rank_color || 'text-gray-600'}>
                            {user.rank_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.rank_name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">등급 없음</span>
                    )}
                  </TableCell>
                )} */}
                <TableCell>{user.reservation_count}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {user.status === 'active' ? '활성' : '비활성'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddressView(user)}
                      disabled={!user.address}
                      className="flex items-center gap-1"
                    >
                      <MapPin className="h-4 w-4" />
                      주소
                    </Button>
                    {user?.address && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(user)}
                        className="flex items-center gap-1"
                      >
                        {copiedIds[user.id] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
                {/* {onRankUpdate && (
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRankUpdate(user)}
                      className="flex items-center space-x-1"
                    >
                      <Star className="h-3.5 w-3.5 mr-1" />
                      <span>등급</span>
                    </Button>
                  </TableCell>
                )} */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={onRankUpdate ? 10 : 8} className="text-center py-4">
                {searchTerm ? "검색 결과가 없습니다." : "사용자가 없습니다."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
