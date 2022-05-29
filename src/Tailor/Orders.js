import React, { useEffect,useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getDatabase,push,onValue,remove, ref, set, update } from "firebase/database";
import { Button, Center, Container } from '@chakra-ui/react';
import {AiFillDelete} from 'react-icons/ai'
import  styled from 'styled-components'
import {Box} from "@chakra-ui/react"
import {BsFillPrinterFill, BsPlusSquareFill} from 'react-icons/bs'
import {AiFillMinusSquare} from 'react-icons/ai'
import "./orderStyle.css";
 import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Portal,
    useDisclosure,
    Popover,PopoverTrigger,PopoverContent,PopoverHeader,PopoverBody,PopoverFooter,PopoverArrow,  PopoverCloseButton,  PopoverAnchor,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Input,
    Table,
    Thead,
    Tbody,
    useToast,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Select,
    TableContainer,
  } from '@chakra-ui/react'
  import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import BasicUsage from '../Components/ComponentToPrint';
const Contain=styled.div`
display:flex;
flex-direction:column;
`
const Image=styled.img`
width:90px;
height:80px;
object-fit:cover;
`

let number=0;
function AlertDialogExample({item,notify,setTotalPrice,setOrdersData,open,setOpen,children}) {
  
     const cancelRef = React.useRef()
     const db=getDatabase()
     

 
      //add order
       const [num,setNum]=useState(1);
      const [desc,setDesc]=useState("");
      const [price,setPrice]=useState(0);
  let location;
 let id=uuidv4()
useEffect(()=>{
location=window.location.pathname.split("/")
},[])

//setprice
const setprice=(e)=>{
  setNum(e.target.value);
  setPrice(num*item[1].price)
  }

    const handleSubmit=(e)=>{
      e.preventDefault()
        push(ref(db, 'table/'+window.location.pathname.split("/")[2]), {
         quantity:num +" "+item[1].addition,
         name:item[1].name,
         type:item[1].type,
         status:"добавил",
         total:item[1].price*num,
         desc,
          id
      });
      set(ref(db,"/notify"),{
        change:!notify.change,
        description:`${num} ${item[1].name} / ${window.location.pathname.split("/")[2]}  cтол `,
        status:"success",
        title:"Заказ принят "
      })
      console.log(notify)
    

     

      const starCountRefs = ref(db, "table/"+window.location.pathname.split("/")[2]);
       onValue(starCountRefs, (snapshot) => {
        let datas=snapshot.val()
        if(snapshot.val()){
           setOrdersData( Object.entries(datas))
  
  for(let i=0;i<Object.values(datas).length-1;i++){
    number+=parseInt(Object.values(datas)[i].total)
  }
         setTotalPrice(number)
      }
    });
    setDesc("");
    setNum(1);
    setOpen(false)
      // update(ref(db,'table/'+location[2]+"/orders"),{
      //   totalPrice:totalPrice+price
      // })
  }
    return (
      <Container>
        <Button background='blue' onClick={()=>setOpen(true) }>
          {children}
        </Button>
  
        <AlertDialog
          isOpen={open}
          leastDestructiveRef={cancelRef}
          onClose={()=>setOpen(false)}
          background='rgb(26 32 44)'
          
        >
          <AlertDialogOverlay color='whatsapp.100' >
            <AlertDialogContent background='rgb(26 32 44)' >
              <AlertDialogHeader  fontSize='lg' fontWeight='bold'>
                Количество 
              </AlertDialogHeader>
              <form onSubmit={(e)=>handleSubmit(e)} >

              <AlertDialogBody   >
                <div style={{display:"flex",width:'167px',alignItems:"center"}} >
                <BsPlusSquareFill onClick={()=>{setNum(prev=>prev+1)}} style={{cursor:"pointer",fontSize:"35px",marginRight:"10px"}} />
                <Input m='10px'  size='xs'  placeholder='количество' isInvalid  errorBorderColor='blue.300' type='number'step="0.01"   value={num} onChange={(e)=>setprice(e)} />
                <AiFillMinusSquare onClick={()=> {if(num>0){setNum(prev=>prev-1)}}} style={{cursor:"pointer",fontSize:"44px"}}  />
                </div>
                  <Input  m='10px'  width='150px' size='sm' placeholder='описание (не обязательно)' isInvalid  errorBorderColor='blue.300'  type='text' defaultValue={desc}     onChange={(e)=>setDesc(e.target.value)}  />
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} background='red.500' color='white' onClick={()=>setOpen(false)}>
                  Отмена
                </Button>
                <Button type='submit'   colorScheme='blue'  ml={3}>
                  Добавить
                </Button>
              </AlertDialogFooter>
                </form>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    )
  }

  function BasicData({data,setTotalPrice,notify,setOrdersData}) {
    const [items,setItems]=useState()
    let location=useLocation().pathname.split("/")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [open,setOpen]=useState(false);
    const [types,setTypes]=useState("Все");
    const [search,setSearch]=useState("");
    return (
      <Container >
        <Box display='flex' alignItems='center'pt='35px' justifyContent='space-between' >
        <Button onClick={onOpen} colorScheme='blue' >Добавить продукт</Button>
         </Box>
  
        <Modal  isOpen={isOpen} onClose={onClose}>
          <ModalOverlay  colorScheme='red' />
          <ModalContent background='rgb(10 25 41)'  >
            <ModalHeader color='whatsapp.100' >Стол {location[2]} </ModalHeader>
            <ModalCloseButton />
            <ModalBody color='whatsapp.100' >
              <Box display='flex' alignItems='center' justifyContent='space-evenly' >
                  <Input maxWidth='200px' onChange={(e)=>setSearch(e.target.value)} placeholder='Найти' />
                  <Select variant="outline" bg="wheat" color='black' onChange={(e)=>setTypes(e.target.value)} maxWidth='100px' size='xm'  placeholder='Тип' >
                     
<option value='Все'  >Все</option>
<option value='Блюдо'  >Блюдо</option>
<option value='Салат'  >Салат</option>
<option value='Напиток'  >Напиток</option>
  <option value='Хлеб'>Хлеб</option>
  <option value='Другой'>Другой</option>
</Select>
              </Box>
              <hr style={{color:"white"}} />
                <Container>

              {data.filter(filt=>filt[1].name.toLowerCase().includes(search.toLowerCase()))
              .filter(item=>{
      if(types!=="Все"){return item[1].type==types}
      else{return item}
    }).map(item=>(
                  <Box alignItems='center' m='12px' display='flex' justifyContent='space-around' key={item[0]}>
                  <Image  src={item[1].url} />
                  <h3>{item[1].name} ({item[1].price}) </h3>

          <div onClick={()=>setItems(item)} >

                  <AlertDialogExample notify={notify}  setTotalPrice={setTotalPrice} setOrdersData={setOrdersData} item={items}  open={open}  setOpen={(val)=>setOpen(val)}>Далее</AlertDialogExample>
          </div>    
                  </Box>
              ))}
              
              </Container>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Закрыть
              </Button>
             </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    )
  }


