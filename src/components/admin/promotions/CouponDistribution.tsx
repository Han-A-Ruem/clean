import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserWithReservations } from "@/types/admin";
import { Coupon } from "@/types/coupon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, RefreshCw, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/hooks/useNotification";

const CouponDistribution = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserWithReservations[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDistributing, setIsDistributing] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [distributionType, setDistributionType] = useState<"selected" | "all">("selected");
  const { createNotification } = useNotification();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, name, type, status, created_at');

      if (usersError) throw usersError;

      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (couponsError) throw couponsError;

      setUsers(usersData as UserWithReservations[] || []);
      
      setCoupons((couponsData || []).map(coupon => ({
        ...coupon,
        discount_type: coupon.discount_type as "fixed" | "percentage"
      })));
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const distributeCoupons = async () => {
    if (!selectedCouponId) {
      toast.error("쿠폰을 선택해주세요.");
      return;
    }

    const targetUserIds = distributionType === "all" 
      ? users.map(user => user.id) 
      : selectedUsers;

    if (distributionType === "selected" && targetUserIds.length === 0) {
      toast.error("쿠폰을 지급할 사용자를 선택해주세요.");
      return;
    }

    setIsDistributing(true);
    
    try {
      const { data: couponData, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', selectedCouponId)
        .single();
        
      if (couponError) throw couponError;
      
      const { data: existingCoupons, error: checkError } = await supabase
        .from('user_coupons')
        .select('user_id, coupon_id')
        .eq('coupon_id', selectedCouponId)
        .in('user_id', targetUserIds);

      if (checkError) throw checkError;

      const existingUserIds = new Set(existingCoupons?.map(item => item.user_id) || []);
      const newUserIds = targetUserIds.filter(id => !existingUserIds.has(id));

      if (newUserIds.length === 0) {
        toast.info("선택된 모든 사용자가 이미 이 쿠폰을 보유하고 있습니다.");
        setConfirmDialogOpen(false);
        return;
      }

      const couponInserts = newUserIds.map(userId => ({
        user_id: userId,
        coupon_id: selectedCouponId,
        is_used: false
      }));

      const { error: insertError } = await supabase
        .from('user_coupons')
        .insert(couponInserts);

      if (insertError) throw insertError;

      for (const userId of newUserIds) {
        await createNotification({
          userId,
          title: "새로운 쿠폰이 지급되었습니다",
          message: `${couponData.description} (${couponData.code}) 쿠폰이 발급되었습니다. 마이페이지 > 쿠폰에서 확인하세요.`,
          type: "promotion"
        });
      }

      toast.success(`${newUserIds.length}명의 사용자에게 쿠폰이 성공적으로 배포되었습니다.`);
      setSelectedUsers([]);
    } catch (error: any) {
      console.error('Error distributing coupons:', error);
      toast.error('쿠폰 배포 중 오류가 발생했습니다.');
    } finally {
      setIsDistributing(false);
      setConfirmDialogOpen(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>쿠폰 배포</CardTitle>
          <CardDescription>
            사용자들에게 쿠폰을 배포합니다. 모든 사용자에게 배포하거나 개별 사용자를 선택할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">배포할 쿠폰 선택</label>
              <Select value={selectedCouponId} onValueChange={setSelectedCouponId}>
                <SelectTrigger>
                  <SelectValue placeholder="쿠폰을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {coupons.length > 0 ? (
                    coupons.map(coupon => (
                      <SelectItem key={coupon.id} value={coupon.id}>
                        {coupon.code} - {coupon.description}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      활성화된 쿠폰이 없습니다
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">배포 방식</label>
              <Select 
                value={distributionType} 
                onValueChange={(value: "selected" | "all") => setDistributionType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="배포 방식 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="selected">선택한 사용자에게 배포</SelectItem>
                  <SelectItem value="all">모든 사용자에게 배포</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {distributionType === "selected" && (
            <>
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="이름 또는 이메일로 검색"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" onClick={fetchData} title="새로고침">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>가입일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                          <p className="mt-2 text-sm text-muted-foreground">사용자 목록을 불러오는 중...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell onClick={() => handleSelectUser(user.id)}>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleSelectUser(user.id)}
                              aria-label={`Select ${user.name}`}
                            />
                          </TableCell>
                          <TableCell onClick={() => handleSelectUser(user.id)}>
                            {user.name || '이름 없음'}
                          </TableCell>
                          <TableCell onClick={() => handleSelectUser(user.id)}>
                            {user.email || '이메일 없음'}
                          </TableCell>
                          <TableCell onClick={() => handleSelectUser(user.id)}>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10">
                          <p className="text-muted-foreground">
                            {searchQuery 
                              ? "검색 결과가 없습니다" 
                              : "등록된 사용자가 없습니다"}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {selectedUsers.length > 0 
                  ? `${selectedUsers.length}명의 사용자가 선택됨` 
                  : "사용자를 선택해주세요"}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
          
          <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                disabled={
                  isLoading || 
                  isDistributing || 
                  !selectedCouponId || 
                  (distributionType === "selected" && selectedUsers.length === 0)
                }
              >
                {isDistributing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    {distributionType === "all" 
                      ? "모든 사용자에게 쿠폰 배포" 
                      : "선택한 사용자에게 쿠폰 배포"}
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>쿠폰 배포 확인</AlertDialogTitle>
                <AlertDialogDescription>
                  {distributionType === "all"
                    ? `정말로 모든 사용자 (${users.length}명)에게 쿠폰을 배포하시겠습니까?`
                    : `선택한 ${selectedUsers.length}명의 사용자에게 쿠폰을 배포하시겠습니까?`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={distributeCoupons}>
                  확인
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CouponDistribution;
