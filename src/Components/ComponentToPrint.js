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


const ComponentToPrint = React.forwardRef((props,ref)=>{

  return(
    <Table  style={{tableLayout:"auto"}}  width='377px'   color='black' fontWeight="semibold"  overflow="hidden" fontSize="lg"   ref={ref} >
              
    <TableCaption fontSize='xl' color='black' m='0' fontWeight='bold'>Спасибо что выбрали нас!</TableCaption>
    <TableCaption fontSize='xl' color='black'm='0' fontWeight='bold'>90 195 99 92</TableCaption>

<Thead fontSize='28px' color='black' >
<Tr    fontWeight='bold'  border="2px solid black"  >
<Th width='40%' fontSize='38px' colSpan={3} textAlign='center' color='black' border="2px solid">ANOR CAFE</Th>
</Tr>
<Tr   fontWeight='bold' color='black' border="2px solid black"  >
<Th  border="2px solid" color='black'>Имя</Th>
<Th textAlign='center' border="2px solid"color='black'>Кол.</Th>
<Th border="2px solid" textAlign='center' color='black'>Цена</Th>
</Tr>
</Thead>
<Tbody   border="2px solid" >
{props.ordersData.filter((item,ind)=>ind!==props.ordersData.length-1).map(item=>(

<Tr    overflow='hidden' border="2px solid" key={item[0]} >
<Td padding='3px 0'  border="2px solid"  >  { item[1].name }    </Td>
<Td padding='3px 0'  textAlign='center' border="2px solid" >{item[1].quantity}</Td>
<Td padding='3px 0' textAlign='center' border="2px solid" >{item[1].total}  </Td>

</Tr>

))}
<Tr border="2px solid" >
<Td border="2px solid" >Стол:{props.tableNumber}</Td>
<Td  >Услуга:</Td>
 <Td textAlign='right'   > 0 сум </Td>
 
</Tr>
<Tr  >
  {/* <Td>Стол {tableNumber}</Td> */}
  <Td  >Итого:</Td>
 <Td textAlign='right' colSpan={2} > {props.totalPrice} сум </Td>
</Tr>
</Tbody>

</Table> 
  )
})

function BasicUsage({setTotalPrice,ordersData,totalPrice,tableNumber,children}) {
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
            <ModalHeader>
              <ReactToPrint
        trigger={() => <Button  >Вывести чек</Button>}
        content={() => componentRef.current}
      /> </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              
            <ComponentToPrint ref={componentRef} tableNumber={tableNumber} totalPrice={totalPrice} ordersData={ordersData} />

            

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

  export default BasicUsage