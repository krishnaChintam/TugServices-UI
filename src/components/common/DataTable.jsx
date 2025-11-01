import React,{ useRef,useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";

const DataTable = ({
  columnDefs = [],
  rowData = [],
  height = '70vh',
  paginationPageSize = 10,
  paginationPageSizeSelector = [10, 20, 50],
  sortable = false,
  filter = false,
  quickFilterValue=''
}) => {
  const gridRef = useRef();
  const defaultColDef = {
    sortable: sortable,
    filter: filter,
    resizable: true,
  }

  // Apply global filter whenever the prop updates
  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption("quickFilterText",quickFilterValue);
    }
  }, [quickFilterValue]);

  // const onFilterTextBoxChanged = useCallback(() => {
  //   gridRef.current.api.setGridOption(
  //     "quickFilterText",
  //     quickFilterValue,
  //   );
  // }, []);

  return (
    <div className="ag-theme-quartz" style={{ width: '100%', height }}>
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
