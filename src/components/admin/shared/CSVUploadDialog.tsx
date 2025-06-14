
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileUp, FileDown, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserWithReservations, CleanerWithStats } from "@/types/admin";
import { downloadCSVTemplate, generateUserCSVTemplate, generateCleanerCSVTemplate } from "@/utils/csvUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (data: UserWithReservations[] | CleanerWithStats[]) => void;
  type: 'user' | 'cleaner';
}

const CSVUploadDialog = ({ open, onOpenChange, onUpload, type }: CSVUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [validData, setValidData] = useState<UserWithReservations[] | CleanerWithStats[]>([]);
  const [invalidData, setInvalidData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("upload");
  
  const handleTemplateDownload = () => {
    const templateContent = type === 'user' ? generateUserCSVTemplate() : generateCleanerCSVTemplate();
    const fileName = type === 'user' ? 'user_template.csv' : 'cleaner_template.csv';
    downloadCSVTemplate(fileName, templateContent);
    toast.success(`Template ${fileName} downloaded`);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
    }
  };
  
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(droppedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const resetState = () => {
    setFile(null);
    setValidData([]);
    setInvalidData([]);
    setTab("upload");
  };
  
  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };
  
  const handleParse = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const parser = type === 'user' 
        ? (await import("@/utils/csvUtils")).parseUserCSV 
        : (await import("@/utils/csvUtils")).parseCleanerCSV;
      
      const result = await parser(file);
      setValidData(result.valid);
      setInvalidData(result.invalid);
      
      if (result.valid.length > 0) {
        setTab("preview");
        toast.success(`Parsed ${result.valid.length} valid entries`);
      } else {
        toast.error("No valid entries found in CSV file");
      }
      
      if (result.invalid.length > 0) {
        toast.error(`Found ${result.invalid.length} invalid entries`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpload = () => {
    if (validData.length === 0) {
      toast.error("No valid data to upload");
      return;
    }
    
    onUpload(validData);
    handleClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload {type === 'user' ? 'Users' : 'Cleaners'} from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add multiple {type === 'user' ? 'users' : 'cleaners'} at once.
            Make sure your CSV file has the required headers.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload CSV</TabsTrigger>
            <TabsTrigger value="preview" disabled={validData.length === 0}>Preview Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="py-4">
            <div className="flex flex-col gap-4">
              <div 
                className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
              >
                {!file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileUp className="h-10 w-10 text-gray-400" />
                    <p>Drag and drop a CSV file here, or click to browse</p>
                    <Button variant="outline" onClick={() => document.getElementById('csvFile')?.click()}>
                      Select File
                    </Button>
                    <input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-md p-2 px-4">
                      <FileUp className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-800">{file.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => setFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="default" onClick={handleParse} disabled={loading}>
                      {loading ? "Parsing..." : "Parse CSV"}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Don't have a CSV file yet? Download a template to get started.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleTemplateDownload}
                  className="flex items-center gap-1"
                >
                  <FileDown className="h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Valid Entries ({validData.length})</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setTab("upload")}>
                    Back to Upload
                  </Button>
                  <Button size="sm" onClick={handleUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Data
                  </Button>
                </div>
              </div>
              
              {validData.length > 0 ? (
                <div className="border rounded-md overflow-x-auto max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validData.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>{entry.email}</TableCell>
                          <TableCell>{entry.address || "N/A"}</TableCell>
                          <TableCell>{entry.status || "active"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No valid entries found</p>
              )}
              
              {invalidData.length > 0 && (
                <>
                  <h3 className="font-medium text-lg">Invalid Entries ({invalidData.length})</h3>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      The following entries have validation errors and won't be imported
                    </AlertDescription>
                  </Alert>
                  
                  <div className="border rounded-md overflow-x-auto max-h-[200px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Line</TableHead>
                          <TableHead>Errors</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invalidData.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell>{entry.line}</TableCell>
                            <TableCell className="text-red-500">
                              {Array.isArray(entry.errors) 
                                ? entry.errors.join(', ') 
                                : entry.error || 'Unknown error'}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {typeof entry.data === 'string' 
                                ? entry.data 
                                : JSON.stringify(entry.data)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVUploadDialog;
