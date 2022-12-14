

import { getDatabase,remove,push, ref, set, update } from "firebase/database";
import React,{useState} from 'react'
import { Box, Button, Center, Select } from '@chakra-ui/react'
import { Input,InputGroup,InputLeftElement,Checkbox } from '@chakra-ui/react'
 import { v4 as uuidv4 } from 'uuid';
 import {MdAutoDelete,MdFavorite} from 'react-icons/md'
import {AiFillEdit} from 'react-icons/ai'
import styled from "styled-components";
import { mobile } from "../Components/Responsive";

const MainContainer=styled.div`
display:flex;
flex-wrap:wrap;
align-items:center;
justify-content:center;
`

const Container=styled.div`
margin:25px;
display:flex;
flex-direction:column;
justify-content:flex-start;
align-items:center;
z-index:1;  
background:black;
${mobile(500,{
  margin:"10px 2px"
})}
`

const SetColor=styled.div`
background:#fdf5f5;
box-shadow:
       inset 0 -3em 3em rgba(0,0,0,0.1),
             0 0  0 2px rgb(255,255,255),
             0.3em 0.3em 1em rgba(0,0,0,0.3);
`

const ImageContainer=styled.div`
position:relative;
height:250px;
width:250px;
display:flex;
align-items:center;
justify-content:center;
${mobile(500,{
  height:'150px',
  width:'210px'
})}
`
const Image=styled.img`
width:100%;
height:100%;
padding:10px;
object-fit:cover;
`
const Info=styled.div`
width:250px;
padding:10px;
display:flex;
flex-direction:column;
align-items: center;
${mobile(500,{
  padding:'5px'
})}
`
const Title=styled.div`
letter-spacing:1.7px;
font-size:18px;
text-align:center;
font-weight:bold;
width:100%;
word-wrap: break-word;`

 
const Size=styled.div`
font-style:italic;
`

const Products = ({products}) => {
    const [product,setProduct]=useState([]);
    const [printable,setPrintable]=useState(false)
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
         })
    }
    const {name,url,type,addition,price}=product

  
    const handleSubmit=(e)=>{
        e.preventDefault();
        set(ref(db, 'product/'+id), {
            name,url,type,addition,price,printable });
          
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
const setRow=(item)=>{
    setShow(true)
    window.scrollTo(0,0);
    setIsUpdating(true)
    const {name,url,type,addition,price}=item[1]
    setSpecifyRow(item[0])
    setProduct({
        name,url,type,addition,price
    })
}
const updateData=(e)=>{
    e.preventDefault()
  
    update(ref(db,'product/'+specifyRow),{
        name,url,type,addition,price,printable 
})
setSpecifyRow("");
setProduct({})
setShow(false)
}
const popularity=(item)=>{
    
    update(ref(db, 'product/'+item[0]), {
        popular:item[1].popular?false:true
     });
}

  return (
    <div style={{zIndex:0,background:"#45c9ff"}} >
        <Center  h='100px'  >????????????????</Center>
        <Box maxW='lg'>
{!show&&(
            <Button onClick={()=>{setShow(true);setIsUpdating(false);setProduct({})}} >???????????????? ??????????????</Button>
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
    placeholder='?????? ????????????????'
    _placeholder={{ color: 'inherit' }}
    name="name" onChange={(e)=>getData(e)}
    required
    />
    <Input
    defaultValue={product.url}
    color='teal'
    placeholder=' ?????? ????????????????'
    required
    name="url" onChange={(e)=>getData(e)}
    _placeholder={{ color: 'inherit' }}
    />
    
    <Select variant='filled'defaultValue={product.type}  name="type" onChange={(e)=>getData(e)} placeholder='???????????????? ?????? ???????????????? ' >
          <option value='??????????' >??????????</option>
          <option value='????????' >????????</option>
          <option value='??????????' >??????????</option>
          <option value='??????????????' >??????????????</option>
          <option value='????????????' >????????????</option>
      </Select>
      
      <Checkbox  checked={printable} onChange={(e)=>setPrintable(e.target.checked)} margin="10px ">?????????????? ?????? ???? ???????? ??????????</Checkbox>
      
      <Select variant='filled' name="addition" defaultValue={product.addition} onChange={(e)=>getData(e)} placeholder='???????????????? ' >
          <option value='????.' >??????????</option>
          <option value='????????' >????????</option>
          <option value='????????' >????????</option>
          <option value='????.' >????</option>
      </Select>
      <InputGroup>
    <InputLeftElement
      pointerEvents='none'
      color='gray.300'
      fontSize='1.2em'
      children='$'
    />
    <Input placeholder='??????????????????' required type='number' name="price"defaultValue={product.price} onChange={(e)=>getData(e)}/>
  </InputGroup>
  
    <Button onClick={()=>{setProduct({});setShow(false)}} > ???????????????? </Button>
  <Button type='submit' variant='outline' >{isUpdating?"??????????????????????????":"????????????????"}</Button>
        </form>
)}
        
    </Box>
    <MainContainer>
        { products&& products.map(item=>(
            <Container >
                <SetColor>

            {/* // <Box display='flex'  flexDirection='column' m='30px' alignItems='flex-start' justifyContent='center'  maxWidth='sm' key={item[0]} > */}

                <ImageContainer>
                <Image src={item[1].url} />
                {/* <img style={{width:'100%',height:"100%",objectFit:"cover"}} src={item[1].url} alt={item[1].name}/> */}
                </ImageContainer>
                <Info  >
                    {/* <li>?????? : {item[1].name} </li>
                    <li>???????? : {item[1].price} </li> */}
                    <Title  >{item[1].name}</Title>
        <Size> {item[1].price} </Size>
                </Info>
                <Box background="wheat" mb='8px' width='100%' alignItems='center' justifyContent='space-evenly' display='flex' >
                <MdAutoDelete onClick={()=>removeData(item[0])} style={{fontSize:'33px',cursor:"pointer",color:"red",  }} />
                <AiFillEdit onClick={()=>setRow(item)} style={{fontSize:'33px',cursor:"pointer",color:"blue",  }} />
                <MdFavorite onClick={()=>popularity(item)} style={{fontSize:'33px',cursor:"pointer",color:item[1].popular?"brown":"red",  }} />
                </Box>
            {/* // </Box> */}
                </SetColor>
    </Container>
        ))}
    </MainContainer>
    </div>
  )
}

export default Products
