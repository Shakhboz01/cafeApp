import React, { useContext, useEffect,useRef, useState } from 'react'
import {  useLocation } from 'react-router-dom'
import { getDatabase, push, onValue,remove, ref, set, update } from "firebase/database";
import ReactToPrint from 'react-to-print';
import {AiFillDelete, AiFillEdit, AiOutlineArrowRight} from 'react-icons/ai'
import  styled, { withTheme } from 'styled-components'
import {BsFillPrinterFill, BsPlusSquareFill} from 'react-icons/bs'
import {AiFillMinusSquare} from 'react-icons/ai'
import "./orderStyle.css";
 import {
    Modal,
    Box,
    ModalOverlay,
    Button,  Container,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    Input,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,Th,    Td,
    Select,
    TableContainer,
    TableCaption,
  } from '@chakra-ui/react'
  import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import ComponentToPrint from '../Components/ComponentToPrint';
import { MyContext } from '../App';
import { BiArrowBack } from 'react-icons/bi';
import axios from 'axios';


const ImageContainer=styled.div`
width:70px;
height:65px;
display:grid;
place-items:center;
overflow:hidden;
`
const Image=styled.img`
width: 100%;
height: 100%;
object-fit: cover;
`
const OrdersAndProds = styled.div`
display:flex;
height:100vh;
overfolw:auto;
`
const Prods = styled.div`
flex:1.34;
background:black;
display:flex;
justify-content:flex-start;
flex-direction:column;
align-items:space-evenly;
position:relative;
overflow:auto;
`
const ProdsHeader = styled.div`
z-index:1.5;
align-self:center;
margin-top:70px;
`
const ProdsFooter = styled.div`
height:100%;
overflow:auto;
`

function AlertDialogExample({item, products, tableInfo, currentOrderData, setSearch, notify, currentPath, db}) {
  //add order
  const [num,setNum]=useState(1);
  const [desc,setDesc]=useState("");
  //setprice
  const setprice=(e)=>{
    setNum(e.target.value);
  }

  const addProductToTable = (e) => {
    e.preventDefault();
      push(ref(db, `table/${currentPath.tableType}/${currentPath.tableNumber}`), {
        quantity:num + " " + item[1].addition,
        name:item[1].name,
        type:item[1].type,
        printable:item[1].printable,
        status:"добавил",
        total:item[1].price*num,
        desc
    });
    update(ref(db, `todo/${tableInfo[0]}`), {
      totalPrice: tableInfo[1].totalPrice + item[1].price*num
    })

    set(ref(db,"/notify"),{
      change:!notify.change,
      description:`${num} ${item[1].name} / ${currentPath.tableNumber}  cтол `,
      status:"success",
      title:"Заказ принят"
    })

    var productInfo = products.find(product => product[1].name === item[1].name && product[1].type === item[1].type)
    const {product_left, totalSale} = productInfo[1]
    update(ref(db, `product/${productInfo[0]}`), {
      product_left: Number(product_left) - Number(num),
      totalSale: Number(totalSale) + Number(num)
    })

    setSearch("")
    setDesc("");
    setNum(1);
  }
  const [displayInput, setDisplayInput]=useState(true)
  return (
    <Container>
      <Box color='whatsapp.100' >
        <form onSubmit={(e)=>addProductToTable(e)} >
          <Box display="flex" justifyContent="flex-end"  alignItems='center'  >
            <div  style={{flex:1,display:"flex",width:'127px',alignItems:"center"}} >
              <AiFillMinusSquare onClick={()=> {if(num>0){setNum(prev=>prev-1)}}} style={{cursor:"pointer",fontSize:"38px"}}  />
              <Input
                width='50px' isInvalid  errorBorderColor='blue.300'
                type='number'step="0.01"  onFocus={(e) => e.target.select()}
                value={num} onChange={(e)=>setprice(e)}
              />
              <BsPlusSquareFill onClick={()=>{setNum(prev=>prev+1)}} style={{cursor:"pointer",fontSize:"31px",marginRight:"5px"}} />
            </div>
            <Button type='submit' colorScheme='blue'>
              <AiOutlineArrowRight/>
            </Button>
            {displayInput?(
              <Button onClick={()=>{setDisplayInput(false)}} colorScheme='red' >
                <AiFillEdit/>
              </Button>
            ):(
              <Input flex={1}  m='10px'  width='50px' size='sm' placeholder='описание (не обязательно)' isInvalid  errorBorderColor='blue.300'  type='text' defaultValue={desc}     onChange={(e)=>setDesc(e.target.value)}  />
            )}
          </Box>
        </form>
      </Box>
    </Container>
  )
}

