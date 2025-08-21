// eslint-disable-next-line no-unused-vars
import React, { useState, useCallback, useEffect } from "react";
import PropTypes from 'prop-types';
import { Box, CircularProgress } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const DataGrid = ({
  rowData,
  columnDefs,
  defaultColDef,
  onGridReady: customGridReady,
  onRowClicked,
  loading = false,
  paginationPageSize = 10,
  pagination = true,
  domLayout = "normal",
  rowHeight = 48,
  headerHeight = 40,
  gridStyles = {},
  animateRows = true,
  enableCellTextSelection = true,
  suppressMovableColumns = false,
  allowDragFromColumnsToolPanel = true,
  ensureDomOrder = true,
  suppressCellFocus = true,
}) => {
  const [gridApi, setGridApi] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Process column definitions to ensure they have the right properties
  const processedColumnDefs = columnDefs.map(col => ({
    ...col,
    // Make sure tooltips are enabled for all cells that could overflow
    tooltipValueGetter: (params) => {
      if (!params.value) return '';
      return params.value.toString();
    },
    // Ensure header tooltips
    headerTooltip: col.headerName,
  }));

  const onGridReady = useCallback((params) => {
    console.log("Grid ready, API created", params);
    setGridApi(params.api);
    
    // First auto-size columns based on content
    params.columnApi.autoSizeAllColumns();
    
    // Then fit columns to available width if needed
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);
    
    // Call custom onGridReady if provided
    if (customGridReady) {
      customGridReady(params);
    }
  }, [customGridReady]);

  // Function to handle column resize
  const onColumnResized = useCallback((params) => {
    // When manually resizing columns, we want to keep that size
    params.api.resetRowHeights();
  }, []);

  useEffect(() => {
    // Resize grid when window size changes
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (gridApi) {
        // First auto-size columns based on their header and content
        gridApi.columnApi.autoSizeAllColumns();
        // Then adjust to fit the available space
        setTimeout(() => {
          gridApi.sizeColumnsToFit();
        }, 50);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gridApi]);

  // Default column definitions if not provided
  const internalDefaultColDef = defaultColDef || {
    flex: windowWidth < 768 ? 0 : 1,
    minWidth: windowWidth < 768 ? 70 : 100,
    resizable: true,
    sortable: true,
    filter: windowWidth >= 768,
    floatingFilter: windowWidth > 768,
    filterParams: {
      buttons: ['reset', 'apply'],
    },
    sortingOrder: ['asc', 'desc', null],
    unSortIcon: true,
    suppressMovable: true,
    autoHeight: false, // Don't auto-height by default for performance
    wrapText: false, // Don't wrap text by default for cleaner UI
    cellStyle: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      fontSize: windowWidth < 768 ? '0.75rem' : '0.875rem',
      padding: windowWidth < 768 ? '4px' : '8px'
    },
    // Enable tooltips for all cells by default
    tooltipComponent: 'defaultTooltip',
    suppressSpanHeaderHeight: false,
  };

  const defaultStyles = {
    height: { xs: 'calc(100vh - 120px)', sm: '80vh' },
    width: '100%',
    marginTop: 2,
    flexGrow: 1,
    minHeight: '400px',
    overflow: 'auto',
    '& .ag-root': {
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
    },
    '& .ag-header': {
      backgroundColor: '#F9FAFB',
      borderBottom: '2px solid #E5E7EB',
    },
    '& .ag-header-cell': {
      fontSize: { xs: '0.75rem', sm: '0.875rem' },
      fontWeight: 600,
      color: '#374151',
      padding: { xs: '4px 8px', sm: '8px 16px' },
    },
    '& .ag-header-cell-resize': {
      width: '8px', // Make the resize handle easier to grab
      opacity: 0.5,
    },
    '& .ag-header-cell-resize:hover': {
      opacity: 1,
      backgroundColor: '#ddd',
    },
    '& .ag-cell': {
      fontSize: { xs: '0.75rem', sm: '0.875rem' },
      color: '#1F2937',
      padding: { xs: '4px 8px', sm: '8px 16px' },
    },
    '& .ag-row': {
      height: { xs: '48px !important', sm: '60px !important' }
    },
    '& .ag-row-odd': {
      backgroundColor: '#F9FAFB',
    },
    '& .ag-row-hover': {
      backgroundColor: '#F3F4F6 !important',
    },
    '& .ag-horizontal-scroll': {
      height: '8px'
    },
    ...gridStyles
  };

  return (
    <Box
      className="ag-theme-alpine"
      sx={defaultStyles}
    >
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%' 
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <AgGridReact
          rowData={rowData}
          columnDefs={processedColumnDefs}
          defaultColDef={internalDefaultColDef}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          onGridReady={onGridReady}
          suppressCellFocus={suppressCellFocus}
          modules={[ClientSideRowModelModule]}
          domLayout={domLayout}
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          animateRows={animateRows}
          enableCellTextSelection={enableCellTextSelection}
          suppressMovableColumns={suppressMovableColumns}
          allowDragFromColumnsToolPanel={allowDragFromColumnsToolPanel}
          ensureDomOrder={ensureDomOrder}
          onRowClicked={onRowClicked}
          onColumnResized={onColumnResized}
          tooltipShowDelay={300}
          tooltipHideDelay={2000}
        />
      )}
    </Box>
  );
};

DataGrid.propTypes = {
  rowData: PropTypes.array.isRequired,
  columnDefs: PropTypes.array.isRequired,
  defaultColDef: PropTypes.object,
  onGridReady: PropTypes.func,
  onRowClicked: PropTypes.func,
  loading: PropTypes.bool,
  paginationPageSize: PropTypes.number,
  pagination: PropTypes.bool,
  domLayout: PropTypes.string,
  rowHeight: PropTypes.number,
  headerHeight: PropTypes.number,
  gridStyles: PropTypes.object,
  animateRows: PropTypes.bool,
  enableCellTextSelection: PropTypes.bool,
  suppressMovableColumns: PropTypes.bool,
  allowDragFromColumnsToolPanel: PropTypes.bool,
  ensureDomOrder: PropTypes.bool,
  suppressCellFocus: PropTypes.bool,
};

export default DataGrid; 