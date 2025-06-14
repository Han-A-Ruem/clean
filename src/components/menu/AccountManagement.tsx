
import React, { useState } from 'react';
import { ArrowLeft, Bell, LogOut, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '../Utils';

const AccountManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationStage, setDeleteConfirmationStage] = useState(0);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "로그아웃 되었습니다",
        description: "다음에 또 만나요!",
      });

      navigate("/sign-in");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.message,
      });
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      title: notificationsEnabled ? "알림이 비활성화되었습니다" : "알림이 활성화되었습니다",
      description: notificationsEnabled ? "더 이상 알림을 받지 않습니다." : "이제 알림을 받게 됩니다.",
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationStage < 3) {
      setDeleteConfirmationStage(deleteConfirmationStage + 1);
      return;
    }

    try {
      // Mark user as inactive in database first
      if (user?.id) {
        const { error: dbError } = await supabase
          .from('users')
          .update({ is_active: false })
          .eq('id', user.id);

        if (dbError) throw dbError;
      }

      // Then sign out the user
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "계정이 삭제되었습니다",
        description: "언제든지 다시 돌아오실 수 있습니다.",
      });

      setIsDeleteDialogOpen(false);
      setDeleteConfirmationStage(0);
      navigate("/sign-in");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "계정 삭제 중 오류가 발생했습니다",
        description: error.message,
      });
    }
  };

  const getDeleteDialogContent = () => {
    switch (deleteConfirmationStage) {
      case 0:
        return {
          title: "계정을 삭제하시겠습니까?",
          description: "계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.",
          confirmText: "계속하기"
        };
      case 1:
        return {
          title: "정말로 삭제하시겠습니까?",
          description: "이 작업은 되돌릴 수 없습니다.",
          confirmText: "네, 계속하겠습니다"
        };
      case 2:
        return {
          title: "마지막 확인",
          description: "계정을 삭제하면 모든 데이터와 활동 내역이 영구적으로 삭제됩니다. 이 작업은 취소할 수 없습니다.",
          confirmText: "계정 삭제"
        };
      case 3:
        return {
          title: "계정 삭제 성공",
          description: "계정이 성공적으로 삭제되었습니다. 언제든지 다시 돌아오실 수 있습니다.",
          confirmText: "확인"
        };
      default:
        return {
          title: "계정을 삭제하시겠습니까?",
          description: "계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.",
          confirmText: "계속하기"
        };
    }
  };

  const resetDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteConfirmationStage(0);
  };

  const dialogContent = getDeleteDialogContent();

  return (

    <div className="pb-20">
      <PageHeader title="계정 관리" />
      <div className="space-y-6 px-4 pt-4">
        {/* Notification Settings */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-3 text-gray-600" />
              <div>
                <h3 className="font-medium">알림 설정</h3>
                <p className="text-sm text-gray-500">알림을 활성화하거나 비활성화합니다</p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={toggleNotifications}
            />
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full py-6 flex items-center justify-start bg-white shadow"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3 text-gray-600" />
          <div className="text-left">
            <h3 className="font-medium">로그아웃</h3>
            <p className="text-sm text-gray-500">계정에서 로그아웃합니다</p>
          </div>
        </Button>

        {/* Account Deletion */}
        <Button
          variant="outline"
          className="w-full py-6 flex items-center justify-start bg-white shadow border-red-200"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <UserX className="h-5 w-5 mr-3 text-red-500" />
          <div className="text-left">
            <h3 className="font-medium text-red-500">계정 삭제</h3>
            <p className="text-sm text-gray-500">계정과 모든 데이터를 영구적으로 삭제합니다</p>
          </div>
        </Button>

        {/* Delete Account Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={resetDeleteDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{dialogContent.title}</DialogTitle>
              <DialogDescription>
                {dialogContent.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {deleteConfirmationStage < 3 && (
                <Button
                  variant="outline"
                  onClick={resetDeleteDialog}
                  className="w-full sm:w-auto"
                >
                  취소
                </Button>
              )}
              <Button
                variant={deleteConfirmationStage === 2 ? "destructive" : "default"}
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto"
              >
                {dialogContent.confirmText}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AccountManagement;
