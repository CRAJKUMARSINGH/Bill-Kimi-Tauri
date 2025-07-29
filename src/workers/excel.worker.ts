// Import the required types from SheetJS
import { read, utils, WorkBook } from 'xlsx';

// Define message types for type safety
type ExcelWorkerMessage =
  | { type: 'PARSE_EXCEL'; file: File }
  | { type: 'EXPORT_EXCEL'; data: any[]; sheetName?: string };

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent<ExcelWorkerMessage>) => {
  const { type } = e.data;

  try {
    switch (type) {
      case 'PARSE_EXCEL': {
        const { file } = e.data;
        const arrayBuffer = await file.arrayBuffer();
        const workbook = read(arrayBuffer, { type: 'array' });
        
        // Get all sheet names
        const sheetNames = workbook.SheetNames;
        
        // Parse each sheet into JSON
        const sheetsData: Record<string, any[]> = {};
        
        for (const sheetName of sheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          
          // Convert rows of data to objects using first row as headers
          if (jsonData.length > 0) {
            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1) as any[][];
            
            sheetsData[sheetName] = rows.map(row => {
              const obj: Record<string, any> = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] !== undefined ? row[index] : '';
              });
              return obj;
            });
          } else {
            sheetsData[sheetName] = [];
          }
        }
        
        // Send the parsed data back to the main thread
        self.postMessage({ type: 'PARSE_SUCCESS', data: sheetsData });
        break;
      }
      
      case 'EXPORT_EXCEL': {
        const { data, sheetName = 'Sheet1' } = e.data;
        
        // Convert the data to a worksheet
        const worksheet = utils.json_to_sheet(data);
        
        // Create a new workbook and append the worksheet
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, sheetName);
        
        // Generate Excel file and send it back
        const excelBuffer = utils.write(workbook, { bookType: 'xlsx', type: 'array' });
        self.postMessage({ 
          type: 'EXPORT_SUCCESS', 
          data: excelBuffer 
        }, [excelBuffer]);
        break;
      }
      
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    console.error('Error in Excel worker:', error);
    self.postMessage({ 
      type: 'ERROR', 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

// Required for TypeScript worker type
export {};
