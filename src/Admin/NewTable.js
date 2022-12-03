import { Button, Flex, Input, Spacer, Tooltip, useDisclosure } from '@chakra-ui/react'
import React, { useContext, useRef, useState } from 'react'
import { BsPeopleFill, BsPlusSquareFill } from 'react-icons/bs'
import { MdPlace } from 'react-icons/md'
import {FaMoneyBillWave} from 'react-icons/fa'
import {FcAlarmClock} from 'react-icons/fc'
import {BiLogOut} from 'react-icons/bi'
import styled from 'styled-components'
import { AiFillMinusSquare, AiOutlineArrowRight } from 'react-icons/ai'
import { MyContext } from '../App'
import AddTable from '../Components/AddTable'
import { remove, ref, set, update } from "firebase/database";
import { useNavigate } from 'react-router-dom'
import ComponentToPrint from '../Components/ComponentToPrint'
import { useReactToPrint } from 'react-to-print'

const TableContainer = styled.div`
display:flex;
width:100%;
margin:auto;
justify-content:space-evenly;
flex-wrap:wrap;
`

const Table = styled.div`
width:290px;
overflow:hidden;
height:200px;
display:flex;
margin: 12px 5px;
flex-direction: column;
`

const TableHeader  = styled.div`
width:100%;
display:flex;
align-items:center;
background:#d5faff;
flex:1;
`
const TableFooter  = styled.div`
width:100%;
background:white;
flex:2;
display:flex;
`

const InputOrPrint = styled.div`
flex:3;
display:grid;
place-items:center;
`
const Dropdown = styled.div`
flex:1;
display:grid;
`
// display:grid;
// place-items:center;
const CreateOrFinish = styled.div`
flex:2;
display:grid;
place-items:center;
`

const TableNumber =styled.div`
flex:1;
background:${prop=>{
    switch (prop.item[1].status) {
        case 'full':
            return 'green'
            break;
        case 'booked':
            return 'brown'
            break;
        default:
            return 'black'
            break;
    }
}};
color:white;
${prop=>prop.item[1].status === 'full' && 'cursor: pointer;'}
display:grid;
place-items:center;
font-size:95px;
&:hover {
    transition:0.3s;
    ${prop=>prop.item[1].status === 'full' && 'background:blue;'}
}
`

