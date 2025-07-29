import { useState } from "react";
import UploadZone from "./components/UploadZone/UploadZone";
import { parseExcelFile } from "./utils/excelUtils";
import { generatePdfFromExcelData } from "./utils/pdfUtils";
import { FiAlertCircle, FiCheckCircle, FiFileText, FiDownload } from "react-icons/fi";

// Define types for our application
type SheetData = {
  [sheetName: string]: any[];
};

type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

function App() {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setStatus('processing');
    setError(null);
    
    try {
      // Parse the Excel file using our worker
      const data = await parseExcelFile(file);
      
      // Update state with the parsed data
      setSheetData(data);
      
      // Set the first sheet as active by default
      const firstSheet = Object.keys(data)[0];
      setActiveSheet(firstSheet);
      
      setStatus('success');
    } catch (err) {
      console.error("Error processing file:", err);
      setError(err instanceof Error ? err.message : 'Failed to process the file');
      setStatus('error');
    }
  };

  const handleGeneratePdf = () => {
    if (!sheetData || !activeSheet) return;
    
    try {
      generatePdfFromExcelData(sheetData[activeSheet], activeSheet);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError('Failed to generate PDF. Please try again.');
      setStatus('error');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing your file...</p>
          </div>
        );
      
      case 'success':
        if (!sheetData || !activeSheet) return null;
        
        return (
          <div className="mt-6">
            {/* Sheet selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Sheet
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(sheetData).map((sheetName) => (
                  <button
                    key={sheetName}
                    onClick={() => setActiveSheet(sheetName)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeSheet === sheetName
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sheetName}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Data preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {sheetData[activeSheet].length > 0 && 
                        Object.keys(sheetData[activeSheet][0]).map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sheetData[activeSheet].slice(0, 10).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td
                            key={`${rowIndex}-${cellIndex}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {sheetData[activeSheet].length > 10 && (
                      <tr>
                        <td 
                          colSpan={Object.keys(sheetData[activeSheet][0] || {}).length} 
                          className="px-6 py-2 text-center text-xs text-gray-500"
                        >
                          ... and {sheetData[activeSheet].length - 10} more rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleGeneratePdf}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiFileText className="mr-2 h-4 w-4" />
                Generate PDF
              </button>
              <button
                onClick={() => {
                  // TODO: Implement DOCX generation
                  alert('DOCX generation will be implemented in the next step');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiFileText className="mr-2 h-4 w-4" />
                Generate DOCX
              </button>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error processing file</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error || 'An unknown error occurred'}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="rounded-md bg-red-50 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <UploadZone onFile={handleFileUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Infrastructure Billing System</h1>
          <p className="text-gray-600">Upload your Excel file to generate bills</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          {renderContent()}
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p> {new Date().getFullYear()} Mrs. Premlata Jain</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
