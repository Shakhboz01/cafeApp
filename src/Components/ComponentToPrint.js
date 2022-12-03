import React from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
} from  "@chakra-ui/react"

const ComponentToPrint = React.forwardRef((props,ref)=>{
  const {ordersData, fee, tableNumber, totalPrice, comment} = props

  return(
    <Table ref={ref} style={{tableLayout:"auto"}} width='377px' color='black' fontWeight="semibold"  overflow="hidden" fontSize="lg">
      <TableCaption fontSize='xl' color='black' m='0' fontWeight='bold'>
        Спасибо что выбрали нас!
      </TableCaption>
      <TableCaption fontSize='xl' color='black'm='0' fontWeight='bold'>
        99 161 43 95
      </TableCaption>

      <Thead fontSize='28px' color='black'>
        <Tr fontWeight='bold' border='2px solid black'>
          <Th width='40%' fontSize='38px' colSpan={3} textAlign='center' color='black' border="2px solid">
            Bek
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
          <Td colSpan={2} >
            Услуга: {fee}%
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
        <Tr>
          <Td colSpan={3}>
            {comment}
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
})

export default ComponentToPrint