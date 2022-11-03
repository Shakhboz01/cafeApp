import React,{useContext, useEffect, useRef, useState} from 'react'
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
    Checkbox,
    Stack,Box,
    Select,
  } from '@chakra-ui/react'
  import { getDatabase, ref,  update } from "firebase/database";
  import { useNavigate } from 'react-router-dom';
import styled from "styled-components"
import { MyContext } from '../App';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { BsFillPrinterFill } from 'react-icons/bs';

const Colors=styled.div`
width:28px;
height:28px;
display:flex;
align-items:center;
justify-content:center;
border-radius:50%;
background:${props=>props.color};
`

const callPrint = ({ref, single}) => {
  return(
  <div id='for_print' style={{display:'none'}}>
    <table ref={ref} style={{margin:"70px 0 ",width:"375px",fontWeight:'bold',fontSize:"30px" ,color:'black' ,border:"2px solid black"}} >
      <thead>
        <tr style={{border:"2px solid black"}}>
          <th>Имя</th>
          <th style={{border:"2px solid black"}}>Кол.</th>
          <th>Стол</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{padding:"13px 0",border:"2px solid black"}} >
          <td>{single.name}</td>
          <td style={{border:"2px solid black"}} >{single.quantity}</td>
          <td>{single.table}</td>
        </tr>
      </tbody>
      <p style={{fontSize:"22px"}} ><i>{single.desc}</i></p>
    </table>
  </div>
  )
}

