import React,{useRef,useEffect, useState } from "react";
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
import { BsFillPrinterFill } from "react-icons/bs";


const ComponentToPrint = React.forwardRef((props,ref)=>{
  const {ordersData, tableNumber, checkNumber, totalPrice, tableType} = props
  const [currentPrintData, setCurrentPrintData] = useState([])

  return(
    <Table ref={ref} style={{tableLayout:"auto"}} width='377px' color='black' fontWeight="semibold"  overflow="hidden" fontSize="lg">
      <TableCaption fontSize='xl' color='black' m='0' fontWeight='bold'>
        Спасибо что выбрали нас!
      </TableCaption>
      <TableCaption fontSize='xl' color='black'm='0' fontWeight='bold'>
        90 195 99 92
      </TableCaption>

      <Thead fontSize='28px' color='black'>
        <Tr fontWeight='bold' border='2px solid black'>
          <Th width='40%' fontSize='38px' colSpan={3} textAlign='center' color='black' border="2px solid">
            Sizning cafe
          </Th>
        </Tr>
        <Tr fontWeight='bold' color='black' border="2px solid black"  >
          <Th border="2px solid" color='black'>
            Имя
          </Th>
          <Th textAlign='center' border="2px solid"color='black'>
            Кол.
          </Th>
          <Th border="2px solid" textAlign='center' color='black'>
            Цена
          </Th>
        </Tr>
      </Thead>
      <Tbody border="2px solid">
        {ordersData && ordersData.filter((item,ind)=>ind !== ordersData.length-1)
                         .map(item=>(
          <Tr overflow='hidden' border="2px solid" key={item[0]}>
            <Td padding='3px 0' border="2px solid">
              {item[1].name}
            </Td>
            <Td padding='3px 0'  textAlign='center' border="2px solid">
              {item[1].quantity}
            </Td>
            <Td padding='3px 0' textAlign='center' border="2px solid">
              {item[1].total}
            </Td>
          </Tr>
        ))}
        <Tr border="2px solid">
          <Td border="2px solid">
            Стол:{tableNumber}
          </Td>
          <Td>
            Услуга: 0 сум
          </Td>
          <Td border="2px solid" textAlign='right'>
            Чек №: {checkNumber}
          </Td>
        </Tr>
        <Tr>
          <Td>
            Итого:
          </Td>
          <Td textAlign='right' colSpan={2}>
            {totalPrice} сум
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
})

function BasicUsage({ref, ordersData, totalPrice, tableNumber, children}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const componentRef = useRef();
  return (
    <>
      <div onClick={onOpen}>
      OPEN ME
      </div>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            <ReactToPrint
              trigger={() => <BsFillPrinterFill style={{cursor:"pointer",color:"green",fontSize:"25px"}}/>}
              content={() => componentRef.current}
            />
          </ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <ComponentToPrint
              ref={componentRef} tableNumber={tableNumber}
              totalPrice={totalPrice} ordersData={ordersData}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
  }

  export default ComponentToPrint