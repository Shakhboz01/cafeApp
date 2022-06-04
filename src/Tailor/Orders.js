import React, { useEffect,useRef, useState } from 'react'
import {  useLocation } from 'react-router-dom'
import { getDatabase,push,onValue,remove, ref, set, update } from "firebase/database";
import ReactToPrint from 'react-to-print';
import {AiFillDelete, AiFillEdit, AiOutlineArrowRight} from 'react-icons/ai'
import  styled from 'styled-components'
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
  } from '@chakra-ui/react'
  import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import BasicUsage from '../Components/ComponentToPrint';

const Image=styled.img`
width:90px;
height:80px;
object-fit:cover;
`

let number=0;
function AlertDialogExample({item,notify,setDisplayIndex,open,setOpen,children}) {

     const cancelRef = React.useRef()
     const db=getDatabase()



      //add order
       const [num,setNum]=useState(1);
      const [desc,setDesc]=useState("");
  let location;
 let id=uuidv4()

useEffect(()=>{
location=window.location.pathname.split("/")
// onValue(starCountRefs, (snapshot) => {
//   let datas=snapshot.val()
//   if(snapshot.val()){
//      setOrdersData( Object.entries(datas))
// number=0
// for(let i=0;i<Object.values(datas).length-1;i++){
// number+=parseInt(Object.values(datas)[i].total)
// }
//    setTotalPrice(number)
//    number=0
// }
// });

},[])

//setprice
const setprice=(e)=>{
  setNum(e.target.value);
  }

    const handleSubmit=(e)=>{
      e.preventDefault()
        push(ref(db, 'table/'+window.location.pathname.split("/")[2]), {
         quantity:num +" "+item[1].addition,
         name:item[1].name,
         type:item[1].type,
         printable:item[1].printable,
         status:"добавил",
         total:item[1].price*num,
         desc,
          id
      });

      set(ref(db,"/notify"),{
        change:!notify.change,
        description:`${num} ${item[1].name} / ${window.location.pathname.split("/")[2]}  cтол `,
        status:"success",
        title:"Заказ принят"
      })
      setDisplayIndex(null)

      // const starCountRefs = ref(db, "table/"+window.location.pathname.split("/")[2]);

  //     onValue(starCountRefs, (snapshot) => {
  //       let datas=snapshot.val()
  //       if(snapshot.val()){
  //          setOrdersData( Object.entries(datas))
  // number=0
  // for(let i=0;i<Object.values(ordersData).length-1;i++){
  //   number+=parseInt(Object.values(datas)[i].total)
  // }
  //        setTotalPrice(number)
  //        number=0
  //     }
  //   });



    setDesc("");
    setNum(1);
    setOpen(false)

  }
  const [displayInput,setDisplayInput]=useState(true)
    return (
      <Container>
        {/* <Button background='blue' onClick={()=>setOpen(true) }>
          Далее
        </Button> */}

        {/* <AlertDialog
          isOpen={open}
          
          onClose={()=>setOpen(false)}
          background='rgb(26 32 44)'

        > */}
          <Box color='whatsapp.100' >
            {/* <AlertDialogContent background='rgb(26 32 44)' > */}
              {/* <AlertDialogHeader  fontSize='lg' fontWeight='bold'>
                Количество
              </AlertDialogHeader> */}
              <form onSubmit={(e)=>handleSubmit(e)} >

              <Box display="flex" justifyContent="space-around"  alignItems='center'  >
                <div  style={{flex:1,display:"flex",width:'167px',alignItems:"center"}} >
                <BsPlusSquareFill onClick={()=>{setNum(prev=>prev+1)}} style={{cursor:"pointer",fontSize:"30px",marginRight:"5px"}} />
                <Input   width='55px'   isInvalid  errorBorderColor='blue.300' type='number'step="0.01"    value={num} onChange={(e)=>setprice(e)} />
                <AiFillMinusSquare onClick={()=> {if(num>0){setNum(prev=>prev-1)}}} style={{cursor:"pointer",fontSize:"38px"}}  />
                </div>
                  {displayInput?(
                    <Button onClick={()=>setDisplayInput(false)} colorScheme='red' >
                    <AiFillEdit/>
                    </Button>
                  ):(
                  <Input flex={1}  m='10px'  width='50px' size='sm' placeholder='описание (не обязательно)' isInvalid  errorBorderColor='blue.300'  type='text' defaultValue={desc}     onChange={(e)=>setDesc(e.target.value)}  />
                  )}
                  <Button  type='submit'   colorScheme='blue'  >
              <AiOutlineArrowRight/>
                </Button>
              </Box>
              
              {/* <AlertDialogFooter>
                <Button ref={cancelRef} background='red.500' color='white' onClick={()=>setOpen(false)}>
                  Отмена
                </Button>
                <Button type='submit'   colorScheme='blue'  ml={3}>
                  Добавить
                </Button>
              </AlertDialogFooter> */}
                </form>
            {/* </AlertDialogContent> */}
          </Box>
        {/* </AlertDialog> */}
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
    const [displayIndex,setDisplayIndex]=useState(null)
    const changeDisplay=(index)=>{
setDisplayIndex(index)
    }
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
    }).map((item,index)=>{

      return(
        <Box alignItems='center' m='12px' display='flex' justifyContent='space-around' key={item[0]}>
        {displayIndex!==index?(
<>
<Image  src={item[1].url} />
                  <h3 style={{flex:1, overflowWrap:"break-word" }} >{item[1].name}  </h3>
                  <Button colorScheme='blue' onClick={()=>changeDisplay(index)} >Далее</Button>
    </>
):(
           <div onClick={()=>setItems(item)} >

                  <AlertDialogExample setDisplayIndex={(e)=>setDisplayIndex(e)} notify={notify}   item={items}  open={open}  setOpen={(val)=>setOpen(val)}/>
          </div>   
)}
                  

                  </Box>
      )
                  
  })}
      

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


