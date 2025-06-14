
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserListControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortField: "name" | "reservation_count" | "address" | "created_at" | "rank_name";
  onSortFieldChange: (value: "name" | "reservation_count" | "address" | "created_at" | "rank_name") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  selectedUsersCount: number;
  onBulkAction: () => void;
  totalUsers: number;
}

const UserListControls = ({
  searchTerm,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  selectedUsersCount,
  onBulkAction,
  totalUsers
}: UserListControlsProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="사용자 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Select 
            value={sortField} 
            onValueChange={(value) => onSortFieldChange(value as any)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="name">이름</SelectItem>
              <SelectItem value="reservation_count">예약 수</SelectItem>
              <SelectItem value="address">주소</SelectItem>
              <SelectItem value="created_at">가입일</SelectItem>
              <SelectItem value="rank_name">등급</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={sortOrder} 
            onValueChange={(value) => onSortOrderChange(value as any)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="순서" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="asc">오름차순</SelectItem>
              <SelectItem value="desc">내림차순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          총 {totalUsers}명의 고객이 있습니다
        </div>
        
        {selectedUsersCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBulkAction}
          >
            {selectedUsersCount}명 선택됨
          </Button>
        )}
      </div>
    </>
  );
};

export default UserListControls;
