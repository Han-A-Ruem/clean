
import React from 'react';
import { Input } from '@/components/ui/input';
import { UserCircle, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PersonalInfoProps {
  userInfo: {
    fullName: string;
    name: string;
    sex: string;
    nationality: string;
    phoneNumber: string;
    address: string;
  };
  isEditing: boolean;
  handleChange: (field: string, value: any) => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  userInfo,
  isEditing,
  handleChange,
}) => {
  const navigate = useNavigate();
  
  const handleAddressManagement = () => {
    navigate('/menu/address');
  };
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">개인 정보</h2>
        <Separator className="flex-1 ml-3" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <UserCircle className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>성함</label>
          </div>
          {isEditing ? (
            <Input
              value={userInfo.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="성함을 입력하세요"
              className="bg-gray-50"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.fullName || "정보 없음"}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <UserCircle className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>이름</label>
          </div>
          {isEditing ? (
            <Input
              value={userInfo.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
              className="bg-gray-50"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.name || "정보 없음"}
            </div>
          )}
        </div>

        {/* Sex */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <UserCircle className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>성별</label>
          </div>
          {isEditing ? (
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="sex"
                  value="male"
                  checked={userInfo.sex === 'male'}
                  onChange={() => handleChange('sex', 'male')}
                  className="mr-2"
                />
                <label htmlFor="male">남성</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female"
                  name="sex"
                  value="female"
                  checked={userInfo.sex === 'female'}
                  onChange={() => handleChange('sex', 'female')}
                  className="mr-2"
                />
                <label htmlFor="female">여성</label>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.sex === 'male' ? '남성' : 
               userInfo.sex === 'female' ? '여성' : 
               "정보 없음"}
            </div>
          )}
        </div>

        {/* Nationality */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>국적</label>
          </div>
          {isEditing ? (
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="korean"
                  name="nationality"
                  value="korean"
                  checked={userInfo.nationality === 'korean'}
                  onChange={() => handleChange('nationality', 'korean')}
                  className="mr-2"
                />
                <label htmlFor="korean">한국인</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="foreigner"
                  name="nationality"
                  value="foreigner"
                  checked={userInfo.nationality === 'foreigner'}
                  onChange={() => handleChange('nationality', 'foreigner')}
                  className="mr-2"
                />
                <label htmlFor="foreigner">외국인</label>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.nationality === 'korean' ? '한국인' : 
               userInfo.nationality === 'foreigner' ? '외국인' : 
               "정보 없음"}
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>전화번호</label>
          </div>
          {isEditing ? (
            <Input
              value={userInfo.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="전화번호를 입력하세요"
              className="bg-gray-50"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.phoneNumber || "정보 없음"}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>주소</label>
          </div>
          {isEditing ? (
            <div className='space-y-3'>
              <span className='text-gray-700'>{userInfo.address || "정보 없음"}</span>
              <Button 
                onClick={handleAddressManagement}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-6 border-dashed"
              >
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>주소 관리하기</span>
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.address || "정보 없음"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
