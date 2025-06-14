import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CleanerWithStats, UserWithReservations } from "@/types/admin";

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Parse CSV file for users
export const parseUserCSV = async (file: File): Promise<{ valid: UserWithReservations[], invalid: any[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
        
        // Check required headers
        const requiredHeaders = ['name', 'email', 'address'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          reject(`Missing required headers: ${missingHeaders.join(', ')}`);
          return;
        }
        
        const validUsers: UserWithReservations[] = [];
        const invalidUsers: any[] = [];
        
        // Process each line after headers
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(value => value.trim());
          if (values.length !== headers.length) {
            invalidUsers.push({ line: i + 1, error: 'Column count mismatch', data: lines[i] });
            continue;
          }
          
          // Create user object from CSV line
          const userData: Record<string, any> = {};
          for (let j = 0; j < headers.length; j++) {
            userData[headers[j]] = values[j];
          }
          
          // Validate data
          const errors: string[] = [];
          if (!userData.name) errors.push('Name is required');
          if (!userData.email) {
            errors.push('Email is required');
          } else if (!isValidEmail(userData.email)) {
            errors.push('Email format is invalid');
          }
          
          if (errors.length > 0) {
            invalidUsers.push({ line: i + 1, errors, data: userData });
          } else {
            // Create a valid user object
            const validUser: UserWithReservations = {
              id: crypto.randomUUID(), // Temporary ID for UI display
              name: userData.name,
              email: userData.email,
              address: userData.address || null,
              type: 'customer',
              status: 'active',
              created_at: new Date().toISOString(),
              reservation_count: 0
            };
            validUsers.push(validUser);
          }
        }
        
        resolve({ valid: validUsers, invalid: invalidUsers });
      } catch (error) {
        reject(`Failed to parse CSV: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    reader.onerror = () => {
      reject('Failed to read the file');
    };
    
    reader.readAsText(file);
  });
};

// Parse CSV file for cleaners
export const parseCleanerCSV = async (file: File): Promise<{ valid: CleanerWithStats[], invalid: any[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
        
        // Check required headers
        const requiredHeaders = ['name', 'email'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          reject(`Missing required headers: ${missingHeaders.join(', ')}`);
          return;
        }
        
        const validCleaners: CleanerWithStats[] = [];
        const invalidCleaners: any[] = [];
        
        // Process each line after headers
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(value => value.trim());
          if (values.length !== headers.length) {
            invalidCleaners.push({ line: i + 1, error: 'Column count mismatch', data: lines[i] });
            continue;
          }
          
          // Create cleaner object from CSV line
          const cleanerData: Record<string, any> = {};
          for (let j = 0; j < headers.length; j++) {
            cleanerData[headers[j]] = values[j];
          }
          
          // Validate data
          const errors: string[] = [];
          if (!cleanerData.name) errors.push('Name is required');
          if (!cleanerData.email) {
            errors.push('Email is required');
          } else if (!isValidEmail(cleanerData.email)) {
            errors.push('Email format is invalid');
          }
          
          if (errors.length > 0) {
            invalidCleaners.push({ line: i + 1, errors, data: cleanerData });
          } else {
            // Create a valid cleaner object
            const validCleaner: CleanerWithStats = {
              id: crypto.randomUUID(), // Temporary ID for UI display
              name: cleanerData.name,
              email: cleanerData.email,
              address: cleanerData.address || null,
              type: 'cleaner',
              status: 'active',
              created_at: new Date().toISOString(),
              reservation_count: 0
            };
            validCleaners.push(validCleaner);
          }
        }
        
        resolve({ valid: validCleaners, invalid: invalidCleaners });
      } catch (error) {
        reject(`Failed to parse CSV: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    reader.onerror = () => {
      reject('Failed to read the file');
    };
    
    reader.readAsText(file);
  });
};

// Function to save users to the database
export const saveUsersToDatabase = async (users: UserWithReservations[]): Promise<{ success: number, failed: number }> => {
  let success = 0;
  let failed = 0;
  
  for (const user of users) {
    // Only pick the properties we want to save
    const { name, email, address, type, status } = user;

    // Convert 'n/a' or 'N/A' to null for name and address
    const processedName = name?.toLowerCase() === 'n/a' ? null : name;
    const processedAddress = address?.toLowerCase() === 'n/a' ? null : address;
    
    const { error } = await supabase
      .from('users')
      .insert({
        name: processedName,
        email,
        address: processedAddress,
        type,
        status
      });
    
    if (error) {
      console.error("Error saving user:", error);
      failed++;
    } else {
      success++;
    }
  }
  
  return { success, failed };
};

// Function to save cleaners to the database
export const saveCleanersToDatabase = async (cleaners: CleanerWithStats[]): Promise<{ success: number, failed: number }> => {
  let success = 0;
  let failed = 0;
  
  for (const cleaner of cleaners) {
    // Only pick the properties we want to save
    const { name, email, address, type, status } = cleaner;

    // Convert 'n/a' or 'N/A' to null for name and address
    const processedName = name?.toLowerCase() === 'n/a' ? null : name;
    const processedAddress = address?.toLowerCase() === 'n/a' ? null : address;
    
    const { error } = await supabase
      .from('users')
      .insert({
        name: processedName,
        email,
        address: processedAddress,
        type: 'cleaner',
        status
      });
    
    if (error) {
      console.error("Error saving cleaner:", error);
      failed++;
    } else {
      success++;
    }
  }
  
  return { success, failed };
};

// Generate CSV template for users
export const generateUserCSVTemplate = (): string => {
  return "name,email,address,status\n";
};

// Generate CSV template for cleaners
export const generateCleanerCSVTemplate = (): string => {
  return "name,email,address,status\n";
};

// Function to download a CSV template
export const downloadCSVTemplate = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
