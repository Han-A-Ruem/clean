import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Edit, Save, MapPin } from 'lucide-react';
import { PageHeader } from '../Utils';
import { ProfileHeader } from './profile/ProfileHeader';
import { PersonalInfo } from './profile/PersonalInfo';
import { WorkExperience } from './profile/WorkExperience';
import { Preferences } from './profile/Preferences';
import { BankInfo } from './profile/BankInfo';
import TagsSelection from './profile/TagsSelection';
import TagsInfoDialog from './profile/TagsInfoDialog';

const MyInfo = () => {
  const navigate = useNavigate();
  const { userData, fetchUserData } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isTagsInfoOpen, setIsTagsInfoOpen] = useState(false);
  
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    name: '',
    sex: '',
    nationality: '',
    phoneNumber: '',
    bankName: '',
    bankAccount: '',
    address: '',
    workExperience1: '',
    workExperience2: '',
    preferredWorkRegions: [] as string[],
    preferredWorkingDays: [] as string[],
    preferredWorkingHours: [] as string[],
    profilePhoto: null as string | null,
    tags: [] as string[],
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData) {
      setUserInfo({
        fullName: userData.name || '',
        name: userData.name || '',
        sex: userData.sex || '',
        nationality: userData.nationality || '',
        phoneNumber: userData.phone || '',
        bankName: userData.bank_name || '',
        bankAccount: userData.bank_account ? String(userData.bank_account) : '',
        address: userData.address || '',
        workExperience1: userData.work_experience_1 || '',
        workExperience2: userData.work_experience_2 || '',
        preferredWorkRegions: userData.preferred_work_regions || [],
        preferredWorkingDays: userData.preferred_working_days || [],
        preferredWorkingHours: userData.preferred_working_hours || [],
        profilePhoto: userData.profile_photo || null,
        tags: userData.tags || [],
      });
    }
  }, [userData]);

  const handleSave = async () => {
    if (!userData?.user_id) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "사용자 정보를 찾을 수 없습니다.",
      });
      return;
    }

    try {
      let profilePhotoUrl = userInfo.profilePhoto;
      
      if (photoFile) {
        const fileName = `${userData.user_id}-profile-${Date.now()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(fileName, photoFile);
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('profiles')
          .getPublicUrl(fileName);
          
        profilePhotoUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: userInfo.fullName,
          sex: userInfo.sex,
          nationality: userInfo.nationality,
          phone_number: userInfo.phoneNumber ? Number(userInfo.phoneNumber) : null,
          bank_name: userInfo.bankName || null,
          bank_account: userInfo.bankAccount ? Number(userInfo.bankAccount) : null,
          work_experience_1: userInfo.workExperience1 || null,
          work_experience_2: userInfo.workExperience2 || null,
          preferred_work_regions: userInfo.preferredWorkRegions,
          preferred_working_days: userInfo.preferredWorkingDays,
          preferred_working_hours: userInfo.preferredWorkingHours,
          profile_photo: profilePhotoUrl,
          tags: userInfo.tags,
        })
        .eq('user_id', userData.user_id);

      if (error) throw error;
      
      toast({
        title: "정보 업데이트 완료",
        description: "내 정보가 성공적으로 업데이트되었습니다.",
      });
      
      fetchUserData(userData.user_id);
      setIsEditing(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.message,
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkRegionChange = (region: string) => {
    setUserInfo(prev => {
      const updatedRegions = prev.preferredWorkRegions.includes(region)
        ? prev.preferredWorkRegions.filter(r => r !== region)
        : [...prev.preferredWorkRegions, region];
      
      return {
        ...prev,
        preferredWorkRegions: updatedRegions,
      };
    });
  };

  const handleWorkingDayChange = (day: string) => {
    setUserInfo(prev => {
      const updatedDays = prev.preferredWorkingDays.includes(day)
        ? prev.preferredWorkingDays.filter(d => d !== day)
        : [...prev.preferredWorkingDays, day];
      
      return {
        ...prev,
        preferredWorkingDays: updatedDays,
      };
    });
  };

  const handleWorkingHourChange = (hour: string) => {
    setUserInfo(prev => {
      const updatedHours = prev.preferredWorkingHours.includes(hour)
        ? prev.preferredWorkingHours.filter(h => h !== hour)
        : [...prev.preferredWorkingHours, hour];
      
      return {
        ...prev,
        preferredWorkingHours: updatedHours,
      };
    });
  };

  const handleTagChange = (tags: string[]) => {
    setUserInfo(prev => ({
      ...prev,
      tags,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo(prev => ({
          ...prev,
          profilePhoto: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressManagement = () => {
    navigate('/menu/address');
  };

  return (
    <div className="pb-20 bg-[#F9F9F9]">
      <PageHeader title="프로필" rightElement={
        <Button 
          variant="outline" 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="rounded-full px-4"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              저장하기
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              수정하기
            </>
          )}
        </Button>
      }/>

      <div className="space-y-6 mt-4">
        <ProfileHeader 
          userInfo={userInfo}
          isEditing={isEditing}
          handlePhotoUpload={handlePhotoUpload}
        />

        <TagsSelection 
          userTags={userInfo.tags}
          isEditing={isEditing}
          handleTagChange={handleTagChange}
          openTagsInfo={() => setIsTagsInfoOpen(true)}
        />

        <PersonalInfo 
          userInfo={userInfo}
          isEditing={isEditing}
          handleChange={handleChange}
        />
        
        <WorkExperience 
          userInfo={userInfo}
          isEditing={isEditing}
          handleChange={handleChange}
        />
        
        <Preferences 
          userInfo={userInfo}
          isEditing={isEditing}
          handleWorkRegionChange={handleWorkRegionChange}
          handleWorkingDayChange={handleWorkingDayChange}
          handleWorkingHourChange={handleWorkingHourChange}
        />
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">주소 정보</h2>
          
          {isEditing ? (
            <Button 
              onClick={handleAddressManagement}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-6 border-dashed"
            >
              <MapPin className="h-5 w-5 text-gray-500" />
              <span>주소 관리하기</span>
            </Button>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{userInfo.address || "주소 정보가 없습니다"}</p>
            </div>
          )}
        </div>
        
        <BankInfo 
          userInfo={userInfo}
          isEditing={isEditing}
          handleChange={handleChange}
        />
      </div>

      <TagsInfoDialog 
        isOpen={isTagsInfoOpen}
        onClose={() => setIsTagsInfoOpen(false)}
      />
    </div>
  );
};

export default MyInfo;
