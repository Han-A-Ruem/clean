import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReservationsWithDetails } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Link as LinkIcon, User, Mail, Phone, Home, Calendar, Shield, Wallet, Package, Clock, MapPin, CreditCard, Check, X } from "lucide-react";
import { ReservationWithDetails } from "@/types/admin";
import { formatDate } from "@/components/home/DateUtils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ReservationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"created_at" | "date" | "amount">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithDetails | null>(null);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: getReservationsWithDetails,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const reservations = data || [];
  
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.cleaner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof reservation.address === 'string' && reservation.address?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      reservation.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (sortField === "date" && a.date && b.date) {
      const aDateArray = Array.isArray(a.date) ? a.date : [a.date];
      const bDateArray = Array.isArray(b.date) ? b.date : [b.date];
      
      const aDate = aDateArray[0] ? new Date(aDateArray[0]) : new Date(0);
      const bDate = bDateArray[0] ? new Date(bDateArray[0]) : new Date(0);
      return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    }
    
    if (sortField === "amount") {
      const aAmount = a.amount || 0;
      const bAmount = b.amount || 0;
      return sortOrder === "asc" ? aAmount - bAmount : bAmount - aAmount;
    }
    
    const aDate = new Date(a.created_at);
    const bDate = new Date(b.created_at);
    return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
  });

  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const paginatedReservations = sortedReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: "created_at" | "date" | "amount") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">알 수 없음</Badge>;
    
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">대기중</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">확인됨</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">완료됨</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">취소됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderDates = (dateValue: string | string[] | null | undefined) => {
    if (!dateValue) return "날짜 없음";
    
    if (Array.isArray(dateValue)) {
      return dateValue.map(d => formatDate(d)).join(", ");
    }
    
    return formatDate(dateValue);
  };

  const handleViewUserDetails = async (userId: string | null) => {
    if (!userId) {
      toast({
        title: "사용자 정보 없음",
        description: "예약에 연결된 사용자 정보가 없습니다.",
        variant: "destructive",
      });
      return;
    }

    console.log("Fetching user details for:", userId);
    setSelectedUserId(userId);

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (userError) {
        throw userError;
      }

      if (!userData) {
        toast({
          title: "사용자를 찾을 수 없음",
          description: "해당 사용자 정보를 찾을 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      console.log("User data retrieved:", userData);
      setSelectedUserDetails(userData);
      setUserDialogOpen(true);

      toast({
        title: "사용자 정보",
        description: `${userData.name || "사용자"}님의 정보를 보고 있습니다.`,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast({
        title: "사용자 정보 조회 실패",
        description: "사용자 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleViewReservationDetails = (reservation: ReservationWithDetails) => {
    setSelectedReservation(reservation);
    setReservationDialogOpen(true);
  };

  if (error) {
    console.error("Error loading reservations:", error);
    return <div className="text-red-500">예약 목록을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="예약 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
              <SelectItem value="confirmed">확인됨</SelectItem>
              <SelectItem value="completed">완료됨</SelectItem>
              <SelectItem value="cancelled">취소됨</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Select 
              value={sortField} 
              onValueChange={(value) => setSortField(value as any)}
            >
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="created_at">예약 생성일</SelectItem>
                <SelectItem value="date">예약 날짜</SelectItem>
                <SelectItem value="amount">금액</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={sortOrder} 
              onValueChange={(value) => setSortOrder(value as any)}
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
      </div>

      <div className="text-sm text-gray-500">
        총 {filteredReservations.length}개의 예약이 있습니다
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>예약 타입</TableHead>
              <TableHead>고객</TableHead>
              <TableHead>청소 매니저</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                날짜 및 시간 {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>주소</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                금액 {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>상태</TableHead>
              <TableHead>고객 정보</TableHead>
              <TableHead>상세정보</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[30px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[30px]" /></TableCell>
                </TableRow>
              ))
            ) : paginatedReservations.length > 0 ? (
              paginatedReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.type || "알 수 없음"}</TableCell>
                  <TableCell>{reservation.customer_name || "미지정"}</TableCell>
                  <TableCell>{reservation.cleaner_name || "미지정"}</TableCell>
                  <TableCell>
                    {Array.isArray(reservation.date) && reservation.date.length > 0 
                      ? formatDate(reservation.date[0])
                      : reservation.date 
                        ? formatDate(reservation.date as string)
                        : "날짜 없음"
                    }
                    {reservation.time ? ` ${reservation.time}` : ""}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={reservation.address || ""}>
                    {reservation.address || "주소 없음"}
                  </TableCell>
                  <TableCell>
                    {reservation.amount ? `${reservation.amount.toLocaleString()}원` : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewUserDetails(reservation.user)}
                      disabled={!reservation.user}
                      className="flex items-center gap-1"
                    >
                      <User className="h-4 w-4" />
                      고객정보
                    </Button>
                  </TableCell>
                  <TableCell>
                    <button 
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={() => handleViewReservationDetails(reservation)}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <LinkIcon className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>상세 정보 보기</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  {searchTerm || statusFilter !== "all" ? "검색 결과가 없습니다." : "예약이 없습니다."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-cyan-600" />
              고객 상세 정보
            </DialogTitle>
          </DialogHeader>
          
          {selectedUserDetails ? (
            <div className="mt-4 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-100 text-cyan-700 h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold">
                    {selectedUserDetails.name ? selectedUserDetails.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedUserDetails.name || "이름 없음"}</h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(selectedUserDetails.created_at).toLocaleDateString('ko-KR')} 가입
                    </p>
                  </div>
                </div>
                <Badge className={`px-3 py-1 ${
                  selectedUserDetails.status === 'active' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                  {selectedUserDetails.status === 'active' ? '활성' : '비활성'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">연락처 정보</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedUserDetails.email || "정보 없음"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedUserDetails.phone_number || "정보 없음"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Home className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-sm">{selectedUserDetails.address || "정보 없음"}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">계정 정보</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">회원 유형: {selectedUserDetails.type || "정보 없음"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">월간 취소 횟수: {selectedUserDetails.monthly_cancellations || 0} / {selectedUserDetails.monthly_cancellation_limit || 3}</span>
                  </div>
                  {selectedUserDetails.bank_name && (
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">결제 정보: {selectedUserDetails.bank_name} {selectedUserDetails.bank_account || ""}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* <div className="grid grid-cols-2 gap-3 pt-2"> */}
              <div className="flex justify-end w-full ">
                <Button variant="outline"  className="" onClick={() => setUserDialogOpen(false)}>
                  닫기
                </Button>
                {/* {selectedUserDetails.email && (
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => window.location.href = `mailto:${selectedUserDetails.email}`}>
                    이메일 보내기
                  </Button>
                )} */}
              </div>
            </div>
          ) : (
            <div className="py-12">
              <div className="flex flex-col items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="bg-background p-6">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-xl font-bold">예약 상세 정보</DialogTitle>
              <DialogClose className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>
            
            {selectedReservation && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">예약 ID:</p>
                      <p className="font-medium">{selectedReservation.id}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">예약 타입:</p>
                      <p className="font-medium">{selectedReservation.type || "알 수 없음"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">고객:</p>
                      <p className="font-medium">{selectedReservation.customer_name || "알 수 없음"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">이메일:</p>
                      <p className="font-medium">{selectedReservation.customer_email || "알 수 없음"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">청소 매니저:</p>
                      <p className="font-medium">{selectedReservation.cleaner_name || "미지정"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">날짜:</p>
                      <p className="font-medium">
                        {renderDates(selectedReservation.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">시간:</p>
                      <p className="font-medium">{selectedReservation.time || "시간 없음"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">주소:</p>
                      <p className="font-medium">{selectedReservation.address || "주소 없음"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">금액:</p>
                      <p className="font-medium text-lg">
                        {selectedReservation.amount ? `${selectedReservation.amount.toLocaleString()}원` : "-"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="text-sm text-gray-500">상태:</p>
                      <p className="mt-1">{getStatusBadge(selectedReservation.status)}</p>
                    </div>
                  </div>
                  
                  {selectedReservation.cancellation_reason && (
                    <div className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">취소 사유:</p>
                        <p className="font-medium">{selectedReservation.cancellation_reason}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">생성일:</p>
                  <p>{new Date(selectedReservation.created_at).toLocaleString()}</p>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setReservationDialogOpen(false)}
                  >
                    닫기
                  </Button>
                  {selectedReservation.user && (
                    <Button 
                      onClick={() => {
                        setReservationDialogOpen(false);
                        handleViewUserDetails(selectedReservation.user);
                      }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      고객 정보 보기
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationList;