//   function BasicData({data,setTotalPrice,notify,setOrdersData}) {
//     const [items,setItems]=useState()
//     let location=useLocation().pathname.split("/")
//     const { isOpen, onOpen, onClose } = useDisclosure()
//     const [types,setTypes]=useState("Все");

//     const [displayIndex,setDisplayIndex]=useState(null)
//     const [search,setSearch]=useState("")
//     const changeDisplay=(index)=>{
//       setDisplayIndex(index)
//     }


//     return (
//       <Container >
//         {/* <Box display='flex' alignItems='center'pt='35px' justifyContent='space-between' > */}
//         <Button onClick={()=>setOpenMenu(true)} m="72px 0 10px 0 " colorScheme='blue' >Добавить продукт {location[2]} </Button>
//          {/* </Box> */}

//         <Modal scrollBehavior='inside' isOpen={openMenu} onClose={()=>setOpenMenu(false)}>
//           <ModalOverlay  colorScheme='red' />
//           <ModalContent background='rgb(10 25 41)'  >
//             <ModalHeader color='whatsapp.100' >
//             <Box display='flex' alignItems='center' justifyContent='space-evenly' >
//                   <Input style={{color:'white'}} maxWidth='200px' onChange={(e)=>setSearch(e.target.value)} value={search} placeholder='Найти' />
//                   <Select variant="outline" bg="wheat" color='black' onChange={(e)=>setTypes(e.target.value)} maxWidth='100px' size='xm'  placeholder='Тип' >

// <option value='Все'  >Все</option>
// <option value='Блюдо'  >Блюдо</option>
// <option value='Салат'  >Салат</option>
// <option value='Напиток'  >Напиток</option>
//   <option value='Хлеб'>Хлеб</option>
//   <option value='Другой'>Другой</option>
// </Select>
//               </Box>
//             </ModalHeader>
//             <ModalCloseButton />
//             <ModalBody color='whatsapp.100' >

//                 <Container>

//               {data.sort((a,b)=>a[1].popular===b[1].popular?0 : a[1].popular? -1 : 1).filter(filt=>filt[1].name.toLowerCase().includes(search.toLowerCase()))
//               .filter(item=>{
//       if(types!=="Все"){return item[1].type==types}
//       else{return item}
//     }).map((item,index)=>{

//       return(
//         <Box alignItems='center' m='12px' display='flex' justifyContent='space-around' key={item[0]}>
//         {displayIndex!==index?(
// <>
// <Image  src={item[1].url} />
//                   <h3 style={{flex:1, overflowWrap:"break-word" }} >{item[1].name}  </h3>
//                   <Button colorScheme='blue' onClick={()=>changeDisplay(index)} >Далее</Button>
//     </>
// ):(
//            <div onClick={()=>setItems(item)} >
//                   <AlertDialogExample search={search} setSearch={(e)=>setSearch(e)} setDisplayIndex={(e)=>setDisplayIndex(e)} notify={notify}   item={items}  open={open}  setOpen={(val)=>setOpen(val)}/>
//             </div>   )}
//                   </Box>
// )})}


//               </Container>
//             </ModalBody>

//             <ModalFooter>
//               <Button colorScheme='red' mr={3} onClick={()=>setOpenMenu(false)}>
//                 Закрыть
//               </Button>
//              </ModalFooter>
//           </ModalContent>
//         </Modal>
//       </Container>

