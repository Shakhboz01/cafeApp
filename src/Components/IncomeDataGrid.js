import React, { useContext,useState, useEffect, useMemo } from 'react'
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import axios from 'axios';
import { MyContext } from '../App';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';

const IncomeDataGrid = () => {
  const values = useContext(MyContext);
  const {incomesData, setIncomesData, db} = values

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
    { field: 'amount', headerName: 'Сумма' },
    { field: 'date', headerName: 'Дата' },
    { field: 'incomeType',cellRenderer: 'agGroupCellRenderer', headerName: 'Тип' },
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

  return (
    <>
      <div
				className="ag-theme-alpine"
				style={{
					height: '600px',
					width: '100%'
				}}
      >
        {incomesData && (
          <AgGridReact
            columnDefs={columns}
            rowData={incomesData}
            masterDetail={true}
            animateRows = "true"
            defaultColDef={defaultColDef}
          />
        )}
			</div>
    </>
  )
}

export default IncomeDataGrid
