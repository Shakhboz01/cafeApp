import { Box,Modal, Button, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, ModalFooter, Select, Input } from '@chakra-ui/react'
import axios from 'axios';
import { ref, set } from 'firebase/database';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';

const IncomeModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = React.useRef(null);
  const [incomeType, setIncomeType] = useState('');
  const [showProdName, setShowProdName] = useState(true);

  const [paymentType, setPaymentType] = useState('наличка');
  const [amount, setAmount] = useState(null);
  const [incomeDescription, setIncomeDescription] = useState('');
  const values = useContext(MyContext);
  const {incomesData, setIncomesData, typeOfIncomes} = values;
  const navigate = useNavigate()
  const submitIncome = (e) =>{
    e.preventDefault();
    var data = {
      amount,
      incomeDescription,
      incomeType,
      paymentType
    }
    onClose()
    axios.post(`${process.env.REACT_APP_HOST}/create-income`, data).then(res=> {
            if(res.data.success){
              alert('Успешно добавлен')
              navigate('/tables')
              var copy = incomesData;
              copy.unshift({...data, date:''})
              setIncomesData(copy)
              setIncomeDescription('')

            }
            else{
              alert(`Что-то пошло не так (${res.data.message})`)
            }
          }).catch(e=>alert(e))
  }

  return (
    <>
      <Box></Box>
      <Button m='5' onClick={onOpen}>
        Добавить доход
      </Button>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={(e)=>submitIncome(e)} >
            <ModalHeader>Новый доход</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl>
                  <FormLabel>Сумма</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField required onChange={(e)=>setAmount(Number(e.target.value))} />
                  </NumberInput>
                  <Select my='2' onChange={(e)=>setIncomeType(e.target.value)} required placeholder='Тип дохода'>
                    {typeOfIncomes && typeOfIncomes.map((naming, ind)=>(
                      <option key={ind} value={naming}>{naming}</option>
                    ))}
                  </Select>
                  <Select my='2' onChange={(e)=>setPaymentType(e.target.value)} placeholder='Способ оплаты'>
                    <option value='наличка'>Наличка</option>
                    <option value='карта'>Карта</option>
                  </Select>
                  <FormLabel>Комментария</FormLabel>
                  <Input value={incomeDescription} onChange={(e)=>setIncomeDescription(e.target.value)} type='text' placeholder='Не обязательно' />
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

export default IncomeModal
