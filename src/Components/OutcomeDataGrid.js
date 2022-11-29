import React, { useContext,useState, useEffect, useMemo } from 'react'
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import axios from 'axios';
import { MyContext } from '../App';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';

const OutcomeDataGrid = () => {
  const values = useContext(MyContext);
  const {outcomesData, setOutcomesData, db} = values

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
    { field: 'date', headerName: 'Дата' },
    { field: 'outcomeType',cellRenderer: 'agGroupCellRenderer', headerName: 'Тип' },
    { field: 'outcomeDescription', headerName: 'Коммент' },
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
        {outcomesData && (
          <AgGridReact
            columnDefs={columns}
            rowData={outcomesData}
            masterDetail={true}
            animateRows = "true"
            defaultColDef={defaultColDef}
          />
        )}
			</div>
    </>
  )
}

export default OutcomeDataGrid