const TableInfo =styled.div`
flex:2;
display:grid;
place-items:center;
`
const SingleInfo =styled.div`
width:90%;
font-size:22px;
margin: 0 5%;
font-weight:semi-bold;
display:flex;
justify-content:space-between;
`
const NewTable = () => {
    const values = useContext(MyContext)
    const {currentTypeOfTable, setCurrentTypeOfTable, typeOfTables, db,
           ordersData, checkNumber, tableStatuses, currentDate, notify, tablesData
          } = values;
    const singleRef=useRef()
    const [searchName, setSearchName] = useState('');
    const [specifyRow, setSpecifyRow]=useState("")
    const [title, setTitle]=useState("")
    const [tableNumber, setTableNumber]=useState(null)
    const [tableType, setTableType]=useState('')
    const [updatingTable, setUpdatingTable] = useState(false)
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [tableInfo, setTableInfo] = useState({
        tableNumber:null, tableType:'', totalPrice:0
    })
    const [fee, setFee] = useState(0)
    const [currentOrderData, setCurrentOrderData] = useState();
    const [totalPriceAndNumberToPrint, setTotalPriceAndNumberToPrint] = useState({
        ordersData:[],
        tableNumber:0,
        totalPrice:0
    })
    const { isOpen, onOpen, onClose } = useDisclosure()

    const navigate=useNavigate()
    const setRow=(item)=>{
        setSpecifyRow(item[1].id)
        setTitle(item[1].title)
        setTableNumber(item[1].tableNumber)
        setTableType(item[1].tableType)
        setFee(item[1].fee)
        setUpdatingTable(true);
        onOpen();
    }

    const deleteTable = (item)=>{
      remove(ref(db, 'todo/'+item[0]));
    }
    const bookTable = (item) => {
        update(ref(db,'todo/'+item[0]), {
            status: tableStatuses[1]
        })
    }
    const cancelBooking = (item) => {
        update(ref(db,'todo/'+item[0]), {
            status: tableStatuses[0]
        })
    }

    const createTable=(typeOfTable, numberOfTable, orderId)=>{
        set(ref(db, `table/${typeOfTable}/${numberOfTable}/info`), {
            numberOfTable,
            numberOfPeople,
            status: "active",
            start:currentDate,
            comment: ''
        });

      update(ref(db,'settings'),{checkNumber: checkNumber + 1})
      console.log(checkNumber)
      update(ref(db,'todo/' + orderId),{
        status:'full',
        start:currentDate,
        numberOfPeople,
        totalPrice: 0
      })

        set(ref(db,"/notify"),{
            change:!notify.change,
            title:"Новый стол",
            description:`Номер: ${numberOfTable} .Количество людей: ${numberOfPeople},`,
            status:"info"
        })
        navigate(`/order/${numberOfTable}/${typeOfTable}`)
    }

    const handleDoublePrint = useReactToPrint({
        content: () => singleRef.current
    });
    const closedTable = (item) => {
      remove(ref(db,`table/${item[1].tableType}/${item[1].tableNumber}`))
      update(ref(db,"todo/"+item[0]),{
        status: 'empty',
        comment: ''
      })
      set(ref(db,"/notify"),{
        change:!notify.change,
        description:`Стол ${item[1].tableNumber}  был закрыт `,
        status:"warning",
        title:"Заказ завершен"
      })
      handleDoublePrint()
    }

    const setPrintDetail = (item) => {
      const {tableNumber, tableType, fee, totalPrice} = item[1];
      setTableInfo({tableNumber, tableType, fee, totalPrice})
      if(ordersData.length !==0){
        var firstStep = ordersData.find(item => item[0] === tableType)
        if(firstStep){
          firstStep = firstStep[1]
          var secondStep = Object.values(firstStep)
          var lastStep = Object.entries(secondStep[0])
          setCurrentOrderData(lastStep.reverse())
        }
      }
    }

    const navigateToOrders = (item) => {
        if(item[1].status === tableStatuses[2]){
            navigate(`/order/${item[1].tableNumber}/${item[1].tableType}`)
        }
    }
  return (
    <div style={{background:'rgb(12 31 58)'}} >
     <Button></Button>
     <Flex mt="40px" mx='1.5vw' justifyContent={'center'} flexWrap={'wrap'} alignItems={'center'} w='97vw' >
        <AddTable mx='5px' tableType = {tableType} setTableType={(e)=>setTableType(e)}
                setUpdatingTable = {(e)=>setUpdatingTable(e)}
                updatingTable={updatingTable}
                fee = {fee}
                setFee = {(e) => setFee(e)}
                setTableNumber ={(e)=>setTableNumber(e)} specifyRow={specifyRow}
                setSpecifyRow ={(e)=>setSpecifyRow(e)} tableNumber={tableNumber}
                isOpen={isOpen} onOpen={onOpen} onClose={onClose}
                title={title} setTitle={(e)=>setTitle(e)} >
            Добавить стол
        </AddTable>
        <Spacer/>
        <div style={{width:'200px', margin:'5px 0'}} class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-default">Найти</span>
            </div>
            <input placeholder='Номер стола' type='number' onChange={(e) => setSearchName(e.target.value)} class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
        </div>
        <Spacer/>
        <div class="btn-group btn-group" role="group" aria-label="...">
            {typeOfTables.map((item, ind) => (
                <button onClick={() => setCurrentTypeOfTable(item)} type="button" key={ind} class={`btn btn-${currentTypeOfTable === item ? 'success' : 'secondary'}`}>{item}</button>
            ))}
                <button onClick={() => setCurrentTypeOfTable('Все')} type="button" class={`btn btn-${currentTypeOfTable === 'Все' ? 'success' : 'secondary'}`}>Все</button>
        </div>
    </Flex>
     <TableContainer  overflowY='hidden' >
        {tablesData && tablesData.filter(table => currentTypeOfTable == 'Все' ? table : table[1].tableType === currentTypeOfTable)
                                 .filter(filt=>filt[1].tableNumber.toLowerCase().includes(searchName.toLowerCase()))
                                 .sort(((a,b)=>a[1].tableNumber - b[1].tableNumber))
                                 .map(item => (
            <Table>
                <TableHeader>
                    <Dropdown>
                        {/* <IoIosArrowDropdownCircle/> */}
                      {item[1].status === tableStatuses[0] && (
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <span style={{cursor:'pointer'}} class="dropdown-item" onClick={()=>{setRow(item)}}>
                                        Редактировать
                                    </span>
                                    <span style={{cursor:'pointer'}} onClick={()=> bookTable(item)} class="dropdown-item">
                                        Занятать
                                    </span>
                                    <span style={{cursor:'pointer'}} onClick={()=> deleteTable(item)} class="dropdown-item">
                                        Удалить
                                    </span>
                                </div>
                        </div>
                      )}
                      {item[1].status === tableStatuses[1] && (
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <span style={{cursor:'pointer'}} onClick={()=> cancelBooking(item)} class="dropdown-item">
                                    Отменить
                                </span>
                            </div>
                        </div>
                      )}
                    </Dropdown>
                    <InputOrPrint>
                        {item[1].status !== tableStatuses[1] && (
                            item[1].status === tableStatuses[0] ? (
                                <div style={{display:'flex',width:'100%', justifyContent:'center', alignItems:'center' }} >
                                    <AiFillMinusSquare style={{cursor:"pointer",fontSize:"39px"}} onClick={()=> setNumberOfPeople(prev=>prev - 1)} />
                                    <Input width='50px' size='sm' value={numberOfPeople} variant='filled' m='5px' required type='number'/>
                                    <BsPlusSquareFill style={{cursor:"pointer", fontSize:"30px"}} onClick={()=>setNumberOfPeople(prev => prev + 1)} />
                                </div>
                            ) : (
                                <div>
                                    {/* onClick={() => printTable(item)} */}
                                    {/* <ReactToPrint
                                        trigger={() => <AiFillPrinter/>}
                                        content={() => printRef.current}
                                    /> */}
                                </div>
                            )
                        )}
                    </InputOrPrint>
                    <CreateOrFinish>
                            {item[1].status === tableStatuses[0] || item[1].status === tableStatuses[1] ? (
                                <Button onClick={() => createTable(item[1].tableType, item[1].tableNumber,item[1].id)} colorScheme='green'>
                                    <AiOutlineArrowRight/>
                                </Button>
                            ):(
                                <Button onClick={() => setPrintDetail(item)} onDoubleClick={() => closedTable(item)} colorScheme='red'>
                                    <Tooltip hasArrow label="Закрать стол" >
                                      <BiLogOut/>
                                    </Tooltip>
                                </Button>
                            )
                            }
                    </CreateOrFinish>
                </TableHeader>
                <TableFooter>
                    <TableInfo>
                        {item[1].title && (
                            <SingleInfo>
                                <span>{item[1].title}</span>
                            </SingleInfo>
                        )}
                        <SingleInfo>
                            <span style={{fontWeight:'bold'}} >{item[1].tableType}</span>
                            <MdPlace/>
                        </SingleInfo>
                        {item[1].status === tableStatuses[2] && (
                            <>
                            <SingleInfo>
                                <span>{item[1].numberOfPeople}</span>
                                <BsPeopleFill/>
                            </SingleInfo>
                            <SingleInfo>
                                <span>{item[1].start.split(' ')[2]}</span>
                                <FcAlarmClock/>
                            </SingleInfo>
                            <SingleInfo>
                              <span>{item[1].totalPrice + ((item[1].totalPrice * item[1].fee) / 100)}</span>
                              <FaMoneyBillWave/>
                            </SingleInfo>
                            <SingleInfo>
                              <span style={{fontSize:'smaller'}}>{item[1].comment}</span>
                            </SingleInfo>
                            </>
                        )}
                    </TableInfo>
                    <TableNumber onClick={()=>navigateToOrders(item)} item={item}>{item[1].tableNumber}</TableNumber>
                </TableFooter>
            </Table>
                                 ))
        }
     </TableContainer>
        <div id='for_print' style={{display:'none'}}>
          <ComponentToPrint
            ref = {singleRef}
            totalPrice = {tableInfo.fee === 0 ? tableInfo.totalPrice : (tableInfo.totalPrice + ((tableInfo.totalPrice * tableInfo.fee) / 100))}
            fee = {tableInfo.fee}
            ordersData = {currentOrderData}
            tableNumber = {tableInfo.tableNumber}
            tableType = {tableInfo.tableType}
          />
        </div>
    </div>
  )
}

export default NewTable
