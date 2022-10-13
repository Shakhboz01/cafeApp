

import React,{useContext, useState} from 'react'
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
    Input,
    Select
  } from '@chakra-ui/react'
import { useEffect } from 'react';
import { MyContext } from '../App';

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

const Alert=({orderId,notify, numberOfPeople, setNumberOfPeople,tableNumber,children})=>{
    const db=getDatabase();
    let id=uuidv4()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const navigate=useNavigate();
    let today=new Date()


    const createTable=()=>{
        set(ref(db, 'table/'+tableNumber), {
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

const Tables = () => {
  const values = useContext(MyContext);
  const {typeOfTables, tablesData, numberOfPeople, notify, setNumberOfPeople} = values;
  const position= ['empty','booked','full']
  let id=uuidv4()
  const db = getDatabase();
  const [specifyRow, setSpecifyRow]=useState("")
  const [title, setTitle]=useState("")
  const [tableNumber, setTableNumber]=useState(null)
  const [tableType, setTableType]=useState('')
  const [updatingTable, setUpdatingTable] = useState(false)
  const [show,setShow]=useState(false)


//get
//**get */


//create
    const createNewTable=(e)=>{
      e.preventDefault()
       if( !tablesData || tablesData.filter(item => item[1].tableNumber==tableNumber).length==0){
        set(ref(db, 'todo/'+id), {
          title, tableNumber, tableType, id,
          status:position[0]
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
    setTableType(item[1].tableType)
    setUpdatingTable(true);
    setShow(true);
    window.scrollTo(0,0);
}
const updateData=(e)=>{
  e.preventDefault()

  update(ref(db,'todo/'+ specifyRow),{
    title, tableNumber, tableType
  })
  setSpecifyRow(""); setTableType(typeOfTables[0]);
  setTableNumber(null); setTitle('');
  setShow(false);
  setUpdatingTable(false);
}
 /* update*/


 //updateStatus


const changeStatus=(prop,item)=>{
    if(prop==position[1]){
        update(ref(db,'todo/'+item[1].id),{
            status:position[1]
    })
    }
    else if(prop==position[2]){
        update(ref(db,'todo/'+item[1].id),{
            status:position[2]
    })
}
else if(prop==position[0]){
    update(ref(db,'todo/'+item[1].id),{
        status:position[0]
})
}
}
const navigate=useNavigate()
const redirect=(item)=>{
  navigate("/order/"+item[1].tableNumber+"/"+numberOfPeople+"/"+item[0])
}


      return (

        <div style={{ background:"black"}} >
          <Button m="70px 10px 10px 10px" onClick={()=> setShow(!show)} >{show?"-":"+"}</Button>
          {show&&(
            <form style={{color:"white",display:"flex",flexDirection:"column"}} onSubmit={(e)=> updatingTable ? updateData(e) : createNewTable(e) }  >
            <Input defaultValue = {tableNumber} required placeholder='Номер стола' onChange={(e)=>setTableNumber(e.target.value)} name="number" type='number'/>
            <Input placeholder='Название стола(не обязательно)' defaultValue={title} onChange={(e)=>setTitle(e.target.value)} type='text' name='title'/>
            <Select defaultValue={tableType} onChange = {(e) => setTableType(e.target.value)} placeholder='Тип'>
              {typeOfTables.map((item,ind) => (
                <option key = {ind} value = {item}>{item}</option>
              ))}
            </Select>
            <Button colorScheme='blue' type='submit' > {updatingTable ? 'Редактировать' : 'Добавить'}</Button>
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
            </Table>
        </Contain>
    )
  })}
  </Container>
        </div>
      )


}
export default Tables
