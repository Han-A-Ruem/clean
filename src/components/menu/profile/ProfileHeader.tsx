
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Copy, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileHeaderProps {
  userInfo: {
    fullName: string;
    phoneNumber: string;
    address: string;
    profilePhoto: string | null;
  };
  isEditing: boolean;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userInfo,
  isEditing,
  handlePhotoUpload,
}) => {
  const { userData } = useUser();
  const { toast } = useToast();

  const getInitials = () => {
    return userInfo.fullName ? userInfo.fullName.charAt(0).toUpperCase() : 'U';
  };

  const copyToClipboard = () => {
    const referalCode = userData?.referal_code || '';
    navigator.clipboard.writeText(referalCode);
    toast({
      title: "복사 완료!",
      description: "추천인 코드가 클립보드에 복사되었습니다.",
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-2 border-white shadow-md">
            {userInfo.profilePhoto ? (
              <AvatarImage src={userInfo.profilePhoto} alt="프로필 사진" />
            ) : (
              <AvatarFallback className="bg-primary-user/10 text-primary-user text-2xl">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          {isEditing && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <label className="cursor-pointer">
                <div className="flex items-center justify-center gap-1 text-xs text-white  w-[100px] bg-primary-user  px-2 py-1 rounded-full shadow-sm">
                  <Upload className="w-5 h-5" />
                  <span>업로드</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </label>
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">
            {userInfo.fullName || "이름을 추가하세요"}
          </h1>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mt-2 text-gray-600">
            {userInfo.phoneNumber && (
              <div className="flex items-center gap-1 text-sm">
                <span className="w-4 h-4 text-gray-400">📱</span>
                <span>{userInfo.phoneNumber}</span>
              </div>
            )}
            
            {userData?.email && (
              <div className="flex items-center gap-1 text-sm">
                <span className="w-4 h-4 text-gray-400">✉️</span>
                <span>{userData.email}</span>
              </div>
            )}
            
            {userInfo.address && (
              <div className="flex items-center gap-1 text-sm">
                <span className="w-4 h-4 text-gray-400">📍</span>
                <span>{userInfo.address}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
              <span className="font-medium">추천인 코드:</span>
              <code className="bg-white px-2 py-0.5 rounded text-xs font-mono">
                {userData?.referal_code || "REF-" + userData?.user_id?.substring(0, 8).toUpperCase() || ""}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={copyToClipboard}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