const Details = () => {
  const values = useContext(MyContext);
  const navigate=useNavigate();

  const {currentTypeOfFood, setCurrentTypeOfFood, data, db, ordersData, statuses, single, setSingle, tablesData, typeOfFood} = values;

  const [filters,setFilters]=useState(statuses);


  const statusChange=(item, itema, type)=>{
    console.log(`table/${type}/${itema}, ${item[1].status}, ${item[0]}`)
    if(item[1].status == statuses[0]){
      update(ref(db,'table/'+type+"/"+itema+'/'+item[0]),{
        status:statuses[1]
      })
    }
    else if(item[1].status==statuses[1]){
      update(ref(db,'table/'+type+"/"+itema+'/'+item[0]),{
        status:statuses[2]
      })
    }
    else if(item[1].status==statuses[2]){
      update(ref(db,'table/'+type+"/"+itema+'/'+item[0]),{
        status:statuses[3]
      })
    }
  }

  const redirect=(itema, tableType)=>{
    navigate("/order/"+itema[0]+"/"+tableType)
  }

  const filterChange=(e,stat)=>{
    if(e.target.checked){
      setFilters([...filters,stat])
    }
    else{
      setFilters(filters.filter(item=>item!==stat))
    }
  }

  const findQuantity = (name)=>{
    let num = 0;
    for (let index = 0; index < ordersData.length; index++) {
      for (let index2 = 0; index2 < Object.entries(Object.values(ordersData[index][1])).length; index2++) {
        for (let index3 = 0; index3 < Object.values(Object.values(ordersData[index][1])[index2]).length; index3++) {
          var shortForm = Object.values(Object.values(ordersData[index][1])[index2])[index3];
          if(shortForm.status === name){
            num+=1
          }
        }
      }
    }
    return num
  }

  //print
  const singleRef = useRef()
  const productPrint = (item, tableNumber) => {
    let description = "."
    if(item.desc){
      description = item.desc
    }
    setSingle({
      name: item.name,
      desc: description,
      quantity:item.quantity,
      tableNumber
    })
  }
  const handleDoublePrint = useReactToPrint({
    content: () => singleRef.current
  });


  return (
    <div style={{background:'#0a0a23', color:"white"}}>
      {data.length==0&&(
          <Center>Нет заказов</Center>
      )}
      <Box pt='15px'
          alignItems='center'
          display='flex'
          width='xm'
          justifyContent='space-around'
      >
        <Stack mt='75px' spacing={[ 1, 5]} direction={['column', 'row']}>
          <Checkbox onChange={(e)=> filterChange(e,statuses[0])} colorScheme='blue'defaultChecked>
            <Colors color="#2768a5" />
          </Checkbox>
          <Checkbox size='md' colorScheme='blue' onChange={(e)=> filterChange(e,statuses[1])} defaultChecked>
            <Colors color="#745d0c" />
          </Checkbox>
          <Checkbox size='md' colorScheme='blue' onChange={(e)=> filterChange(e,statuses[2])} defaultChecked>
            <Colors color='#9d2261'/>
          </Checkbox>
          <Checkbox size='md' colorScheme='blue' onChange={(e)=> filterChange(e,statuses[3])} defaultChecked>
            <Colors color='#2d8154'/>
          </Checkbox>
        </Stack>

        <Stack mt='75px' spacing={[1, 5]} direction={['column', 'row']}>
          <Colors color='#2768a5'>
            <div>
              {findQuantity(statuses[0])}
            </div>
          </Colors>
          <Colors color="#745d0c">
            <div>
              {findQuantity(statuses[1])}
            </div>
          </Colors>
          <Colors color="#9d2261">
            <div>
              {findQuantity(statuses[2])}
            </div>
          </Colors>
          <Colors color="#2d8154">
            <div>
              {findQuantity(statuses[3])}
            </div>
          </Colors>
        </Stack>
        <Stack mt='75px' spacing={[ 1, 5]} direction={['column', 'row']}>

          <div class="btn-group btn-group" role="group" aria-label="...">
            {typeOfFood.map((item, ind) => (
              <button onClick={() => setCurrentTypeOfFood(item)}
                      type="button" key={ind}
                      class={`btn btn-${currentTypeOfFood === item ? 'success' : 'secondary'}`}>
                {item}
              </button>
            ))}
            <button onClick={() => setCurrentTypeOfFood('Все')}
                    class={`btn btn-${currentTypeOfFood === 'Все' ? 'success' : 'secondary'}`}
            >
              Все
            </button>

          </div>
        </Stack>
      </Box>
      {/* print */}
      <div id='for_print' style={{display:'none'}}>
        <table ref={singleRef} style={{margin:"70px 0 ",width:"375px",fontWeight:'bold',fontSize:"30px" ,color:'black' ,border:"2px solid black"}} >
          <thead>
            <tr style={{border:"2px solid black"}}>
              <th>Имя</th>
              <th style = {{border:"2px solid black"}}>Кол.</th>
              <th>Стол</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{padding:"13px 0", border:"2px solid black"}} >
              <td>{single.name}</td>
              <td style={{border:"2px solid black"}} >{single.quantity}</td>
              <td>{single.tableNumber}</td>
            </tr>
          </tbody>
          <p style={{fontSize:"22px"}} ><i>{single.desc}</i></p>
        </table>
      </div>

    {data && data.map((singleTableTypeData,ind) =>(
      <TableContainer key = {ind} >
        {data && Object.entries(data[ind][1]).map((itema, ind)=>(
            <Table color='blackAlpha.100' background='#63ebd2' width='90%' margin='100px auto'  key={ind} variant='striped' colorScheme='teal'>
              <TableCaption fontSize='20px'>
                <Button onClick={()=>redirect(itema, singleTableTypeData[0])} colorScheme='blue'>
                  Посмотреть
                </Button>
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>{singleTableTypeData[0]}</Th>
                  <Th>Количество</Th>
                  <Th>Статус</Th>
                </Tr>
              </Thead>
              <Tbody color='black' fontWeight='semibold' fontSize='lg'>
                {Object.entries(itema[1]).filter(item=>{
                  if(currentTypeOfFood!=="Все"){return item[1].type==currentTypeOfFood}
                  else{return item}
                }).filter((item,ind)=>filters.includes(item[1].status)).map(items=>(
                  <Tr key={items[0]}>
                    <Td>
                      {items[1].name} {items[1].desc && (<i style={{textWrap:"wrap",color:"red",}}>({items[1].desc})</i>)}
                    </Td>
                    <Td>{items[1].quantity}</Td>
                    <Td display='flex' alignItems='center' >
                      <Button colorScheme={items[1].status==statuses[0]?"blue":items[1].status===statuses[1] ? "yellow" : items[1].status === statuses[2] ? "pink" : "green"}
                              onClick={() => statusChange(items, itema[0], singleTableTypeData[0])}
                      >
                        {items[1].status}
                      </Button>
                      {items[1].printable&&(
                        <div onClick={()=>{productPrint(items[1], itema[0])}} onDoubleClick={() => handleDoublePrint() } >
                          <BsFillPrinterFill style={{marginLeft:'8px', cursor:"pointer", color:"green", fontSize:"25px"}}/>
                        </div>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Td color='black' fontWeight={'bold'}> Стол {itema[0]} </Td>
                </Tr>
              </Tfoot>
            </Table>
        ))}
      </TableContainer>
    ))}
    </div>
  )
}

export default Details
