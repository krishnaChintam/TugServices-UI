import React,{ useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import CommonServices from './commonService';

const DataTable = ({
  columnDefs = [],
  rowData = [],
  height = '70vh',
  paginationPageSize = 10,
  paginationPageSizeSelector = [10, 20, 50],
  sortable = false,
  filter = false
}) => {
  const gridRef = useRef();
  const defaultColDef = {
    sortable: sortable,
    filter: filter,
    resizable: true,
  }

  const exportToExcel = () => {
    // 1. Define the mapping from data field name to desired Excel header name
    const columnMapping = {
        'serviceDate': 'Date',
        'refNo': 'Voucher No',
        'locationName': 'Location',
        'motherVessel': 'Mother Vessel',
        'vesselName': 'Daughter Vessel',
        'tugName': 'Tug Name',
        'serviceRemarks': 'Type of Service',
        'remarks': 'Remarks'
    };
    // Use the keys of the mapping as the columns to extract from the row data
    const exportColumns = Object.keys(columnMapping); 
    
    const allRowData = [];
    // Assuming gridRef is an AG Grid reference
    gridRef.current.api.forEachNode((node) => allRowData.push(node.data)); 

    // 2. Filter data and apply the new headers
    const filteredData = allRowData.map(row => {
      const newRow = {};
      exportColumns.forEach(colKey => {
        // Use the mapped header name as the key in the new object
        const excelHeader = columnMapping[colKey]; 
        // Assign the value from the original row data
        newRow[excelHeader] = row[colKey]; 
      });
      return newRow;
    });

    // Existing XLSX library code remains the same
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // Assuming saveAs is available (e.g., from file-saver library)
    saveAs(blob, "TugJobDetails.xlsx"); 
};

  return (
    <div className="ag-theme-quartz" style={{ width: '100%', height }}>
      <div className="mb-2 flex justify-end">
        <Button
          variant="contained"
          size="small"
          onClick={exportToExcel}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        > Export Data </Button>
      </div>
      <AgGridReact
       ref={gridRef}
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        columnTypes={{
          number: {
            filter: 'agNumberColumnFilter',
            editable: true,
            valueParser: p => Number(p.newValue),
          },
        }}
      />
    </div>
  )
}

export default DataTable;
