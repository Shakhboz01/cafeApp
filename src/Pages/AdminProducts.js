import { Button } from '@chakra-ui/react'
import { AgGridReact } from 'ag-grid-react';
import React, {useCallback,useState, useMemo, useContext, useRef, useEffect } from 'react'
import { MyContext } from '../App'

const AdminProducts = () => {
  const [data, setData] = useState([])
  const values = useContext(MyContext);
  const {products, currentDate} = values
  const gridRef = useRef()
  const columns = [
    { field: 'name', headerName: 'Название',
      filter: 'agSetColumnFilter',
      filterParams: {
          // can be 'windows' or 'mac'
          excelMode: 'windows',
      },
    },
    {
      field: 'price',
      headerName: 'Цена',
      filter: 'agDateColumnFilter'
    },
    { field: 'product_left', headerName: 'Осталось',
      filter: 'agSetColumnFilter',

    },
    { field: 'totalSale', headerName: 'Итого продано' },
    { field: 'restriction', headerName: 'Красная зона' }
  ];

  useEffect(()=>{
    var arr = []
    var prod = Object.values(products)
    for (let index = 0; index < prod.length; index++) {
      arr.push(prod[index][1])
    }
    setData(arr)
  },[])

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel({fileName: `Товары ${currentDate}`});
  }, []);

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

  return (
    <div>
      <Button/>
      <div
				className="ag-theme-alpine"
				style={{
					height: '540px',
          margin:'15px 0',
					width: '100%'
				}}
      >
        <Button onClick={onBtExport} style={{ margin: '20px', fontWeight: 'bold' }}>
          Экспорт на Excel
        </Button>

        {data && (
          <AgGridReact
            columnDefs={columns}
            ref={gridRef}
            rowData={Object.values(data)}
            masterDetail={true}
            animateRows = "true"
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            statusBar={statusBar}
            pagination={true}
          />
        )}
      </div>
    </div>
  )
}

export default AdminProducts
