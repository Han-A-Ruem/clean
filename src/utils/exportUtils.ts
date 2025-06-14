import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserWithReservations, CleanerWithStats } from "@/types/admin";

// Helper to format date objects to strings
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Export users data to CSV format
export const exportToCSV = (data: any[], filename: string) => {
  // Define headers based on the first item in the data array
  if (data.length === 0) {
    console.error("No data to export");
    return;
  }
  
  const headers = Object.keys(data[0])
    .filter(key => typeof data[0][key] !== 'object' && key !== 'id') // Exclude complex objects and ID
    .map(key => key.replace(/_/g, ' ').toUpperCase());
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = Object.keys(item)
      .filter(key => typeof item[key] !== 'object' && key !== 'id') // Exclude complex objects and ID
      .map(key => {
        let value = item[key];
        
        // Format dates
        if (key === 'created_at') {
          value = formatDate(value);
        }
        
        // Ensure values with commas are properly quoted
        if (value && typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        
        return value !== null && value !== undefined ? value : '';
      })
      .join(',');
    
    csvContent += row + '\n';
  });
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export users data to PDF format
export const exportToPDF = (data: any[], filename: string, title: string) => {
  if (data.length === 0) {
    console.error("No data to export");
    return;
  }
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Define the columns for the PDF
  const columns = Object.keys(data[0])
    .filter(key => typeof data[0][key] !== 'object' && key !== 'id') // Exclude complex objects and ID
    .map(key => ({ header: key.replace(/_/g, ' ').toUpperCase(), dataKey: key }));
  
  // Prepare the data for the table
  const rows = data.map(item => {
    const row: Record<string, any> = {};
    columns.forEach(column => {
      let value = item[column.dataKey];
      
      // Format dates
      if (column.dataKey === 'created_at') {
        value = formatDate(value);
      }
      
      row[column.dataKey] = value !== null && value !== undefined ? value : '';
    });
    return row;
  });
  
  // Add the table to the PDF
  (doc as any).autoTable({
    startY: 40,
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
    margin: { top: 30 },
  });
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};

// Export user data specifically
export const exportUsers = (users: UserWithReservations[], format: 'csv' | 'pdf') => {
  // Flatten user data (remove nested objects, keep only essential fields)
  const flattenedUsers = users.map(user => ({
    name: user.name || 'N/A',
    email: user.email || 'N/A',
    type: user.type || 'N/A',
    address: user.address || 'N/A',
    status: user.status || 'N/A',
    reservation_count: user.reservation_count || 0,
    rank_name: user.rank_name || 'N/A',
    created_at: user.created_at
  }));
  
  if (format === 'csv') {
    exportToCSV(flattenedUsers, 'users-export');
  } else {
    exportToPDF(flattenedUsers, 'users-export', 'Users Report');
  }
};

// Export cleaner data specifically
export const exportCleaners = (cleaners: CleanerWithStats[], format: 'csv' | 'pdf') => {
  // Flatten cleaner data (remove nested objects, keep only essential fields)
  const flattenedCleaners = cleaners.map(cleaner => ({
    name: cleaner.name || 'N/A',
    email: cleaner.email || 'N/A',
    address: cleaner.address || 'N/A',
    status: cleaner.status || 'N/A',
    reservation_count: cleaner.reservation_count || 0,
    rank_name: cleaner.rank_name || 'N/A',
    created_at: cleaner.created_at
  }));
  
  if (format === 'csv') {
    exportToCSV(flattenedCleaners, 'cleaners-export');
  } else {
    exportToPDF(flattenedCleaners, 'cleaners-export', 'Cleaners Report');
  }
};
