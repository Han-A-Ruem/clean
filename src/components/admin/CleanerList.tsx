
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CleanerWithStats } from "@/types/admin";
import UserRankUpdateDialog from "./users/UserRankUpdateDialog";
import UserListControls from "./users/UserListControls";
import CleanerTable from "./cleaners/CleanerTable";
import UserPagination from "./users/UserPagination";
import { useCleanerData } from "@/hooks/useCleanerData";
import NotificationModal from "./cleaners/NotificationModal";
import { Bell, Download, FileText, File, Upload } from "lucide-react";
import { exportCleaners } from "@/utils/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CSVUploadDialog from "./shared/CSVUploadDialog";
import { saveCleanersToDatabase } from "@/utils/csvUtils";

const CleanerList = () => {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    sortField,
    sortOrder,
    handleSort,
    selectedCleaners,
    handleSelectCleaner,
    handleSelectAll,
    paginatedCleaners,
    totalPages,
    isLoading,
    error,
    refetch,
    filteredCleaners
  } = useCleanerData();

  const [rankUpdateDialogOpen, setRankUpdateDialogOpen] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState<CleanerWithStats | null>(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [csvUploadDialogOpen, setCsvUploadDialogOpen] = useState(false);

  const openRankUpdateDialog = (cleaner: CleanerWithStats) => {
    setSelectedCleaner(cleaner);
    setRankUpdateDialogOpen(true);
  };

  const handleBulkAction = () => {
    if (selectedCleaners.length === 0) {
      toast("선택된 청소 매니저가 없습니다.");
      return;
    }
    
    toast(`${selectedCleaners.length}명의 청소 매니저가 선택되었습니다.`);
    
    console.log("Selected cleaners for bulk action:", selectedCleaners);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const dataToExport = selectedCleaners.length > 0 
      ? filteredCleaners.filter(cleaner => selectedCleaners.includes(cleaner.id))
      : filteredCleaners;
      
    if (dataToExport.length === 0) {
      toast("내보낼 데이터가 없습니다.");
      return;
    }
    
    exportCleaners(dataToExport, format);
    toast.success(`${dataToExport.length}명의 청소 매니저 데이터를 ${format.toUpperCase()} 형식으로 내보냈습니다.`);
  };

  const handleSendNotification = () => {
    setNotificationModalOpen(true);
  };
  
  const handleBulkUpload = async (cleaners: CleanerWithStats[]) => {
    try {
      toast.info(`${cleaners.length}명의 청소 매니저 정보를 저장하는 중...`);
      const result = await saveCleanersToDatabase(cleaners);
      
      if (result.success > 0) {
        toast.success(`${result.success}명의 청소 매니저 정보가 성공적으로 저장되었습니다.`);
        refetch(); // Refresh the cleaner list
      }
      
      if (result.failed > 0) {
        toast.error(`${result.failed}명의 청소 매니저 정보 저장에 실패했습니다.`);
      }
    } catch (error) {
      toast.error(`청소 매니저 정보 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (error) {
    console.error("Error loading cleaners:", error);
    return <div className="text-red-500">청소 매니저 목록을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4 gap-2">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setCsvUploadDialogOpen(true)}
        >
          <Upload className="h-4 w-4" />
          CSV 업로드
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              내보내기
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <File className="h-4 w-4 mr-2" />
              CSV로 내보내기
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              PDF로 내보내기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          className="flex items-center gap-2"
          onClick={handleSendNotification}
        >
          <Bell className="h-4 w-4" />
          알림 전송
        </Button>
      </div>
      
      <UserListControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortFieldChange={(field) => handleSort(field)}
        onSortOrderChange={(order) => handleSort(sortField)}
        selectedUsersCount={selectedCleaners.length}
        onBulkAction={handleBulkAction}
        totalUsers={filteredCleaners.length}
      />

      <CleanerTable
        cleaners={paginatedCleaners}
        isLoading={isLoading}
        selectedCleaners={selectedCleaners}
        onSelectCleaner={handleSelectCleaner}
        onSelectAll={handleSelectAll}
        onRankUpdate={openRankUpdateDialog}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        searchTerm={searchTerm}
      />

      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <UserRankUpdateDialog
        open={rankUpdateDialogOpen}
        onOpenChange={setRankUpdateDialogOpen}
        user={selectedCleaner}
        onRankUpdated={refetch}
      />

      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        recipients={selectedCleaners.length > 0 ? selectedCleaners : filteredCleaners.map(cleaner => cleaner.id)}
      />
      
      <CSVUploadDialog
        open={csvUploadDialogOpen}
        onOpenChange={setCsvUploadDialogOpen}
        onUpload={handleBulkUpload}
        type="cleaner"
      />
    </div>
  );
};

export default CleanerList;
