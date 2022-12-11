import { Button, Input } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from '../App'

const OrderHistories = () => {
  const values = useContext(MyContext)
  const {checkHistory, setCheckHistory} = values;
  const [data, setData] = useState([])
  const [checkNum, setCheckNum] = useState(0)
  // useEffect(()=>{
  //   axios.get(`${process.env.REACT_APP_HOST}/get-check`,{checkNumber: checkNum}).then(res=> res.success && setData(res.data) )
  // },[])

  const findCheck = async(e)=>{
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_HOST}/find-check`,{checkNumber: checkNum}).then(
      res=> {res.data.data !== undefined && setCheckHistory(Object.values(res.data.data)); console.log(res.data.data)}
    )
  }
  return (
    <div>
      <Button></Button>
      <div style={{marginTop:'80px'}}>
        <form style={{margin:'15px'}} onSubmit={(e)=>findCheck(e)}>
          <Input required placeholder = {'Введите номер чека'} type='number' onChange={(e)=>Number(setCheckNum(e.target.value))} />
          <button className='btn btn-warning' type='submit'>
            Проверить
          </button>
        </form>
      </div>
      <div>
      <table class="table">
          <thead>
            <tr>
              <th scope="col">Название</th>
              <th scope="col">Количество</th>
              <th scope="col">Цена</th>
              <th scope="col">Описание</th>
            </tr>
          </thead>
          <tbody>
          {checkHistory && checkHistory.map((item, index) =>(
                  <tr key={index}>
                    <th scope="row">{item[1].name}</th>
                    <td>{item[1].quantity}</td>
                    <td>{item[1].total}</td>
                    <td>{item[1].desc}</td>
                  </tr>
            ))}
            {checkHistory && (
              <tr>
              <th> {checkHistory[checkHistory.length - 1][1].totalPrice} сум </th>
              <th>Открыт в: {checkHistory[checkHistory.length - 1][1].start} </th>
            </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderHistories
