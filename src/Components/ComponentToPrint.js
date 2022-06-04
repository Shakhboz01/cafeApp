import React,{useRef,useEffect } from "react";
import { useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    ModalCloseButton,Button} from  "@chakra-ui/react"
    import ReactToPrint from 'react-to-print';

import { getDatabase,onValue,ref } from "firebase/database";

function BasicUsage({setTotalPrice,ordersData,totalPrice,children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
      let number=0
    useEffect(()=>{
      const db=getDatabase()
      const starCountRefs = ref(db, "table/"+window.location.pathname.split("/")[2]);


    onValue(starCountRefs, (snapshot) => {
    let datas=snapshot.val()
    if(snapshot.val()){
    number=0
    for(let i=0;i<Object.values(datas).length-1;i++){
    number+=parseInt(Object.values(datas)[i].total)
    }
    setTotalPrice(number)

    number=0
    }
    });

    },[isOpen])

  const componentRef=useRef()
    return (
      <>
        <Button onClick={onOpen}>{children}</Button>
  
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader><ReactToPrint
        trigger={() => <Button colorScheme='blue' >Вывести чек</Button>}
        content={() => componentRef.current}
      /></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              
              <Table color='black' fontWeight="semibold" width='377px' fontSize="xl"   ref={componentRef} >
              
              <TableCaption fontSize='xg' color='black' m='0' fontWeight='bold'>Спасибо что выбрали нас!</TableCaption>
              
              <TableCaption fontSize='xg' color='black'm='0' fontWeight='bold'>90 195 99 92</TableCaption>
    <Thead fontSize='33px' color='black' >
    <Tr   fontWeight='bold'  border="2px solid black"  >
        <Th fontSize='38px' colSpan={3} textAlign='center' border="2px solid">ANOR CAFE</Th>
       </Tr>
      <Tr   fontWeight='bold' color='black' border="2px solid black"  >
        <Th border="2px solid">Имя</Th>
        <Th border="2px solid">Количество</Th>
        <Th border="2px solid" >Цена</Th>
       </Tr>
    </Thead>
    <Tbody border="2px solid" >
    {ordersData.filter((item,ind)=>ind!==ordersData.length-1).map(item=>(
        
        <Tr border="2px solid" key={item[0]} >
        <Td border="2px solid" >  {item[1].name}    </Td>
        <Td border="2px solid" >{item[1].quantity}</Td>
        <Td  border="2px solid" >{item[1].total}  </Td>

      </Tr>
        
        ))}
        <Tr  >
           <Td colSpan={2} >Итого:</Td>
           <Td> {totalPrice} сум </Td>
       </Tr>
       <Tr  >
           <Td colSpan={2} >Услуга:</Td>
           <Td> 0 сум </Td>
       </Tr>
    </Tbody>
    
      </Table> 
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={onClose}>
                Закрыть
              </Button>
              <Button variant='ghost'></Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  export default BasicUsage