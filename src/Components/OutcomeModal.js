import { Box,Modal, Button, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, ModalFooter, Select, Input } from '@chakra-ui/react'
import axios from 'axios';
import { ref, set, update } from 'firebase/database';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';


const OutcomeModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = React.useRef(null);
  const [outcomeType, setOutcomeType] = useState('');
  const [paymentType, setPaymentType] = useState('наличка');
  const [amount, setAmount] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodAmount, setProdAmount] = useState(0);
  const [outcomeDescription, setOutcomeDescription] = useState('');
  const values = useContext(MyContext);
  const {db,notify, outcomesData, setOutcomesData, products, typeOfOutcomes} = values;
  const navigate = useNavigate()
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  const newOutcome = async(val) =>{
    onClose()
    await axios.post(`${process.env.REACT_APP_HOST}/create-outcome`, val).then(res=> {
      if(res.data.success){
        navigate('/tables')
        alert('Успешно добавлен')
        var copy = outcomesData;
        copy.unshift({...val, date:''})
        setOutcomesData(copy)
        setOutcomeDescription('')
      }
      else{
        alert(`Что-то пошло не так (${res.data.message})`)
      }
    }).catch(e=>alert(e))
  }

  const submitIncome = async(e) =>{
    e.preventDefault();
    if(outcomeType === 'Приход товаров'){
      const foundProduct = products.find(item=>item[1].name.toLowerCase() === prodName.toLowerCase())
      if(foundProduct){
        newOutcome({
          amount,
          outcomeDescription,
          outcomeType,
          paymentType,
          prodName,
          prodAmount
        });
        update(ref(db,'product/'+ foundProduct[0]),{
          product_left: Number(foundProduct[1].product_left) + prodAmount,
          is_enough: (Number(foundProduct[1].product_left) + prodAmount) > Number(foundProduct[1].restriction) ? true : false
        })
        console.log(Number(foundProduct[1].product_left) + prodAmount, Number(foundProduct[1].restriction), (Number(foundProduct[1].product_left) + prodAmount) > Number(foundProduct[1].restriction))
      }
      else{
        alert('Имя неправильно')
      }
    }
    else{
      newOutcome({
        amount,
        outcomeDescription,
        outcomeType,
        paymentType
      })
    }
  }

  return (
    <>
      <Box></Box>
      <Button m='5' onClick={onOpen}>
        Добавить расход
      </Button>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={(e)=>submitIncome(e)} >
            <ModalHeader>Новый расход</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl>
                  <FormLabel>Сумма</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField required onChange={(e)=>setAmount(Number(e.target.value))} />
                  </NumberInput>
                  <Select my='2' onChange={(e)=>setOutcomeType(e.target.value)} required placeholder='Тип расхода'>
                    {typeOfOutcomes && typeOfOutcomes.map((naming, ind)=>(
                      <option key={ind} value={naming}>{naming}</option>
                    ))}
                    <option value='Приход товаров'>Приход товаров</option>
                  </Select>
                  {outcomeType == 'Приход товаров' && (
                    <>
                      <Input onChange={(e)=>setProdName(e.target.value)} required = {outcomeType == 'Приход товаров'} placeholder='Введите имя товара' list="brow"/>
                      <datalist id="brow">
                        {products.map((item, index)=>(
                          <option key={index} value={item[1].name}/>
                        ))}
                      </datalist>
                      <Input type='number' onChange={(e)=>setProdAmount(Number(e.target.value))} />
                    </>
                  )}
                  <Select my='2' onChange={(e)=>setPaymentType(e.target.value)} placeholder='Способ оплаты'>
                    <option value='наличка'>Наличка</option>
                    <option value='карта'>Карта</option>
                  </Select>
                  <FormLabel>Комментария</FormLabel>
                    <Input value={outcomeDescription} onChange={(e)=>setOutcomeDescription(e.target.value)} type='text' placeholder='Не обязательно' />
                </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={onClose}>
                Закрыть
              </Button>
              <Button type='submit' colorScheme='blue'>Добавить</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OutcomeModal
