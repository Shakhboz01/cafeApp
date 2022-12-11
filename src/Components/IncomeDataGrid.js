import React, { useContext,useState,useCallback, useEffect, useMemo, useRef } from 'react'
import 'react-data-grid/lib/styles.css';
import axios from 'axios';
import { MyContext } from '../App';
import {AgGridReact} from 'ag-grid-react';
import { Button } from '@chakra-ui/react';
// import 'ag-grid-community/styles//ag-grid.css';
// import 'ag-grid-community/styles//ag-theme-alpine.css';

const IncomeDataGrid = () => {
  const gridRef = useRef()
  const values = useContext(MyContext);
  const {incomesData, setIncomesData,currentDate, db} = values

  const getIncomesData = async()=>{
    await axios.get(`${process.env.REACT_APP_HOST}/incomes`).then(res=>{
      if(res.data.success){
        setIncomesData(res.data.data)
      }
    })
  }
  useEffect(()=>{
    if(incomesData.length == 0){
      getIncomesData()
    }
  },[])

  const columns = [
    { field: 'amount', headerName: 'Сумма',
      filter: 'agSetColumnFilter',
      filterParams: {
          // can be 'windows' or 'mac'
          excelMode: 'windows',
      },
    },
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
    { field: 'incomeType', headerName: 'Тип',
      filter: 'agSetColumnFilter',
      filterParams: {
        values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }
    },
    { field: 'incomeDescription', headerName: 'Коммент' },
    { field: 'paymentType', headerName: 'Способ оплаты' }
  ];
  const defaultColDef = useMemo(() => ({
    resizable: true,
    editable: true,
    sortable: true,
    pagination: true,
    paginationAutoPageSize: true,
    flex: 1
  }), []);
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
  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel({fileName: `Рассходы ${currentDate}`});
  }, []);

  return (
    <>
      <div
				className="ag-theme-alpine"
				style={{
					height: '540px',
					width: '100%'
				}}
      >
        <Button onClick={onBtExport} style={{ marginBottom: '5px', fontWeight: 'bold' }}>
          Экспорт на Excel
        </Button>
        {incomesData && (
          <AgGridReact
            columnDefs={columns}
            ref={gridRef}
            rowData={incomesData}
            masterDetail={true}
            animateRows = "true"
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            statusBar={statusBar}
            pagination={true}
          />
        )}
			</div>
    </>
  )
}

export default IncomeDataGrid
