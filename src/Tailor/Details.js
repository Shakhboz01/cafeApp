import React from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Center,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    Checkbox, CheckboxGroup,
    Stack,Box,
    Select,
  } from '@chakra-ui/react'
  import { getDatabase,push,onValue,remove, ref, set, update } from "firebase/database";
  import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import styled from "styled-components"

const Colors=styled.div`
width:30px;
height:30px;
display:flex;
align-items:center;
justify-content:center;
border-radius:50%;
background:${props=>props.color};
`

const Details = ({tablesData,data,statuses}) => {
    const db=getDatabase();
    const [types,setTypes]=useState("Все")
    const statusChange=(item,num)=>{
        if(item[1].status==statuses[0]){
            update(ref(db,'table/'+num+"/"+item[0]),{
              status:statuses[1]
            })
        }
       else if(item[1].status==statuses[1]){
          update(ref(db,'table/'+num+"/"+item[0]),{
            status:statuses[2]
          })
      }
      else if(item[1].status==statuses[2]){
        update(ref(db,'table/'+num+"/"+item[0]),{
          status:statuses[3]
        })
      }
      }
      const navigate=useNavigate();
const redirect=(itema)=>{

    let numberOfPeople=itema[1].orders.numberOfPeople;
    let numOfTable=itema[0];
let tableId=tablesData.filter(item=>item[1].tableNumber==numOfTable)[0][0]
    navigate("/order/"+numOfTable+"/"+numberOfPeople+"/"+tableId)
}
const [filters,setFilters]=useState(statuses);
const filterChange=(e,stat)=>{
    if(e.target.checked){setFilters([...filters,stat]) }
      
      else{ setFilters(filters.filter(item=>item!==stat)) }
}



const findQuantity=(item,name)=>{
  let num=0;
  let arr;
  for(var i=0;i<item.length;i++){
    for(let b=1;b<item[i].length;b++){
      arr=Object.values(item[i][b])
      for(var c=0;c<arr.length-1;c++){
        if(arr[c].status===name){
          num+=1
        }
      }
    }
  }

  return num
}
  return (
    <div style={{background:'#0a0a23' ,color:"white" }} >
      {data.length==0&&(
          <Center>Нет заказов</Center>
      )}

<Box pt='25px' display='flex' width='xm' justifyContent='space-around' >

<Stack spacing={[ 1, 5]} direction={['column', 'row']}>
  <Checkbox onChange={(e)=> filterChange(e,statuses[0])}  size='md' colorScheme='blue'defaultChecked>
    добавил
  </Checkbox>
  <Checkbox size='md' colorScheme='blue' onChange={(e)=> filterChange(e,statuses[1])} defaultChecked>
    принял
  </Checkbox>
  <Checkbox size='md' colorScheme='blue' onChange={(e)=> filterChange(e,statuses[2])} defaultChecked>
    готовил
  </Checkbox>
  <Checkbox size='md' colorScheme='blue' onChange={(e)=> filterChange(e,statuses[3])} defaultChecked>
    доставил
  </Checkbox>
</Stack>

<Stack spacing={[ 1, 5]} direction={['column', 'row']} >
  <Colors color="#2768a5" >
    <div>

  {findQuantity(data,statuses[0])} 
    </div>
  </Colors>
  <Colors color="#745d0c">
  <div>
      
  {findQuantity(data,statuses[1])} 
      </div>
  </Colors>
  <Colors  color="#9d2261">
  <div>
      
  {findQuantity(data,statuses[2])} 
      </div>
  </Colors>
  <Colors  color="#2d8154">
  <div>
      
  {findQuantity(data,statuses[3])} 
      </div>
  </Colors>
</Stack>

<Select variant="outline" bg="wheat" color='black' onChange={(e)=>setTypes(e.target.value)} maxWidth='100px' size='xm'  placeholder='Тип' >
<option value='Все'  >Все</option>
<option value='Блюдо'  >Блюдо</option>
<option value='Салат'  >Салат</option>
<option value='Напиток'  >Напиток</option>
  <option value='Хлеб'>Хлеб</option>
  <option value='Другой'>Другой</option>
</Select>

</Box>

      <TableContainer   >
          {data && data.map((itema,ind)=>(

          
  <Table color='blackAlpha.100' background='#63ebd2' width='90%' margin='100px auto'  key={ind} variant='striped' colorScheme='teal'>
    <TableCaption fontSize='20px' ><Button onClick={()=>redirect(itema)} colorScheme='blue' >Посмотреть</Button></TableCaption>
    <Thead>
      <Tr>
      <Th>Имя</Th>
        <Th>Количество</Th>
         <Th >Статус</Th>
      </Tr>
    </Thead>
    <Tbody color='black' fontWeight='semibold' fontSize='lg' >
        
    {Object.entries(itema[1]).filter(item=>{
      if(types!=="Все"){return item[1].type==types}
      else{return item}
    }).filter((item,ind)=>filters.includes(item[1].status)).map(items=>(
        <Tr key={items[0]} >
        <Td>{items[1].name}  {items[1].desc&&( <i style={{textWrap:"wrap",color:"red",}} >({items[1].desc})</i>)  }  </Td>
        <Td>{items[1].quantity}</Td>
         <Td> <Button colorScheme={items[1].status==statuses[0]?"blue":items[1].status===statuses[1]?"yellow":items[1].status===statuses[2]?"pink":"green"}  onClick={()=>statusChange(items,itema[0])}> {items[1].status}</Button></Td>
      </Tr>
        ))}
      
    </Tbody>
    <Tfoot>
      <Tr>
        <Th> Номер стола {itema[0]}</Th>
        <Th>Время {itema[1].orders.start.split("/")[1]} </Th>
        <Th  >Количество людей {itema[1].orders.numberOfPeople} </Th>
      </Tr>
    </Tfoot>
  </Table>
  ))}
</TableContainer>

    </div>
  )
}

export default Details
