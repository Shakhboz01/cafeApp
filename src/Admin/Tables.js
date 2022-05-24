// It should have colors "green-пусто brown-зайнят yellow-желтый"
//it should display Time(when created) Print,Number of people,Total amount,Time of start(if color is yellow)  
// Finish button and make it green
// order beforehand button and display Time of event and Number of people (not required)


import React,{useState,useEffect} from 'react'
import { getDatabase,onValue,remove, ref, set, update } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import styled from '@emotion/styled';
import { Button } from '@chakra-ui/react';
import {Menu,MenuButton,MenuList,MenuItem,  } from '@chakra-ui/react';
import firebase from '../firebase.config';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Input
  } from '@chakra-ui/react'

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

const Alert=({orderId,numberOfPeople,setNumberOfPeople,tableNumber,children})=>{
    
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
            totalPrice:0
        });
        update(ref(db,'todo/'+orderId),{
          status:'full'
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

          <AlertDialogBody>
            <Input variant='filled' onChange={(e)=>setNumberOfPeople(e.target.value)} defaultValue={numberOfPeople} required type='number'  />
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

const Tables = ({tablesData}) => {
  const [numberOfPeople,setNumberOfPeople]=useState(1)
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
      if(tablesData.filter(item=>item[1].tableNumber==tableNumber).length==0){
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
      else{
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
 let color="green";
if(status==position[0]){
    color="green"
}
else if(status==position[1]){
    color='brown'
}
else{color='red'}

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
      return (
    
        <div style={{height:"100vh",background:"black"}} >
          <Button m="25px" onClick={()=>setShow(!show)} >{show?"Закрыть":"Добавить стол"}</Button>
          {show&&(
            <form style={{display:"flex",flexDirection:"column"}} onSubmit={(e)=>handleSubmit(e)}  >
            <Input required placeholder='Номер стола' onChange={(e)=>setTableNumber(e.target.value)} defaultValue={tableNumber} name="number" type='number'/>
            <Input   placeholder='Название стола(не обязательно)' onChange={(e)=>setTitle(e.target.value)} defaultValue={title} type='text' name='title'/>
            <Button colorScheme='blue' type='submit' >Добавить</Button>
          </form>
          )}
          
          
<Container>


{ tablesData && tablesData.map(item=>{
    return(
        <Contain status={item[1].status} key={item[0]} >

            <Table>
               <h1 style={{color:"white",fontWeight:"bold"}} > {item[1].tableNumber}</h1>
            <Menu style={{position:'absolute',bottom:0,right:0 }} >
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

    <Alert  numberOfPeople={numberOfPeople} setNumberOfPeople={(e)=>setNumberOfPeople(e)} orderId={item[1].id} tableNumber={item[1].tableNumber} >Создать</Alert>
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