import { getDatabase, remove, push, ref, set, update } from "firebase/database";
import React,{useContext, useEffect, useState} from 'react'
import { Box, Button, Center, Flex, Select, Spacer } from '@chakra-ui/react'
import { Input,InputGroup,InputLeftElement,Checkbox } from '@chakra-ui/react'
 import { v4 as uuidv4 } from 'uuid';
 import {MdAutoDelete,MdFavorite} from 'react-icons/md'
import {FiRefreshCcw} from 'react-icons/fi'
import {AiFillEdit, AiFillEye} from 'react-icons/ai'
import styled from "styled-components";
import { mobile } from "../Components/Responsive";
import { MyContext } from "../App";
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

const Products = () => {
    const values=useContext(MyContext);
    const {setProducts, products, db, productNaming, currentUser, currentDate, typeOfFood} = values;
    const [product, setProduct]=useState([]);
    const [printable, setPrintable]=useState(false)
    const [data, setData]=useState([]);
    const [specifyRow, setSpecifyRow]=useState('');
    const [isUpdating, setIsUpdating]=useState(false)
    const [show, setShow]=useState(false)
    const [currentTypeOfFood, setCurrentTypeOfFood]=useState('Все')
    const [searchName, setSearchName]=useState('')
    const [sortByLessProdsLeft, setSortByLessProdsLeft]=useState(false)
    //search

    let id = uuidv4();

    //create
    const getData=(e)=>{
      setProduct( prevValues => {
        return { ...prevValues, [e.target.name]: e.target.value}
      })
    }
    const {name, url, type, addition, price, product_left, restriction}=product
    const handleSubmit=(e)=>{
        e.preventDefault();
        try {
            set(ref(db, 'product/'+id), {
                name, url, type, addition,
                price: Number(price), printable,
                lastAdded_at: currentDate,
                product_left: Number(product_left),
                restriction: Number(restriction),
                totalSale:0,
                is_enough: Number(product_left) > Number(restriction)
            });
            //продано, остался, actualPrice
            setShow(false);
            setProduct({})
        } catch (error) {
            alert(error)
        }
    }
//delete
    const removeData=(id)=>{
        data.length==1 && setData([])
        remove(ref(db, 'product/'+id))
    }
//update
    const setRow=(item)=>{
        setShow(true)
        window.scrollTo(0,0);
        setIsUpdating(true)
        const {name,url,type,addition,price, restriction, product_left}=item[1]
        setSpecifyRow(item[0])
        setProduct({
            name,url,type,addition,price,restriction, product_left
        })
    }

    const updateData=(e)=>{
      e.preventDefault()
      update(ref(db,'product/'+specifyRow),{
        name,url,type,addition,
        price: Number(price), printable,
        restriction: Number(restriction),
        product_left: Number(product_left)
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
    const makeNull = (item) => {
      update(ref(db, 'product/'+item[0]), {
        product_left: 0
      });
    }
    const navigate = useNavigate()
    const redirect = (item) => {
        navigate(`/products/${item[0]}`)
    }

    return (
        <div style={{zIndex:0,background:"#45c9ff"}} >
            <Center h='90px'>Продукты</Center>
            <Box maxW='lg'>
            {!show&&(
                <Flex alignItems={'center'} w='97vw' mx='1.5vw'>
                    <Button onClick={()=>{setShow(true);setIsUpdating(false);setProduct({})}} bg='purple.700' color='white'>
                        Добавить продукт
                    </Button>
                    <Spacer/>
                    <div style={{width:'200px'}} class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-default">Найти</span>
                        </div>
                        <input onChange={(e) => setSearchName(e.target.value)} type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    <Spacer/>
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" onClick={(e)=> setSortByLessProdsLeft(!sortByLessProdsLeft)} id="flexCheckDefault"/>
                        <label style={{width:'20px', height:'20px',background: 'yellow' }} class="form-check-label" for="flexCheckDefault"/>
                    </div>
                    <Spacer/>
                    <div class="btn-group btn-group" role="group" aria-label="...">
                        {typeOfFood.map((item, ind) => (
                            <button onClick={() => setCurrentTypeOfFood(item)} type="button" key={ind} class={`btn btn-${currentTypeOfFood === item ? 'success' : 'secondary'}`}>{item}</button>
                        ))}
                        <button onClick={() => setCurrentTypeOfFood('Все')} type="button"
                                class={`btn btn-${currentTypeOfFood === 'Все' ? 'success' : 'secondary'}`}
                        >
                        Все
                        </button>
                    </div>
                </Flex>
            )}
            {show&&(
                <form onSubmit={(e)=>isUpdating ? updateData(e) : handleSubmit(e)}>
                    <Input
                        defaultValue={product.name}
                        placeholder='Имя продукта'
                        _placeholder={{ color: 'inherit' }}
                        name="name" onChange={(e)=>getData(e)}
                        required
                    />
                    <Input
                        defaultValue={product.url}
                        placeholder=' УРЛ картинки'
                        required
                        name="url" onChange={(e)=>getData(e)}
                        _placeholder={{ color: 'inherit' }}
                    />
                    <Select variant='filled'defaultValue={product.type}  name="type" onChange={(e)=>getData(e)} placeholder='Выберите тип продукта ' >
                        {typeOfFood.map((item, ind) => (
                        <option key={ind} value = {item}>{item}</option>
                        ))}
                    </Select>
                    <Checkbox checked = {printable} onChange = {(e)=> setPrintable(e.target.checked)} margin="10px">
                        Вывести чек на этот товар
                    </Checkbox>

                    <Select variant='filled' name="addition"
                            defaultValue={product.addition}
                            onChange={(e)=>getData(e)} placeholder='Указание ' >
                        {productNaming && productNaming.map((naming, ind)=>(
                          <option value={naming} key={ind}>{naming}</option>
                        ))}
                    </Select>
                    <InputGroup>
                        <InputLeftElement
                          pointerEvents='none' color='gray.300'
                          fontSize='1.2em'
                          children='$'
                        />
                        <Input
                            _placeholder = {{color: 'inherit'}} placeholder = 'Стоимость'
                            required type='number' name="price" step={0.1} defaultValue={product.price}
                            onChange={(e)=>getData(e)}
                        />
                    </InputGroup>
                    {isUpdating && currentUser.role === 'admin' && (
                      <Input _placeholder = {{color: 'inherit'}} placeholder = 'Имеется' required
                        type ='number' name="product_left" step={0.1} defaultValue = {product.product_left}
                        onChange = {(e)=>getData(e)}
                      />
                    )}
                    <Input _placeholder = {{color: 'inherit'}} placeholder = 'Красная зона'
                           required type ='number' name="restriction"
                           defaultValue={product.restriction} onChange={(e)=> getData(e)}/>
                    <Button onClick={()=>{setProduct({});setShow(false)}} > Отменить </Button>
                    <Button type='submit' variant='outline' >
                        {isUpdating?"Редактировать":"Добавить"}
                    </Button>
                </form>
            )}
        </Box>
        <MainContainer>
            {products && products.filter(product => currentTypeOfFood === 'Все' ? product : product[1].type === currentTypeOfFood)
                                 .filter(filt=>filt[1].name.toLowerCase().includes(searchName.toLowerCase()))
                                 .filter(product => sortByLessProdsLeft ? product[1].product_left < product[1].restriction : product )
                                 .map(item=>(
                <Container>
                    <SetColor>
                        <ImageContainer>
                            <Image src={item[1].url} />
                        </ImageContainer>
                        <Info>
                            <Title>{item[1].name}</Title>
                            <Size> {item[1].price} сум </Size>
                            <Size>Осталось: {item[1].product_left}</Size>
                        </Info>
                        <Box background={item[1].restriction < item[1].product_left ? 'wheat' : 'yellow' } mb='8px' width='100%' alignItems='center' justifyContent='space-evenly' display='flex'>
                            <AiFillEdit onClick={()=>setRow(item)} style={{fontSize:'33px',cursor:"pointer",color:"gray"  }} />
                            <AiFillEye onClick={()=>redirect(item)} style={{fontSize:'33px',cursor:"pointer",color:"gray" }}/>
                            <MdFavorite onClick={() => popularity(item) } style={{fontSize:'33px',cursor:"pointer",color:item[1].popular?"red":"gray"}} />
                            {currentUser.role === 'admin' && (
                              <>
                                <MdAutoDelete onClick={()=>removeData(item[0])} style={{fontSize:'33px',cursor:"pointer",color:"gray",  }} />
                                <FiRefreshCcw onClick={() => makeNull(item) } style={{fontSize:'33px',cursor:"pointer",color:"gray"}} />
                              </>
                            )}
                        </Box>
                    </SetColor>
        </Container>
        ))}
        </MainContainer>
        </div>
  )
}

export default Products
