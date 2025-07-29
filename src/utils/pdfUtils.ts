import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

interface TableColumn {
  header: string;
  dataKey: string;
}

export const generatePdf = (
  data: any[],
  columns: TableColumn[],
  title: string = 'Bill',
  fileName: string = 'bill.pdf'
): void => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);

  // Prepare data for the table
  const tableColumn = columns.map(col => col.header);
  const tableRows: any[] = [];

  data.forEach(item => {
    const rowData = columns.map(col => item[col.dataKey] || '');
    tableRows.push(rowData);
  });

  // Add the table
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: 'middle',
      overflow: 'linebreak',
      tableWidth: 'wrap',
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 30 },
  });

  // Add page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 25,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Save the PDF
  doc.save(fileName);
};

export const generateAndDownloadPdf = (
  data: any[],
  columns: TableColumn[],
  title: string = 'Bill',
  fileName: string = 'bill.pdf'
): void => {
  generatePdf(data, columns, title, fileName);
};

// Helper function to generate PDF from Excel data
export const generatePdfFromExcelData = (
  data: any[],
  sheetName: string
): void => {
  if (!data || data.length === 0) {
    console.error('No data to generate PDF');
    return;
  }

  // Extract column headers from the first row
  const firstRow = data[0];
  const columns = Object.keys(firstRow).map(key => ({
    header: key,
    dataKey: key,
  }));

  // Generate the PDF
  generatePdf(
    data,
    columns,
    `${sheetName} - ${new Date().toLocaleDateString()}`,
    `${sheetName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`
  );
};
