import * as XLSX from 'xlsx';

/**
 * Parses an Excel file and returns a promise with the sheet data
 * @param file - The Excel file to parse
 * @returns Promise with an object containing sheet names as keys and their data as values
 */
export const parseExcelFile = (file: File): Promise<Record<string, any[]>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get all sheet names
        const sheetNames = workbook.SheetNames;
        const result: Record<string, any[]> = {};
        
        // Convert each sheet to JSON
        sheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          result[sheetName] = jsonData;
        });
        
        resolve(result);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(new Error('Failed to read file'));
    };
    
    // Read the file as array buffer
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Exports data to an Excel file and triggers download
 * @param data - The data to export
 * @param fileName - The name of the file (without extension)
 */
export const exportToExcel = (data: any[], fileName: string): void => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
};

export default {
  parseExcelFile,
  exportToExcel
};
