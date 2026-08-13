import * as XLSX from "xlsx";

export const exportToExcel = (
  data,
  fileName = "transactions"
) => {
  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }

  try {
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Transactions"
    );

    // Generate Excel file and download
    XLSX.writeFile(
      workbook,
      `${fileName}.xlsx`
    );

  } catch (error) {
    console.error("Export error:", error);
    alert(
      "Error exporting data. Please try again."
    );
  }
};