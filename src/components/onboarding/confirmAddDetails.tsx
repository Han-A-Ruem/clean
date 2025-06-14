import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/Utils";
import { useCleanerRegistration } from "@/contexts/CleanerRegistrationContext";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUser } from "@/contexts/UserContext";
import { changeUserStatus, updateUser } from "@/model/User";

// Define the type for the data keys we allow editing
type EditableDataKeys = 'sex' | 'nationality' | 'birthYear' | 'canWorkWithPets';

/**
 * Component for displaying and confirming user details during onboarding, with inline editing.
 */
const ConfirmAddDetails: React.FC = () => {
    const navigate = useNavigate();
    const { data, setData: updateData } = useCleanerRegistration();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<{ key: EditableDataKeys | null; label: string }>({ key: null, label: '' });
    const [currentValue, setCurrentValue] = useState<string | number | boolean | undefined>('');

    const {user} = useUser();
    // Function to handle navigation to next step
    const handleContinue = () => {
        console.log(data);
        updateUser({data: {
           name: data.name,
           phone_number: data.phone,
           sex: data.sex,
           preferred_work_regions: [data.workingArea],
           heard_about_us: data.hearAboutUs,
           nationality: data.nationality,
           birth_year: data.birthYear,
           address: data.address.id,
           can_work_with_pets: data.canWorkWithPets,
        }, id: user?.id});

        changeUserStatus("interview_info_entered", user?.id);
        navigate("/onboarding/onboarding-complete");
    };

    // Function to handle address change
    const handleAddressChange = () => {
        navigate("/onboarding/address");
    };

    // Helper to get pet preference text
    const getPetPreferenceText = (canWorkWithPets: boolean | undefined): string => {
        if (canWorkWithPets === undefined) return "-";
        return canWorkWithPets ? "일 가능해요" : "불 가능해요";
    };

    // --- Modal Logic ---
    const handleOpenModal = (key: EditableDataKeys, label: string) => {
        setEditingField({ key, label });
        // Set initial value based on key
        setCurrentValue(data[key] ?? ''); // Use current data value or empty string
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingField.key) {
            let finalValue: any = currentValue;

            // Type conversion based on the field key
            if (editingField.key === 'birthYear') {
                finalValue = currentValue === '' ? undefined : parseInt(String(currentValue), 10);
                if (isNaN(finalValue)) finalValue = undefined; // Handle non-numeric input gracefully
            } else if (editingField.key === 'canWorkWithPets') {
                // Convert string representation back to boolean
                finalValue = currentValue === 'true' ? true : currentValue === 'false' ? false : undefined;
            } else if (editingField.key === 'nationality') {
                 finalValue = currentValue === '' ? undefined : String(currentValue);
            }
             else if (editingField.key === 'sex') {
                 finalValue = currentValue === 'male' || currentValue === 'female' ? currentValue : undefined;
             }

            updateData({ ...data, [editingField.key]: finalValue });
        }
        setIsModalOpen(false);
        setEditingField({ key: null, label: '' });
    };

    const renderInput = () => {
        if (!editingField.key) return null;

        switch (editingField.key) {
            case 'sex':
                return (
                    <Select
                        value={currentValue === 'male' || currentValue === 'female' ? currentValue : undefined}
                        onValueChange={(value) => setCurrentValue(value)}
                    >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="male">남성</SelectItem>
                            <SelectItem value="female">여성</SelectItem>
                        </SelectContent>
                    </Select>
                );
            case 'nationality':
                return (
                    <Input
                        id="edit-value"
                        value={String(currentValue)}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        className="col-span-3"
                        placeholder="예: 대한민국"
                    />
                );
            case 'birthYear':
                return (
                    <Input
                        id="edit-value"
                        type="number"
                        value={String(currentValue)}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        className="col-span-3"
                        placeholder="예: 1995"
                    />
                );
            case 'canWorkWithPets':
                 // Represent boolean as string for Select value
                 const petValue = currentValue === true ? 'true' : currentValue === false ? 'false' : undefined;
                return (
                    <Select
                        value={petValue}
                         onValueChange={(value) => setCurrentValue(value === 'true' ? true : value === 'false' ? false : undefined)}
                    >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="true">일 가능해요</SelectItem>
                            <SelectItem value="false">불 가능해요</SelectItem>
                        </SelectContent>
                    </Select>
                );
            default:
                return null;
        }
    };
    // --- End Modal Logic ---

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <div className="min-h-screen bg-gray-50/80 flex flex-col">
                <PageHeader
                    title="추가 정보를 입력하고 바로 활동해보세요"
                    className="backdrop-blur-lg bg-white/70 border-b border-white/30"
                />

                <div className="flex-1 flex flex-col p-4 space-y-6">
                    {/* Introduction text */}
                    <div className="mt-2">
                        <h2 className="text-xl font-semibold text-center">
                            추가 정보를 입력하고 바로 활동해보세요
                        </h2>
                    </div>

                    {/* Action button - Connect to platform */}
                    <Button
                        variant="outline"
                        className="bg-blue-50 text-blue-600 border border-blue-200"
                        onClick={() => {/* Platform connection logic would go here */ }}
                    >
                        나중에 입력하기
                    </Button>

                    {/* Basic Information Card - Now Editable */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            기본 정보 (클릭하여 수정)
                        </h3>

                        <Card className="bg-white p-4 space-y-2">
                            {/* Sex Information */}
                             <DialogTrigger asChild>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors duration-150" onClick={() => handleOpenModal('sex', '성별')}>
                                    <span className="text-sm text-gray-500">
                                        성별
                                    </span>
                                    <span className="font-medium">
                                        {data.sex === "female"
                                            ? "여성"
                                            : data.sex === "male"
                                                ? "남성"
                                                : "-"}
                                    </span>
                                </div>
                             </DialogTrigger>

                            {/* Nationality Information */}
                             <DialogTrigger asChild>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors duration-150" onClick={() => handleOpenModal('nationality', '국적')}>
                                    <span className="text-sm text-gray-500">
                                        국적
                                    </span>
                                    <span className="font-medium">
                                        {data.nationality || "-"} {/* Display '-' if empty */}
                                    </span>
                                </div>
                            </DialogTrigger>

                            {/* Birth Year Information */}
                             <DialogTrigger asChild>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors duration-150" onClick={() => handleOpenModal('birthYear', '출생년도')}>
                                    <span className="text-sm text-gray-500">
                                        출생년도
                                    </span>
                                    <span className="font-medium">
                                        {data.birthYear ? `${data.birthYear}년` : "-"}
                                    </span>
                                </div>
                             </DialogTrigger>

                            {/* Pet Information */}
                             <DialogTrigger asChild>
                                <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors duration-150" onClick={() => handleOpenModal('canWorkWithPets', '애완동물 유무')}>
                                    <span className="text-sm text-gray-500">
                                        애완동물 유무
                                    </span>
                                    <span className="font-medium">
                                        {getPetPreferenceText(data.canWorkWithPets)}
                                    </span>
                                </div>
                            </DialogTrigger>
                        </Card>
                    </div>

                    {/* Address Information Card (Remains the same) */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            내 주소
                        </h3>
                        <Card className="bg-white p-4">
                            {data.address ? (
                                <div className="space-y-2">
                                    <div className="flex items-start">
                                        <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                        <div>
                                            <p className="font-medium">{data.address.address}</p>
                                            <p className="text-sm text-gray-500">{data.addressDetail}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-3 border-dashed border-gray-300"
                                        onClick={handleAddressChange}
                                    >
                                        주소 변경하기
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed border-gray-300"
                                    onClick={handleAddressChange}
                                >
                                    주소 입력하기
                                </Button>
                            )}
                        </Card>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* Continue Button */}
                    <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 -mx-4">
                        <Button
                            className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90"
                            onClick={handleContinue}
                        >
                            계속하기
                        </Button>
                    </div>
                </div>
            </div>

             {/* --- Modal Content --- */}
             <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>'{editingField.label}' 수정</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-row items-center gap-4">
                        {/* <Label htmlFor="edit-value" className="text-right">
                            값
                        </Label> */}
                        {/* Render appropriate input based on editingField.key */}
                        {renderInput()}
                    </div>
                </div>
                <DialogFooter className="flex flex-row justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>취소</Button>
                    <Button type="button" onClick={handleSave}>저장</Button>
                </DialogFooter>
            </DialogContent>
             {/* --- End Modal Content --- */}
        </Dialog>
    );
};

export default ConfirmAddDetails;