//     )
//   }


const Orders = () => {
  const values = useContext(MyContext);
  const {ordersData, typeOfFood, printRef, single,
         setSingle, tablesData, db, products,
         setCheckData, checkData, statuses, notify, checkNumber
        } = values
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentOrderData,setCurrentOrderData] =useState([]);
  const [currentCheckNum, setCurrentCheckNum] = useState()
  const singleRef=useRef()
  const [currentPath, setCurrentPath] = useState({})
  const [tableInfo, setTableInfo] = useState([[],{tableNumber:0, totalPrice:0}])
  var windowPath = window.location.pathname.split('/')
  const navigate=useNavigate()

  useEffect(()=>{
    if(tablesData){
      var id = tablesData.find(item => {
        return item[1].tableNumber == windowPath[2] && item[1].tableType === windowPath[3]
      })

      setTableInfo(id)
    }
  },[tablesData])

  useEffect(()=>{
    setCurrentPath({
      tableType: windowPath[3],
      tableNumber: windowPath[2]
    })
    //get offline
    if(ordersData.length !==0){
      var firstStep = ordersData.find(item => item[0] === windowPath[3])
      if(firstStep){
        firstStep = firstStep[1]
        var secondStep = Object.values(firstStep)
        var lastStep = Object.entries(secondStep[0])
        let checkN = Object.values(secondStep[0])
        setCurrentCheckNum(checkN[checkN.length - 1].checkNumber)
        setCurrentOrderData(lastStep.reverse())
      }
    }
    else{
      const starCountRefs = ref(db, `table/${windowPath[3]}/${windowPath[2]}`);

      onValue(starCountRefs, (snapshot) => {
        let datas = snapshot.val()
        if(datas){
          setCurrentOrderData(Object.entries(datas))
        }
      });
    }

  },[])

  useEffect(()=>{
    if(ordersData.length !== 0){
      var firstStep = ordersData.find(item => item[0] === windowPath[3])
      if(firstStep){
        var secondStep = Object.entries(firstStep[1])
        var secondStepIndex = secondStep.findIndex(item => item[0] === windowPath[2]);
        if(secondStepIndex !== -1){
          var lastStep = Object.entries(secondStep[secondStepIndex][1])
          setCurrentOrderData(lastStep)
        }
      }
    }
  },[ordersData])

  useEffect(()=>{
    if(notify.status === 'warning' && notify.description.match(/\d+/)[0] === windowPath[2]){
      navigate('/tables')
    }
  },[notify])

  const statusChange=(item)=>{
    var itemRef = ref(db,`table/${currentPath.tableType}/${currentPath.tableNumber}/${item[0]}`);
    if(item[1].status == statuses[0]){
        update(itemRef,{
          status:statuses[1]
        })
    }
    else if(item[1].status==statuses[1]){
      update(itemRef,{
        status:statuses[2]
      })
    }
    else if(item[1].status === statuses[2]){
      update(itemRef, {
        status:statuses[3]
      })
    }
  }
  const deleteRow=(item)=>{

    remove(ref(db,`table/${currentPath.tableType}/${currentPath.tableNumber}/${item[0]}`))

    update(ref(db, `todo/${tableInfo[0]}`), {
      totalPrice: (tableInfo[1].totalPrice - item[1].total)
    })
    set(ref(db,"/notify"),{
      change:!notify.change,
      description:`${item[1].name} в ${currentPath.tableNumber} столе был удален!`,
      status:"error",
      title:"Заказ удален"
    })

    var productInfo = products.find(product => product[1].name === item[1].name && product[1].type === item[1].type)
    const {product_left, totalSale} = productInfo[1]
    var num = item[1].quantity.split(' ')[0]
    update(ref(db, `product/${productInfo[0]}`), {
      product_left: product_left + Number(num),
      totalSale: totalSale - Number(num)
    })
  }

  const closedTable=()=>{
    try {
      if(ordersData.length !==0){
        var firstStep = ordersData.find(item => item[0] === windowPath[3])
        if(firstStep){
          firstStep = firstStep[1]
          var secondStep = Object.values(firstStep)
          var checkNum = Object.values(secondStep[0])
          checkNum = checkNum[checkNum.length -1].checkNumber
          axios.post('http://localhost:5000/set-check', {checkNumber: checkNum,data: secondStep[0]})
        }
      }
      remove(ref(db,`table/${currentPath.tableType}/${currentPath.tableNumber}`))
      update(ref(db,"todo/"+tableInfo[0]),{
        status:"empty"
      })
    } catch (error) {
      alert(error)
    }
    checkData.length==1 && setCheckData([])

    set(ref(db,"/notify"),{
      change:!notify.change,
      description:`Стол ${currentPath.tableNumber} был закрыт `,
      status:"warning",
      title:"Заказ завершен"
    })
  }

  const handleChange=(item)=>{
    let description="."
    if(item.desc){
      description=item.desc
    }
    setSingle({
      name:item.name,
      desc:description,
      quantity:item.quantity,
      table:currentPath.tableNumber
    })
  }

  // useEffect(()=>{
  //   callNavigationFromNavbar.tableNumber && navigate(`/tables`)
  // },[callNavigationFromNavbar])
