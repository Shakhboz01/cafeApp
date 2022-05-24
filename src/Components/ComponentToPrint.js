import React,{useRef} from "react";
import { useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
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
    Text,
    ModalCloseButton,Button } from "@chakra-ui/react"
    import ReactToPrint from 'react-to-print';

function BasicUsage({ref,ordersData,totalPrice,children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
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
              
              <Table   ref={componentRef} >
              <TableCaption>Спасибо что выбрали нас!</TableCaption>
    <Thead>
      <Tr border="2px solid" >
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
        <Tr>
           <Td></Td>
           <Td>Итого:</Td>
           <Td> {totalPrice} сум </Td>
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