const Orders = ({setOpen,specialProducts,checkData,setCheckData,notify,statuses}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
    let location=useLocation().pathname.split("/")
    const [object,setObject]=useState({})
    const [data,setData]=useState([]);
    const [ordersData,setOrdersData]=useState([]);
    const [totalPrice,setTotalPrice]=useState(0);
    const db=getDatabase();

    const starCountRefs = ref(db, "table/"+location[2]);
  const navigate=useNavigate()
    useEffect(()=>{
      const starCountRef = ref(db, 'product/');
      setOpen(true)

      //getAvailableProducts
    setObject({
        id:location[2],
        tableNumber:location[3],
    })
    onValue(starCountRefs, (snapshot) => {
      let datas=snapshot.val()
      if(snapshot.val()){
         setOrdersData( Object.entries(datas))
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
else if(item[1].status===statuses[2]){
  update(ref(db,'table/'+location[2]+"/"+item[0]),{
    status:statuses[3]
  })
}
}
const deleteRow=(item)=>{
  remove(ref(db, 'table/'+location[2]+"/"+item[0]))

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
  remove(ref(db, 'table/'+location[2]))
  if(checkData.length==1){
    setCheckData([])
  }
  set(ref(db,"/notify"),{
    change:!notify.change,
    description:`Стол ${location[2]}  был закрыт `,
    status:"warning",
    title:"Заказ завершен "
  })


  navigate("/")


}

const componentRef = useRef();
const singleRef=useRef()
const [single,setSingle]=useState({})

const handleChange=(item)=>{
  let description="."
  if(item.desc){
    description=item.desc
  }
  setSingle({
    name:item.name,
    desc:description,
    quantity:item.quantity,
    table:location[2]
  })
}


  return (
    <div style={{height:'100vh',fontWeight:"500",background:"#181f34f5" ,fontSize:"larger" ,}} >
      <BasicData  notify={notify}   setTotalPrice={(e)=>setTotalPrice(e)} setOrdersData={(e)=>setOrdersData(e)} ordersData={ordersData} totalPrice={totalPrice}   data={specialProducts} />
      <div>

            <TableContainer background='#ae9de2' >
  <Table variant='striped' colorScheme='teal'>
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
        <Td>
         <Box display='flex' alignItems='center'>
          <Button mr='14px' colorScheme={item[1].status==statuses[0]?"blue":item[1].status===statuses[1]?"yellow":item[1].status===statuses[2]?"pink":"green"} onClick={()=>statusChange(item)}   > {item[1].status}</Button>

          <AiFillDelete onDoubleClick={()=>deleteRow(item)} style={{cursor:"pointer",margin:"0 5px",color:"red",fontSize:"23px"}} />
          {item[1].printable&&(
            <div onClick={()=>{handleChange(item[1]); console.log(single) }} >
<BsFillPrinterFill onClick={onOpen} style={{cursor:"pointer",color:"green",fontSize:"25px"}} />

            </div>

          )}
         </Box>
        </Td>
        <Td >{item[1].total} сум</Td>

      </Tr>
        ))}

</Tbody>
    <Tfoot>
      <Tr>
        <Th><Button colorScheme='red' onDoubleClick={()=>{closedTable()}} > Закрыть стол </Button></Th>
        <Th>
      </Th>
        <Th >        <Button colorScheme='gray' >  <BasicUsage setTotalPrice={(e)=>setTotalPrice(e)} totalPrice={totalPrice} ordersData={ordersData} ref={componentRef} >  <BsFillPrinterFill style={{cursor:"pointer",color:"green",fontSize:"25px"}} /></BasicUsage> </Button></Th>
      </Tr>
    </Tfoot>
  </Table>
</TableContainer>
<div>

<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />

          <table   style={{margin:"70px 0 ",width:"375px",fontWeight:'bold',fontSize:"30px" ,color:'black' ,border:"2px solid black"}} ref={singleRef} >
    <thead>
      <tr style={{border:"2px solid black"}} >
        <th>Имя</th>
        <th style={{border:"2px solid black"}} >Кол.</th>
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
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Закрыть
            </Button>
            <ReactToPrint
            onClick={onClose}
            trigger={() => <Button colorScheme="blue" variant='ghost'>Печатать</Button>}
            content={() => singleRef.current}

            />

          </ModalFooter>
        </ModalContent>
      </Modal>


</div>
      </div>
    </div>
  )
}

export default Orders