const Orders = ({setOpen,notify,statuses}) => {
    let location=useLocation().pathname.split("/")
    const [object,setObject]=useState({})
    const [data,setData]=useState([]);
    const [ordersData,setOrdersData]=useState([]);
    const [totalPrice,setTotalPrice]=useState(0);
    const db=getDatabase();
const [ids,setIds]=useState([])

    const starCountRefs = ref(db, "table/"+location[2]);
  const navigate=useNavigate()
    useEffect(()=>{
      const starCountRef = ref(db, 'product/');
      setOpen(true)
      //getOrders
    //   onValue(starCountRefs, (snapshot) => {
    //       let datas=snapshot.val()
    //       if(snapshot.val()){
    //          setOrdersData( Object.values(datas))
    // let number=0;
    // for(let i=0;i<Object.values(datas).length-1;i++){
    //   number+=parseInt(Object.values(datas)[i].total)
    // }
    //        setTotalPrice(number)
    //     }
    //   });
      //getAvailableProducts
    setObject({
        id:location[2],
        tableNumber:location[3],
    })
    onValue(starCountRefs, (snapshot) => {
      let datas=snapshot.val()
      if(snapshot.val()){
         setOrdersData( Object.entries(datas))
        
for(let i=0;i<Object.values(datas).length-1;i++){
  number+=parseInt(Object.values(datas)[i].total)
}
       setTotalPrice(number)
       number=0
    }
  });

    onValue(starCountRef, (snapshot) => {

        let datas=snapshot.val()
        if(datas){
          
      setData (Object.entries(datas));
        }
        
    });
setOpen(false)
    },[])

const statusChange=(item)=>{
  if(item[1].status==statuses[0]){
      update(ref(db,'table/'+location[2]+"/"+item[0]),{
        status:statuses[1]
      })
  }
 else if(item[1].status==statuses[1]){
    update(ref(db,'table/'+location[2]+"/"+item[0]),{
      status:statuses[2]
    })
}
else if(item[1].status==statuses[2]){
  update(ref(db,'table/'+location[2]+"/"+item[0]),{
    status:statuses[3]
  })
}
}
const deleteRow=(item)=>{
  remove(ref(db, 'table/'+location[2]+"/"+item[0]))
  // setAlertData({
  //   show:true,
  //   title:`${item[1].name} в ${location[2]} столе был удален`,
  //   description:"",
  //   status:"error"
  // })
  // setTimeout(() => {
  //   setAlertData({show:false})
  // }, 5000);
  set(ref(db,"/notify"),{
    change:!notify.change,
    description:`${item[1].name} в ${location[2]} столе был удален!`,
    status:"error",
    title:"Заказ удален"
  })
}
//closeTable

const closedTable=()=>{
  update(ref(db,"todo/"+location[4]),{
    status:"empty"
  })
  set(ref(db,"/notify"),{
    change:!notify.change,
    description:`Стол ${location[2]}  был закрыт `,
    status:"warning",
    title:"Заказ завершен "
  })
 
  
  remove(ref(db, 'table/'+location[2]))


  navigate("/")

  
}

const componentRef = useRef();

  return (
    <div style={{height:'100vh',fontWeight:"500",background:"#181f34f5" ,fontSize:"larger" ,}} >
      <BasicData notify={notify}   setTotalPrice={(e)=>setTotalPrice(e)} setOrdersData={(e)=>setOrdersData(e)} ordersData={ordersData} totalPrice={totalPrice}   data={data} />
      <Center>{totalPrice}</Center>
      <div>
     
            <TableContainer background='#ae9de2' >
  <Table variant='striped' colorScheme='teal'>
    <TableCaption fontSize='lg' >{totalPrice}</TableCaption>
    <Thead>
      <Tr>
        <Th>Имя</Th>
        <Th>Колич.</Th>
        <Th >Статус</Th>
        <Th >Цена</Th>
      </Tr>
    </Thead>
    <Tbody>
      {ordersData.filter((item,ind)=>ind!==ordersData.length-1).map(item=>(
        <Tr key={item[0]} >
        <Td>{item[1].name}  {item[1].desc&&( <i style={{textWrap:"wrap",color:"red",}} >({item[1].desc})</i>)  }  </Td>
        <Td>{item[1].quantity}</Td>
        <Td> <Box display='flex' alignItems='center'>  <Button mr='14px' colorScheme={item[1].status==statuses[0]?"blue":item[1].status===statuses[1]?"yellow":item[1].status===statuses[2]?"pink":"green"} onClick={()=>statusChange(item)}   > {item[1].status}</Button>  <AiFillDelete onDoubleClick={()=>deleteRow(item)} style={{cursor:"pointer",color:"red",fontSize:"23px"}} /> </Box></Td>
        <Td >{item[1].total} сум</Td>

      </Tr>
        ))}
     
</Tbody>
    <Tfoot>
      <Tr>
        <Th><Button colorScheme='red' onDoubleClick={()=>{closedTable()}} > Закрыть стол </Button></Th>
        <Th> 
      </Th>
        <Th >        <Button colorScheme='gray' >  <BasicUsage totalPrice={totalPrice} ordersData={ordersData} ref={componentRef} >  <BsFillPrinterFill style={{cursor:"pointer",color:"green",fontSize:"25px"}} /></BasicUsage> </Button></Th>
      </Tr>
    </Tfoot>
  </Table>
</TableContainer>

      </div>
    </div>
  )
}

export default Orders