// add product
  const [items, setItems]=useState()
  const [types, setTypes]=useState("Все");
  const [search, setSearch]=useState("")

  return (
    <div style = {{height:'100vh',fontWeight:"500",overflow:'hidden',background:"#181f34f5" ,fontSize:"larger"}}>
      <div>
        <OrdersAndProds>
          <div style = {{flex:2,display:'flex', flexDirection:'column',}}>
            <div style={{display:'flex', marginTop:'70px', marginBottom:'10px', alignItems:'center'}}>
              <Button onClick={()=>navigate('/tables')} size='sm'>
                <BiArrowBack style={{fontSize:'28px'}} />
              </Button>
              <Button mx='35px' colorScheme={'red'} onClick={()=> closedTable()}>
              <ReactToPrint
                      trigger={() => <div>Закрыть стол {currentPath.tableNumber}</div> }
                      content={() => printRef.current}
                      />
              </Button>
              <ReactToPrint
                        trigger={() => <BsFillPrinterFill style={{cursor:"pointer",color:"green",fontSize:"25px"}}/>}
                        content={() => printRef.current}
                      />
            </div>
            <TableContainer style={{flexDirection:'column', fontWeight:'semi-bold', fontFamily:'sans-serif', overflow:'auto'}} background='#f2f2f2' >
              <Table variant='striped' bg='white'>
                <Tbody>
                  {currentOrderData.length !== 0 && currentOrderData.filter((item,ind)=>ind !== currentOrderData.length-1)
                                                      .map(item=>(
                    <Tr key={item[0]} >
                      <Td>{item[1].name}  {item[1].desc && ( <i style={{textWrap:"wrap",color:"red",}} >({item[1].desc})</i>)  }  </Td>
                      <Td isNumeric>{item[1].quantity}</Td>
                      <Td>
                        <Box display='flex' alignItems='center'>
                          <Button mr='14px' colorScheme={item[1].status==statuses[0]?"blue":item[1].status===statuses[1]?"yellow":item[1].status===statuses[2]?"pink":"green"}
                                  onClick={()=>statusChange(item)}>
                            {item[1].status}
                          </Button>
                          <AiFillDelete onDoubleClick={()=>deleteRow(item)}
                                        style={{cursor:"pointer",margin:"0 5px",color:"red",fontSize:"23px"}} />
                          {item[1].printable&&(
                            <div onClick={()=>{handleChange(item[1]) }} >
                              <ReactToPrint
                                trigger={() => <BsFillPrinterFill onClick={onOpen} style={{cursor:"pointer", color:"green", fontSize:"25px"}}/>}
                                content = {() => singleRef.current}
                              />
                            </div>
                          )}
                        </Box>
                      </Td>
                      <Td isNumeric>
                        {item[1].total} сум
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>
                      Cтол {currentPath.tableNumber}
                    </Th>
                    <Td>
                      {tableInfo[1].totalPrice} сум
                    </Td>
                  </Tr>
                </Tfoot>
                <Thead>
                  <Tr>
                    <Th>Итого: {tableInfo[1].totalPrice}</Th>
                    <Th isNumeric>Колич.</Th>
                    <Th >Статус</Th>
                    <Th isNumeric>Цена</Th>
                  </Tr>
                </Thead>
              </Table>
            </TableContainer>
          </div>
          <Prods>
            <ProdsHeader>
              <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-evenly'>
                <div style={{width:'200px', margin:'5px 0'}} class="input-group">
                  <div class="input-group-prepend">
                      <span class="input-group-text" id="inputGroup-sizing-default">Найти</span>
                  </div>
                  <input onChange={(e) => setSearch(e.target.value)} onFocus={(e) => e.target.select()} type="text" class="form-control" value={search} aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                </div>
                <div class="btn-group btn-group" role="group" aria-label="...">
                    {typeOfFood.map((item, ind) => (
                        <button onClick={() => setTypes(item)} type="button" key={ind} class={`btn btn-${types === item ? 'success' : 'secondary'}`}>
                          {item}
                        </button>
                    ))}
                    <button onClick={() => setTypes('Все')} type="button"
                            class={`btn btn-${types === 'Все' ? 'success' : 'secondary'}`}
                    >
                      Все
                    </button>
                </div>
              </Box>
            </ProdsHeader>
            <ProdsFooter>
              <Container>
                {products.sort((a,b)=>a[1].popular === b[1].popular?0 : a[1].popular? -1 : 1)
                         .filter(filt=>filt[1].name.toLowerCase().includes(search.toLowerCase()))
                         .filter(item=>{
                            if(types!=="Все"){return item[1].type==types}
                            else{return item}
                         }).map(item => (
                  <Box background='#16083d' color='white' my='12px' alignItems='center' display='flex' key={item[0]}>
                      <>
                        <ImageContainer>
                          <Image src={item[1].url} />
                        </ImageContainer>
                        <h3 style={{flex:1, overflowWrap:"break-word" }} >{item[1].name}  </h3>
                        <div onClick={()=>setItems(item)}>
                          <AlertDialogExample
                            products = {products}
                            tableInfo={tableInfo}
                            tablesData={tablesData}
                            ordersData={ordersData}
                            currentOrderData={currentOrderData}
                            currentPath={currentPath}
                            db={db}
                            search={search}
                            setSearch={(e)=>setSearch(e)}
                            notify={notify}
                            item={items}
                          />
                        </div>
                      </>
                  </Box>
                ))}
              </Container>
            </ProdsFooter>
          </Prods>
        </OrdersAndProds>
        <div id='for_print' style={{ display:'none' }}>
          <ComponentToPrint
            ref = {printRef}
            checkNumber = {currentCheckNum}
            totalPrice = {tableInfo[1].totalPrice}
            ordersData = {currentOrderData}
            tableNumber = {currentPath.tableNumber}
            tableType = {currentPath.tableType}
          />
        </div>
        <div id='for_print' style={{display:'none'}}>
          <table ref={singleRef} style={{margin:"70px 0 ",width:"375px",fontWeight:'bold',fontSize:"30px" ,color:'black' ,border:"2px solid black"}} >
            <thead>
              <tr style={{border:"2px solid black"}}>
                <th>Имя</th>
                <th style={{border:"2px solid black"}}>Кол.</th>
                <th>Стол</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{padding:"13px 0",border:"2px solid black"}} >
                <td>{single.name}</td>
                <td style={{border:"2px solid black"}} >{single.quantity}</td>
                <td>{single.table}</td>
              </tr>
            </tbody>
            <p style={{fontSize:"22px"}} ><i>{single.desc}</i></p>
          </table>
        </div>
      </div>
    </div>
  )}

export default Orders
