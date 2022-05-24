/*
Имя продукта
УРЛ картинки
ТИП: Хлеб,Напиток(сколько л.),Блюдо(Коса , Порс или кг),Салат
Описывать как : кг,порс,шт,коса
Стоимость 
Доп. описание
*/
import Pagination from '@mui/material/Pagination';

import { getDatabase,onValue,remove, ref, set, update } from "firebase/database";
import React,{useState,useEffect} from 'react'
import { Box, Button, Center, Select } from '@chakra-ui/react'
import { Input,InputGroup,InputLeftElement,InputRightElement } from '@chakra-ui/react'
 import { v4 as uuidv4 } from 'uuid';



const Products = ({products}) => {
    const [product,setProduct]=useState([]);
    const [data,setData]=useState([]);
    const [specifyRow,setSpecifyRow]=useState('');
    const [isUpdating,setIsUpdating]=useState(false)
    const [show,setShow]=useState(false)
    const db=getDatabase()
    let id=uuidv4();

    //create
    const getData=(e)=>{
        setProduct( prevValues => {
            return { ...prevValues,[e.target.name]: e.target.value}
         }
            )
    }
    const {name,url,type,addition,price,addInfo}=product
    const handleSubmit=(e)=>{
        e.preventDefault();
        set(ref(db, 'product/'+id), {
            name,url,type,addition,price,addInfo
        });  
        setShow(false);
        setProduct({})

    }
//**create */

//get

//**get */



//delete
const removeData=(id)=>{
    if(data.length==1){
        setData([])
    }
    remove(ref(db, 'product/'+id))
}

//update
const [prodId,setProdId]=useState("")
const setRow=(item)=>{
    setShow(true)
    setIsUpdating(true)
    setProdId(item[0])
    const {name,url,type,addition,price,addInfo}=item[1]
    setSpecifyRow(item[0])
    setProduct({
        name,url,type,addition,price,addInfo
    })
}
const updateData=(e)=>{
    e.preventDefault()
  
    update(ref(db,'product/'+specifyRow),{
        name,url,type,addition,price,addInfo 
})
setSpecifyRow("");
setProduct({})
setShow(false)
}
 /* update*/
  
//panigation
// const [page, setPage] = React.useState(1);
//   let prodsPerPage=3;

//   const [filter,setFilter]=useState([]);
//   let IndexOfLastProd;
//   let IndexOfFirstProd;
//   useEffect(()=>{
//     window.scrollTo(0,0);
//     },[]);

//   useEffect(()=>{
//    IndexOfLastProd=page*prodsPerPage;
//    IndexOfFirstProd=IndexOfLastProd-prodsPerPage;
//    window.scrollTo(0,400);
// setFilter(data.slice(IndexOfFirstProd,IndexOfLastProd));
//   },[page])

//   const handleChange = (event, value) => {
//     setPage(value);
//   };

  //**paniga */

  return (
    <div style={{zIndex:0,background:"#45c9ff"}} >
        <Center h='100px'>Продукты</Center>
        <Box maxW='lg'>
{!show&&(
            <Button onClick={()=>{setShow(true);setIsUpdating(false);setProduct({})}} >Добавить продукт</Button>
)}
{show&&(
    <form onSubmit={(e)=>{
            if(isUpdating){
                updateData(e)
            }
            else{
                handleSubmit(e)
            }
        }} >
        <Input
        defaultValue={product.name}
    color='teal'
    placeholder='Имя продукта'
    _placeholder={{ color: 'inherit' }}
    name="name" onChange={(e)=>getData(e)}
    required
    />
    <Input
    defaultValue={product.url}
    color='teal'
    placeholder=' УРЛ картинки'
    required
    name="url" onChange={(e)=>getData(e)}
    _placeholder={{ color: 'inherit' }}
    />
    
    <Select variant='filled'defaultValue={product.type}  name="type" onChange={(e)=>getData(e)} placeholder='Выберите тип продукта ' >
          <option value='Блюдо' >Блюдо</option>
          <option value='Хлеб' >Хлеб</option>
          <option value='Салат' >Салат</option>
          <option value='Напиток' >Напиток</option>
          <option value='Другой' >Другой</option>
      </Select>
      <Select variant='filled' name="addition" defaultValue={product.addition} onChange={(e)=>getData(e)} placeholder='Указание ' >
          <option value='Штука' >Штука</option>
          <option value='Порс' >Порс</option>
          <option value='Коса' >Коса</option>
          <option value='Кг' >Кг</option>
      </Select>
      <InputGroup>
    <InputLeftElement
      pointerEvents='none'
      color='gray.300'
      fontSize='1.2em'
      children='$'
    />
    <Input placeholder='Стоимость' required type='number' name="price"defaultValue={product.price} onChange={(e)=>getData(e)}/>
  </InputGroup>
  <Input
    color='teal'
    placeholder='Дополнительная информация (не обязательно)'
    name="addInfo" onChange={(e)=>getData(e)}
    defaultValue={product.addInfo}
    _placeholder={{ color: 'inherit' }}
    />
    <Button onClick={()=>{setProduct({});setShow(false)}} > Отменить </Button>
  <Button type='submit' variant='outline' >{isUpdating?"Редактировать":"Добавить"}</Button>
        </form>
)}
        
    </Box>
    <Center alignItems='center' justifyItems="center"  maxW='100vw' display='grid' gridTemplateColumns="repeat(auto-fill,minmax(230px,1fr))" >
        { products&& products.map(item=>(
            <Box display='flex'  flexDirection='column' m='30px' alignItems='flex-start' justifyContent='center'  maxWidth='sm' key={item[0]} >

                <div style={{height:'200px',width:'100%'}} >
                <img style={{width:'100%',height:"100%",objectFit:"cover"}} src={item[1].url} alt={item[1].name}/>
                </div>
                <ul style={{fontSize:"large"}} >
                    <li>Имя : {item[1].name} </li>
                    <li>Цена : {item[1].price} </li>
                    {item[1].addInfo&&(
                    <li>Информация: {item[1].addInfo} </li>
                    )}
                </ul>
                <Box>
                <Button onClick={()=>removeData(item[0])} >Удалить</Button>
    <Button  onClick={()=>setRow(item)} >Редактировать</Button>
                </Box>
            </Box>
        ))}
 
    </Center>
    </div>
  )
}

export default Products
