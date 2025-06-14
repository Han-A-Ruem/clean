
import { CleanerWithStats } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CleanerTableProps {
  cleaners: CleanerWithStats[];
  isLoading: boolean;
  selectedCleaners: string[];
  onSelectCleaner: (cleanerId: string) => void;
  onSelectAll: () => void;
  onRankUpdate: (cleaner: CleanerWithStats) => void;
  sortField: "name" | "reservation_count" | "address" | "created_at" | "rank_name";
  sortOrder: "asc" | "desc";
  onSort: (field: "name" | "reservation_count" | "address" | "created_at" | "rank_name") => void;
  searchTerm: string;
}

const CleanerTable = ({
  cleaners,
  isLoading,
  selectedCleaners,
  onSelectCleaner,
  onSelectAll,
  onRankUpdate,
  sortField,
  sortOrder,
  onSort,
  searchTerm
}: CleanerTableProps) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={cleaners.length > 0 && selectedCleaners.length === cleaners.length}
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
            <TableHead className="cursor-pointer" onClick={() => onSort("rank_name")}>
              등급 {sortField === "rank_name" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("reservation_count")}>
              담당 예약 수 {sortField === "reservation_count" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("created_at")}>
              가입일 {sortField === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>상태</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
              </TableRow>
            ))
          ) : cleaners.length > 0 ? (
            cleaners.map((cleaner) => (
              <TableRow 
                key={cleaner.id}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedCleaners.includes(cleaner.id)}
                    onCheckedChange={() => onSelectCleaner(cleaner.id)}
                    aria-label={`Select ${cleaner.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{cleaner.name || "이름 없음"}</TableCell>
                <TableCell>{cleaner.email || "이메일 없음"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{cleaner.address || "주소 없음"}</TableCell>
                <TableCell>
                  {cleaner.rank_name ? (
                    <div className="flex items-center">
                      <Avatar className={`${cleaner.rank_bg_color || 'bg-gray-100'} h-6 w-6 mr-2`}>
                        <AvatarFallback className={cleaner.rank_color || 'text-gray-600'}>
                          {cleaner.rank_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{cleaner.rank_name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">등급 없음</span>
                  )}
                </TableCell>
                <TableCell>{cleaner.reservation_count}</TableCell>
                <TableCell>{new Date(cleaner.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    cleaner.status === 'active' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cleaner.status === 'active' ? '활성' : '비활성'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRankUpdate(cleaner)}
                    className="flex items-center space-x-1"
                  >
                    <Star className="h-3.5 w-3.5 mr-1" />
                    <span>등급 변경</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                {searchTerm ? "검색 결과가 없습니다." : "청소 매니저가 없습니다."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CleanerTable;
