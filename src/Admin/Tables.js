

import React,{useState} from 'react'
import { getDatabase,remove, ref, set, update } from "firebase/database";
import {AiFillMinusSquare} from 'react-icons/ai'
import { BsPlusSquareFill} from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import {
  Menu,MenuButton,MenuList,MenuItem,
  Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Input
  } from '@chakra-ui/react'
import { useEffect } from 'react';

//style
const Container=styled.div`
display:grid;
grid-gap:15px;
grid-template-columns:1fr 1fr 1fr;
`
const Table=styled.div`
width:100%;
display:flex;
justify-content:center;
position:relative;
`
const Contain=styled.div`
height:150px;
display:flex;
align-items:center;
justify-content:center;
background:${prop=>{
    switch (prop.status) {
        case 'empty':
            return 'green'
            break;
        case 'booked':
        return 'brown'
        break;
        case 'full':
            return 'red'
        default:
            return 'green'

    }
}}

`

const Alert=({orderId,notify,numberOfPeople,setNumberOfPeople,tableNumber,children})=>{
    const db=getDatabase();
    let id=uuidv4()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const navigate=useNavigate();
    let today=new Date()


    const createTable=()=>{
        set(ref(db, 'table/'+tableNumber+'/orders'), {
             tableNumber,
            numberOfPeople,
            status:"active",
             id,
             start:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+" / "+today.getHours() + ":" + today.getMinutes(),

        });
        update(ref(db,'todo/'+orderId),{
          status:'full'
  })
  set(ref(db,"/notify"),{
    change:!notify.change,
    title:"Новый стол",
    description:`Номер: ${tableNumber} .Количество людей: ${numberOfPeople},`,
    status:"info"
  })
    navigate("/order/"+tableNumber+"/"+numberOfPeople+"/"+orderId)
    }

  return (
    <div style={{backgroundColor:"black"}} >
    <Button colorScheme='red' onClick={onOpen}>
    {children}
    </Button>

    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
          Укажите количество людей
          </AlertDialogHeader>

          <AlertDialogBody display='flex' alignItems='center' >
          <BsPlusSquareFill onClick={()=>{setNumberOfPeople(prev=>prev+1)}} style={{cursor:"pointer",fontSize:"35px",marginRight:"10px"}} />
            <Input  autoFocus m='10px'  width='150px' size='sm' variant='filled' onChange={(e)=>setNumberOfPeople(e.target.value)} value={numberOfPeople} required type='number'  />
            <AiFillMinusSquare onClick={()=> {if(numberOfPeople>0){setNumberOfPeople(prev=>prev-1)}}} style={{cursor:"pointer",fontSize:"44px"}}  />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Отмена
            </Button>
            <Button colorScheme='red' onClick={()=>createTable()} ml={3}>
              Дальше
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  </div>
  );

}


//**style */

