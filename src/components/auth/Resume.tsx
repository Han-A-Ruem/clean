import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload, UserCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Resume = () => {
    // Personal information states
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [fullName, setFullName] = useState('');
    const [sex, setSex] = useState('');
    const [nationality, setNationality] = useState('');
    const [workExperience, setWorkExperience] = useState('');
    const [preferredLocation, setPreferredLocation] = useState('');
    
    // Available work days state (Monday to Sunday)
    const [workDays, setWorkDays] = useState<string[]>([]);
    
    // Available work hours state (8am to 4pm)
    const [workHours, setWorkHours] = useState<string[]>([]);

    // File upload states
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    // Handle checkbox change for work days
    const handleDayChange = (day: string) => {
        setWorkDays(prev => 
            prev.includes(day) 
                ? prev.filter(d => d !== day) 
                : [...prev, day]
        );
    };

    // Handle checkbox change for work hours
    const handleHourChange = (hour: string) => {
        setWorkHours(prev => 
            prev.includes(hour) 
                ? prev.filter(h => h !== hour) 
                : [...prev, hour]
        );
    };

    // Handle photo upload
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setPhoto(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setPhotoPreview(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle resume file upload
    const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setResumeFile(event.target.files[0]);
        }
    };

    // Handle form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        navigate('/interview-schedule'); // Redirect to home page after submission
        
        // // Create form data for submission
        // const formData = new FormData();
        // formData.append('name', name);
        // formData.append('fullName', fullName);
        // formData.append('sex', sex);
        // formData.append('nationality', nationality);
        // formData.append('workExperience', workExperience);
        // formData.append('preferredLocation', preferredLocation);
        // formData.append('workDays', JSON.stringify(workDays));
        // formData.append('workHours', JSON.stringify(workHours));
        
        // if (photo) {
        //     formData.append('photo', photo);
        // }
        
        // if (resumeFile) {
        //     formData.append('resumeFile', resumeFile);
        // }
        
        // // TODO: Add API submission logic here
        // console.log("Form data ready for submission:", {
        //     name,
        //     fullName,
        //     sex,
        //     nationality,
        //     workExperience,
        //     preferredLocation,
        //     workDays,
        //     workHours,
        //     photo: photo?.name,
        //     resumeFile: resumeFile?.name
        // });
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">이력서 제출</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">

                 {/* File Upload Card */}
                 <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-4">파일 업로드</h2>
                        
                        <div className="space-y-6">
                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <Label className="text-base font-medium">사진 업로드</Label>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                                            {photoPreview ? (
                                                <img 
                                                    src={photoPreview} 
                                                    alt="Profile Preview" 
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <UserCircle className="h-12 w-12 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={handlePhotoUpload}
                                            />
                                            <Button 
                                                type="button"
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                사진 선택
                                            </Button>
                                        </div>
                                        {photo && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {photo.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Resume Upload */}
                            <div className="space-y-2">
                                <Label className="text-base font-medium">이력서 파일 업로드</Label>
                                <div className="relative">
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={handleResumeUpload}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        이력서 선택 (.pdf, .doc, .docx)
                                    </Button>
                                </div>
                                {resumeFile && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {resumeFile.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Personal Information Card */}
                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-4">개인 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">이름</Label>
                                <Input 
                                    id="name" 
                                    placeholder="이름을 입력하세요" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="fullName">전체 이름</Label>
                                <Input 
                                    id="fullName" 
                                    placeholder="전체 이름을 입력하세요" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="sex">성별</Label>
                                <Select value={sex} onValueChange={setSex} required>
                                    <SelectTrigger id="sex">
                                        <SelectValue placeholder="성별을 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectItem value="male">남성</SelectItem>
                                        <SelectItem value="female">여성</SelectItem>
                                        <SelectItem value="other">기타</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="nationality">국적</Label>
                                <Input 
                                    id="nationality" 
                                    placeholder="국적을 입력하세요" 
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Work Experience Card */}
                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-4">경력 정보</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="workExperience">경력 사항</Label>
                                <Input 
                                    id="workExperience" 
                                    placeholder="경력 사항을 입력하세요" 
                                    value={workExperience}
                                    onChange={(e) => setWorkExperience(e.target.value)}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="preferredLocation">선호 지역</Label>
                                <Select value={preferredLocation} onValueChange={setPreferredLocation} required>
                                    <SelectTrigger id="preferredLocation">
                                        <SelectValue placeholder="선호 지역을 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectItem value="seoul">서울</SelectItem>
                                        <SelectItem value="incheon">인천</SelectItem>
                                        <SelectItem value="gyeongi">경기</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Availability Card */}
                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-4">근무 가능 시간</h2>
                        
                        <div className="space-y-4">
                            {/* Available Work Days */}
                            <div>
                                <Label className="text-base font-medium mb-2 block">근무 가능 요일</Label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'monday', label: '월' },
                                        { id: 'tuesday', label: '화' },
                                        { id: 'wednesday', label: '수' },
                                        { id: 'thursday', label: '목' },
                                        { id: 'friday', label: '금' },
                                        { id: 'saturday', label: '토' },
                                        { id: 'sunday', label: '일' },
                                    ].map((day) => (
                                        <Button
                                            key={day.id}
                                            type="button" // Prevent form submission
                                            variant={workDays.includes(day.id) ? "default" : "outline"}
                                            size="sm"
                                            className="rounded-full"
                                            onClick={() => handleDayChange(day.id)}
                                        >
                                            {day.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Available Work Hours */}
                            <div>
                                <Label className="text-base font-medium mb-2 block">근무 가능 시간</Label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: '8', label: '8시' }, { id: '9', label: '9시' }, { id: '10', label: '10시' },
                                        { id: '11', label: '11시' }, { id: '12', label: '12시' }, { id: '13', label: '13시' },
                                        { id: '14', label: '14시' }, { id: '15', label: '15시' }, { id: '16', label: '16시' },
                                        // Add more hours if needed, adjust labels as preferred (e.g., "8:00 AM")
                                    ].map((hour) => (
                                        <Button
                                            key={hour.id}
                                            type="button" // Prevent form submission
                                            variant={workHours.includes(hour.id) ? "default" : "outline"}
                                            size="sm"
                                            className="rounded-full"
                                            onClick={() => handleHourChange(hour.id)}
                                        >
                                            {hour.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
               
                <div className="flex justify-end">
                    <Button type="submit" className="bg-primary-user hover:bg-primary-user/90">
                        제출하기
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Resume;