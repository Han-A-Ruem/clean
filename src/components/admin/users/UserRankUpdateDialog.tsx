
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Rank } from '@/hooks/useRanks';
import { UserWithReservations } from '@/types/admin';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Plum from '@/components/menu/icons/Plum';
import Forsythia from '@/components/menu/icons/Forsythia';
import Cosmos from '@/components/menu/icons/Cosmos';
import Camellia from '@/components/menu/icons/Camellia';
import Rose from '@/components/menu/icons/Rose';
import Sunflower from '@/components/menu/icons/Sunflower';

interface UserRankUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithReservations | null;
  onRankUpdated: () => void;
}

const UserRankUpdateDialog = ({
  open,
  onOpenChange,
  user,
  onRankUpdated
}: UserRankUpdateDialogProps) => {
  const [selectedRankId, setSelectedRankId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all active ranks
  const { data: ranks, isLoading: ranksLoading } = useQuery({
    queryKey: ['ranks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ranks')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      return data as Rank[];
    },
  });

  // Set selected rank to user's current rank when dialog opens
  useEffect(() => {
    if (open && user?.rank_id) {
      setSelectedRankId(user.rank_id);
    } else if (open) {
      setSelectedRankId('');
    }
  }, [open, user]);

  const handleUpdateRank = async () => {
    if (!user || !selectedRankId) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('users')
        .update({ rank_id: selectedRankId })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast('사용자 등급이 성공적으로 업데이트되었습니다.');
      onRankUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user rank:', error);
      toast('사용자 등급 업데이트에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get rank icon component based on rank name
  const getRankIcon = (rankName: string | undefined | null) => {
    if (!rankName) return null;
    
    switch (rankName.toLowerCase()) {
      case 'plum':
        return <Plum />;
      case 'forsythia':
        return <Forsythia />;
      case 'cosmos':
        return <Cosmos />;
      case 'camellia':
        return <Camellia />;
      case 'rose':
        return <Rose />;
      case 'sunflower':
        return <Sunflower />;
      default:
        return (
          <Avatar className={`${user?.rank_bg_color || 'bg-gray-100'} h-8 w-8`}>
            <AvatarFallback className={user?.rank_color || 'text-gray-600'}>
              {rankName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>사용자 등급 변경</DialogTitle>
          <DialogDescription>
            {user?.name || '선택된 사용자'}의 등급을 변경합니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Current rank display */}
          {user?.rank_name && (
            <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-500">현재 등급</span>
              <div className="flex items-center space-x-3">
                {getRankIcon(user.rank_name)}
                <div>
                  <h3 className="font-bold">{user.rank_name}</h3>
                  <p className="text-sm text-gray-500">{user.type === 'cleaner' ? '청소 매니저' : '고객'}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Rank selection */}
          <div className="space-y-2">
            <label htmlFor="rank-select" className="text-sm font-medium">
              새 등급 선택
            </label>
            <Select 
              value={selectedRankId} 
              onValueChange={setSelectedRankId}
              disabled={ranksLoading}
            >
              <SelectTrigger id="rank-select" className="w-full">
                <SelectValue placeholder="등급 선택..." />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {ranks?.map((rank) => (
                  <SelectItem key={rank.id} value={rank.id}>
                    <div className="flex items-center space-x-2">
                      {/* Special icons for recognized rank names */}
                      {rank.name.toLowerCase() === 'plum' ? (
                        <div className="h-5 w-5 mr-2">
                          <Plum />
                        </div>
                      ) : rank.name.toLowerCase() === 'forsythia' ? (
                        <div className="h-5 w-5 mr-2">
                          <Forsythia />
                        </div>
                      ) : rank.name.toLowerCase() === 'cosmos' ? (
                        <div className="h-5 w-5 mr-2">
                          <Cosmos />
                        </div>
                      ) : rank.name.toLowerCase() === 'camellia' ? (
                        <div className="h-5 w-5 mr-2">
                          <Camellia />
                        </div>
                      ) : rank.name.toLowerCase() === 'rose' ? (
                        <div className="h-5 w-5 mr-2">
                          <Rose />
                        </div>
                      ) : rank.name.toLowerCase() === 'sunflower' ? (
                        <div className="h-5 w-5 mr-2">
                          <Sunflower />
                        </div>
                      ) : (
                        <Avatar className={`${rank.bg_color} h-5 w-5 mr-2`}>
                          <AvatarFallback className={rank.color}>
                            {rank.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span>{rank.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button 
            onClick={handleUpdateRank} 
            disabled={!selectedRankId || selectedRankId === user?.rank_id || isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRankUpdateDialog;