const Tables = ({tablesData, numberOfPeople, notify, setNumberOfPeople}) => {
    const position=['empty','booked','full']
    let id=uuidv4()
    const db = getDatabase();
     const [specifyRow,setSpecifyRow]=useState("")
    const [title,setTitle]=useState("")
    const [tableNumber,setTableNumber]=useState(null)
    const [status,setStatus]=useState(position[0]);


//get
//**get */


//create
    const handleSubmit=(e)=>{
      e.preventDefault()
       if( !tablesData || tablesData.filter(item=>item[1].tableNumber==tableNumber).length==0){
        set(ref(db, 'todo/'+id), {
          title,
           tableNumber,
           status:position[0],
          id,
      });
      setTitle("")
      setTableNumber(null)
      setShow(false)
       }

       else  {
        alert("Уже есть стол с таким номером")
      }


    }


//delete
const removeData=(id)=>{
    remove(ref(db, 'todo/'+id))
}

//update
const setRow=(item)=>{
    setSpecifyRow(item[1].id)
    setTitle(item[1].title)
    setTableNumber(item[1].tableNumber)
}
const updateData=(e,item)=>{
    e.preventDefault()

    update(ref(db,'todo/'+item[1].id),{
        title,tableNumber
})
setSpecifyRow("")
}
 /* update*/


 //updateStatus


const changeStatus=(prop,item)=>{
    if(prop==position[1]){
        setStatus(position[1]);
        update(ref(db,'todo/'+item[1].id),{
            status:position[1]
    })
     }
    else if(prop==position[2]){
        setStatus(position[2]);
        update(ref(db,'todo/'+item[1].id),{
            status:position[2]
    })


}
else if(prop==position[0]){
    setStatus(position[0]);
    update(ref(db,'todo/'+item[1].id),{
        status:position[0]
})
}
}
const navigate=useNavigate()
const redirect=(item)=>{
  navigate("/order/"+item[1].tableNumber+"/"+numberOfPeople+"/"+item[0])
}

const [show,setShow]=useState(false)
let array=[]
let newArray=[]
useEffect(()=>{
if(tablesData){
  for (var i=0;i<tablesData.length;i++){
   array.push( tablesData[i][1].tableNumber)
  }
}
newArray.push(array.sort((a,b)=>a-b))
},[])
      return (

        <div style={{ background:"black"}} >
          <Button m="70px 10px 10px 10px " onClick={()=>setShow(!show)} >{show?"Закрыть":"Добавить стол"}</Button>
          {show&&(
            <form style={{color:"white",display:"flex",flexDirection:"column"}} onSubmit={(e)=>handleSubmit(e)}  >
            <Input required placeholder='Номер стола' onChange={(e)=>setTableNumber(e.target.value)} defaultValue={tableNumber} name="number" type='number'/>
            <Input   placeholder='Название стола(не обязательно)' onChange={(e)=>setTitle(e.target.value)} defaultValue={title} type='text' name='title'/>
            <Button colorScheme='blue' type='submit' >Добавить</Button>
          </form>
          )}


<Container>


{ tablesData && tablesData.sort((a,b)=>a[1].tableNumber-b[1].tableNumber).map(item=>{
    return(
        <Contain status={item[1].status} key={item[0]} >

            <Table position='absolute' >
               <h1 style={{color:"white",fontWeight:"bold"}} > {item[1].tableNumber}</h1>

               {item[1].title&&(
                 <h2  style={{margin:"0 8px",color:"white"}} >{item[1].title}</h2>
               )}
            <Menu position='absolute' bottom="0" right='0'  >
  <MenuButton as={Button} >
    :
  </MenuButton>
  <MenuList>
      {item[1].status==position[0]&&(
<>
    <MenuItem  onClick={()=>setRow(item)} >Редактировать</MenuItem>
    <MenuItem onClick={()=>removeData(item[1].id)} >Удалить</MenuItem>
</>
      )}
    {item[1].status!==position[2]&&(
      <div  >

    <Alert notify={notify} numberOfPeople={numberOfPeople} setNumberOfPeople={(e)=>setNumberOfPeople(e)} orderId={item[1].id} tableNumber={item[1].tableNumber} >Создать</Alert>
      </div>
    )}
    {item[1].status!==position[2] &&(
    <MenuItem  onClick={()=>changeStatus(position[1],item)}>Занятать</MenuItem>
    )}
    {item[1].status!==position[0]  &&(
      <>
    <MenuItem  onClick={()=>redirect(item)}>Посмотреть</MenuItem>
      </>
    )}

  </MenuList>
</Menu>


            {specifyRow==item[1].id &&(
                 <form onSubmit={(e)=>updateData(e,item)}  >
                   <input defaultValue={title} required onChange={(e)=>setTitle(e.target.value)} type='text' name='title'/>
                   <input  defaultValue={tableNumber} required onChange={(e)=>setTableNumber(e.target.value)}  type='number'/>
                   <button type='submit' >Submit</button>
                 </form>
            )}
            </Table>
        </Contain>
    )
  })}
  </Container>
        </div>
      )


}
export default Tables
