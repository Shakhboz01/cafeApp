import React, { useContext,useState, useCallback, useEffect, useMemo, useRef } from 'react'
import 'react-data-grid/lib/styles.css';
import axios from 'axios';
import { MyContext } from '../App';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { Button } from '@chakra-ui/react';

const OutcomeDataGrid = () => {
  const gridRef = useRef();

  const values = useContext(MyContext);
  const {outcomesData, currentDate, setOutcomesData, db} = values

  const getOutcomesData = async()=>{
    await axios.get(`${process.env.REACT_APP_HOST}/outcomes`).then(res=>{
      if(res.data.success){
        setOutcomesData(res.data.data)
      }
    })
  }
  useEffect(()=>{
    if(outcomesData.length == 0){
      getOutcomesData()
     }
  },[])

  const columns = [
    { field: 'amount', headerName: 'Сумма' },
    {
      field: 'date',
      headerName: 'Дата',
      filter: 'agDateColumnFilter',
      filterParams: {
        // provide comparator function
        comparator: (filterLocalDateAtMidnight, cellValue) => {
            const dateAsString = cellValue;

            if (dateAsString == null) {
                return 0;
            }

            // In the example application, dates are stored as dd/mm/yyyy
            // We create a Date object for comparison against the filter date
            const dateParts = dateAsString.split('.');
            const year = Number(dateParts[0]);
            const month = Number(dateParts[1]) - 1;
            const day = Number(dateParts[2]);
            const cellDate = new Date(year, month, day);

            // Now that both parameters are Date objects, we can compare
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return 0;
        }
    }
    },
    { field: 'outcomeType', headerName: 'Тип' },
    { field: 'paymentType', headerName: 'Способ оплаты' },
    { field: 'prodName', headerName: 'Название' },
    { field: 'prodAmount', headerName: 'Количество' },
    { field: 'outcomeDescription', headerName: 'Коммент' }
  ];
  const statusBar = {
    statusPanels: [
        {
            // statusPanel: 'agTotalAndFilteredRowCountComponent',
            align: 'left',
            statusPanel: 'agAggregationComponent',
            statusPanelParams: {
              // possible values are: 'count', 'sum', 'min', 'max', 'avg'
              aggFuncs: ['sum', 'avg'],
            },
        }
    ]
  };
  const defaultColDef = useMemo(() => ({
    resizable: true,
    editable: true,
    sortable: true,
    pagination: true,
    paginationAutoPageSize: true,
    flex: 1
  }), []);
  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel({fileName: `Рассходы ${currentDate}`});
  }, []);
  return (
    <>
      <div
				className="ag-theme-alpine"
				style={{
					height: '530px',
					width: '100%',
          margin: '20px 0'
				}}
      >
        <Button onClick={onBtExport} style={{ marginBottom: '5px', fontWeight: 'bold' }}>
          Экспорт на Excel
        </Button>
        {outcomesData && (
          <AgGridReact
          ref={gridRef}
          columnDefs={columns}
            rowData={outcomesData}
            masterDetail={true}
            enableRangeSelection={true}
            statusBar={statusBar}
            pagination={true}
            animateRows = "true"
            defaultColDef={defaultColDef}
          />
        )}
			</div>
    </>
  )
}

export default OutcomeDataGrid
