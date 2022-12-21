import React, { useContext } from 'react'
import { Input, Select, useDisclosure } from '@chakra-ui/react'
import { getDatabase,remove, ref, set, update } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button
  } from '@chakra-ui/react'
import { MyContext } from '../App';


const AddTable = ({isOpen, onOpen, onClose, title,setTitle,tableNumber,updatingTable,setUpdatingTable,setTableNumber, specifyRow, setSpecifyRow, setTableType, tableType,children}) => {
  const cancelRef = React.useRef()
  const values = useContext(MyContext);
  const { tableStatuses, typeOfTables, db} = values;
  let id = uuidv4()

  const createNewTable=(e)=>{
    e.preventDefault();
    set(ref(db, 'todo/'+id), {
        title, tableNumber,
        tableType: tableType, id,
        status: tableStatuses[0]
    });
    setTitle("")
    onClose()
    setTableNumber(null)
  }

  const updateData=(e)=>{
    e.preventDefault()
    update(ref(db,'todo/'+ specifyRow),{
      title, tableNumber, tableType
    })
    setSpecifyRow(""); setTableType(typeOfTables[0]);
    setTableNumber(null); setTitle('');
    setUpdatingTable(false);
    onClose()
    }

  return (
    <div>
      <Button onClick={onOpen}>{children}</Button>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
        <form style={{color:"white", display:"flex", flexDirection:"column"}} onSubmit={(e)=> updatingTable ? updateData(e) : createNewTable(e)}  >
          <AlertDialogHeader color='black'>{updatingTable ? 'Изменить стол:' : 'Новый стол:' }</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
                <Input color={'black'} defaultValue = {tableNumber} required placeholder='Номер стола' onChange={(e)=>setTableNumber(e.target.value)} name="number" type='number'/>
                <Input color={'black'} placeholder='Название стола(не обязательно)' defaultValue={title} onChange={(e)=>setTitle(e.target.value)} type='text' name='title'/>
                <Select color={'black'} defaultValue={tableType} onChange = {(e) => setTableType(e.target.value)} placeholder='Тип'>
                {typeOfTables.map((item,ind) => (
                    <option key = {ind} value = {item}>{item}</option>
                ))}
                </Select>

          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme='red' ref={cancelRef} onClick={onClose}>
              Отменить
            </Button>
            <Button colorScheme='blue' type='submit'  ml={3}>
            {updatingTable ? 'Редактировать' : 'Добавить'}
            </Button>
          </AlertDialogFooter>
        </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AddTable
