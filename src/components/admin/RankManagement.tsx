
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Rank } from '@/hooks/useRanks';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Table, TableHeader, TableBody, TableRow, 
  TableHead, TableCell
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { 
  Form, FormField, FormItem, 
  FormLabel, FormControl, FormMessage, 
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MoveUp, MoveDown, Plus, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const rankFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "이름을 입력해주세요"),
  label: z.string().min(1, "라벨을 입력해주세요"),
  hourly_wage: z.coerce.number().min(1, "시급을 입력해주세요"),
  color: z.string().min(1, "색상 코드를 입력해주세요"),
  bg_color: z.string().min(1, "배경 색상 코드를 입력해주세요"),
  icon_size: z.coerce.number().min(10, "아이콘 크기는 10 이상이어야 합니다"),
  order_index: z.coerce.number().min(1, "순서를 입력해주세요"),
  is_active: z.boolean().default(true),
});

type RankFormValues = z.infer<typeof rankFormSchema>;

const RankManagement = () => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRank, setCurrentRank] = useState<Rank | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userCountByRank, setUserCountByRank] = useState<Record<string, number>>({});

  const form = useForm<RankFormValues>({
    resolver: zodResolver(rankFormSchema),
    defaultValues: {
      name: '',
      label: '',
      hourly_wage: 0,
      color: 'text-gray-600',
      bg_color: 'bg-gray-50',
      icon_size: 30,
      order_index: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    fetchRanks();
    fetchUserCountsByRank();
  }, []);

  useEffect(() => {
    if (currentRank) {
      form.reset({
        id: currentRank.id,
        name: currentRank.name,
        label: currentRank.label,
        hourly_wage: currentRank.hourly_wage,
        color: currentRank.color,
        bg_color: currentRank.bg_color,
        icon_size: currentRank.icon_size,
        order_index: currentRank.order_index,
        is_active: currentRank.is_active,
      });
    } else {
      form.reset({
        name: '',
        label: '',
        hourly_wage: 0,
        color: 'text-gray-600',
        bg_color: 'bg-gray-50',
        icon_size: 30,
        order_index: ranks.length + 1,
        is_active: true,
      });
    }
  }, [currentRank, form, ranks.length]);

  const fetchUserCountsByRank = async () => {
    try {
      // Instead of using .group(), we'll count users for each rank individually
      const { data: uniqueRanks, error: ranksError } = await supabase
        .from('ranks')
        .select('id');
        
      if (ranksError) throw ranksError;
      
      const counts: Record<string, number> = {};
      
      // For each rank, count the users
      for (const rank of uniqueRanks || []) {
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'cleaner')
          .eq('rank_id', rank.id);
          
        if (error) throw error;
        counts[rank.id] = count || 0;
      }
      
      setUserCountByRank(counts);
    } catch (error) {
      console.error('Error fetching user counts by rank:', error);
    }
  };

  const fetchRanks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ranks')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      setRanks(data || []);
    } catch (error) {
      console.error('Error fetching ranks:', error);
      toast.error('랭크 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (rank: Rank) => {
    try {
      const { error } = await supabase
        .from('ranks')
        .update({ is_active: !rank.is_active })
        .eq('id', rank.id);
        
      if (error) throw error;
      
      setRanks(ranks.map(r => 
        r.id === rank.id ? { ...r, is_active: !r.is_active } : r
      ));
      toast.success(`${rank.name} 등급이 ${!rank.is_active ? '활성화' : '비활성화'} 되었습니다.`);
      
      // If deactivating a rank, users with this rank should be assigned a different active rank
      if (rank.is_active) {
        await handleReassignUsers(rank.id);
      }
    } catch (error) {
      console.error('Error updating rank active status:', error);
      toast.error('랭크 상태 변경에 실패했습니다.');
    }
  };

  const handleReassignUsers = async (deactivatedRankId: string) => {
    try {
      // Get the first active rank that's not the one being deactivated
      const fallbackRank = ranks.find(r => r.is_active && r.id !== deactivatedRankId);
      
      if (!fallbackRank) {
        // No fallback rank available, we should warn the admin
        toast.warning('주의: 모든 등급이 비활성화되었습니다. 최소한 하나 이상의 등급을 활성화하세요.');
        return;
      }
      
      // Update users with the deactivated rank to the fallback rank
      const { error } = await supabase
        .from('users')
        .update({ rank_id: fallbackRank.id })
        .eq('rank_id', deactivatedRankId);
        
      if (error) throw error;
      
      toast.info(`${fallbackRank.name} 등급으로 사용자가 재할당되었습니다.`);
      
      // Refresh user counts
      fetchUserCountsByRank();
    } catch (error) {
      console.error('Error reassigning users:', error);
      toast.error('사용자 재할당에 실패했습니다.');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    
    try {
      const rankToMove = ranks[index];
      const rankAbove = ranks[index - 1];
      
      // Swap order_index values
      const { error: error1 } = await supabase
        .from('ranks')
        .update({ order_index: rankAbove.order_index })
        .eq('id', rankToMove.id);
        
      const { error: error2 } = await supabase
        .from('ranks')
        .update({ order_index: rankToMove.order_index })
        .eq('id', rankAbove.id);
        
      if (error1 || error2) throw new Error('Failed to update rank order');
      
      // Update local state
      const updatedRanks = [...ranks];
      updatedRanks[index] = { ...rankAbove, order_index: rankToMove.order_index };
      updatedRanks[index - 1] = { ...rankToMove, order_index: rankAbove.order_index };
      
      // Re-sort the array
      updatedRanks.sort((a, b) => a.order_index - b.order_index);
      setRanks(updatedRanks);
      toast.success('랭크 순서가 변경되었습니다.');
    } catch (error) {
      console.error('Error moving rank:', error);
      toast.error('랭크 순서 변경에 실패했습니다.');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index >= ranks.length - 1) return;
    
    try {
      const rankToMove = ranks[index];
      const rankBelow = ranks[index + 1];
      
      // Swap order_index values
      const { error: error1 } = await supabase
        .from('ranks')
        .update({ order_index: rankBelow.order_index })
        .eq('id', rankToMove.id);
        
      const { error: error2 } = await supabase
        .from('ranks')
        .update({ order_index: rankToMove.order_index })
        .eq('id', rankBelow.id);
        
      if (error1 || error2) throw new Error('Failed to update rank order');
      
      // Update local state
      const updatedRanks = [...ranks];
      updatedRanks[index] = { ...rankBelow, order_index: rankToMove.order_index };
      updatedRanks[index + 1] = { ...rankToMove, order_index: rankBelow.order_index };
      
      // Re-sort the array
      updatedRanks.sort((a, b) => a.order_index - b.order_index);
      setRanks(updatedRanks);
      toast.success('랭크 순서가 변경되었습니다.');
    } catch (error) {
      console.error('Error moving rank:', error);
      toast.error('랭크 순서 변경에 실패했습니다.');
    }
  };

  const openEditDialog = (rank: Rank | null = null) => {
    setCurrentRank(rank);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (rank: Rank) => {
    setCurrentRank(rank);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveRank = async (values: RankFormValues) => {
    try {
      if (values.id) {
        // Update existing rank
        const { error } = await supabase
          .from('ranks')
          .update({
            name: values.name,
            label: values.label,
            hourly_wage: values.hourly_wage,
            color: values.color,
            bg_color: values.bg_color,
            icon_size: values.icon_size,
            order_index: values.order_index,
            is_active: values.is_active,
          })
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success(`${values.name} 등급이 수정되었습니다.`);
      } else {
        // Create new rank
        const { error } = await supabase
          .from('ranks')
          .insert([{
            name: values.name,
            label: values.label,
            hourly_wage: values.hourly_wage,
            color: values.color,
            bg_color: values.bg_color,
            icon_size: values.icon_size,
            order_index: values.order_index,
            is_active: values.is_active,
          }]);
          
        if (error) throw error;
        toast.success(`${values.name} 등급이 추가되었습니다.`);
      }
      
      setIsEditDialogOpen(false);
      fetchRanks();
    } catch (error) {
      console.error('Error saving rank:', error);
      toast.error('랭크 저장에 실패했습니다.');
    }
  };

  const handleDeleteRank = async () => {
    if (!currentRank) return;
    
    try {
      // Check if the rank has users assigned
      const userCount = userCountByRank[currentRank.id] || 0;
      
      if (userCount > 0) {
        // Get a fallback rank
        const fallbackRank = ranks.find(r => r.id !== currentRank.id && r.is_active);
        
        if (!fallbackRank) {
          toast.error('다른 활성화된 등급이 없어 삭제할 수 없습니다. 먼저 다른 등급을 추가하세요.');
          return;
        }
        
        // Reassign users before deleting
        const { error: reassignError } = await supabase
          .from('users')
          .update({ rank_id: fallbackRank.id })
          .eq('rank_id', currentRank.id);
          
        if (reassignError) throw reassignError;
      }
      
      // Now delete the rank
      const { error } = await supabase
        .from('ranks')
        .delete()
        .eq('id', currentRank.id);
        
      if (error) throw error;
      
      setRanks(ranks.filter(r => r.id !== currentRank.id));
      toast.success(`${currentRank.name} 등급이 삭제되었습니다.`);
      setIsDeleteDialogOpen(false);
      setCurrentRank(null);
      
      // Update user count
      fetchUserCountsByRank();
    } catch (error) {
      console.error('Error deleting rank:', error);
      toast.error('랭크 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">등급 관리</h2>
        <Button onClick={() => openEditDialog()} variant="default">
          <Plus className="h-4 w-4 mr-2" />
          새 등급 추가
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <p>로딩 중...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>순서</TableHead>
              <TableHead>등급</TableHead>
              <TableHead>라벨</TableHead>
              <TableHead>시급</TableHead>
              <TableHead className="text-center">사용자</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranks.map((rank, index) => (
              <TableRow key={rank.id}>
                <TableCell className="font-medium">{rank.order_index}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className={`${rank.bg_color} h-8 w-8`}>
                      <AvatarFallback className={rank.color}>
                        {rank.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{rank.name}</span>
                  </div>
                </TableCell>
                <TableCell>{rank.label}</TableCell>
                <TableCell>{rank.hourly_wage.toLocaleString()} KRW</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{userCountByRank[rank.id] || 0}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={rank.is_active}
                    onCheckedChange={() => handleToggleActive(rank)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {/* <Button variant="outline" size="icon" onClick={() => handleMoveUp(index)}>
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleMoveDown(index)}>
                      <MoveDown className="h-4 w-4" />
                    </Button> */}
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(rank)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openDeleteDialog(rank)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit Rank Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentRank ? `${currentRank.name} 등급 수정` : '새 등급 추가'}
            </DialogTitle>
            <DialogDescription>
              등급 정보를 입력해주세요. 저장 버튼을 클릭하면 변경사항이 저장됩니다.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveRank)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>등급 이름</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="등급 이름을 입력해주세요" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>라벨</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="라벨을 입력해주세요" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hourly_wage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시급 (KRW)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0"  placeholder="시급을 입력해주세요" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>텍스트 색상</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="예: text-purple-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bg_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>배경 색상</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="예: bg-purple-50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="icon_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>아이콘 크기</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="10" max="100" placeholder="아이콘 크기" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>순서</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" placeholder="순서" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>활성화 상태</FormLabel>
                      <FormDescription>
                        이 등급을 활성화할지 여부를 설정합니다.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>등급 삭제</DialogTitle>
            <DialogDescription>
              {currentRank?.name} 등급을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              {userCountByRank[currentRank?.id || ''] > 0 && (
                <p className="mt-2 text-amber-600">
                  주의: 이 등급에 속한 {userCountByRank[currentRank?.id || '']}명의 사용자가 있습니다. 
                  삭제 시 다른 활성화된 등급으로 자동 이동됩니다.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteRank}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RankManagement;
