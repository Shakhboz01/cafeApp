import { Button } from '@chakra-ui/react'
import { getDatabase, onValue, ref } from 'firebase/database'

import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MyContext } from '../App'

const SHowProduct = () => {
  const [currentProduct, setCurrentProduct] = useState({})
  const values = useContext(MyContext)
  const {products} = values
const db = getDatabase()
  useEffect(()=>{
    var prodId = window.location.pathname.split('/')[2]

    if(products.length >= 1){
        let singleProduct =  products.filter(item => item[0] === prodId)
        console.log('got from product')
        setCurrentProduct(singleProduct[0][1])
    }
    else{
        const starCountRefs = ref(db, "product/"+ prodId);
        onValue(starCountRefs, (snapshot) => {
            if(snapshot.val()){
               setCurrentProduct(snapshot.val())
          }
        });
        console.log('not from product')

    }
  },[])

  return (
    <div>
      <Link to={'/products'} >
        <Button m="70px 10px 10px 10px ">Назад</Button>
      </Link>
      {currentProduct && (
        <div class="d-flex justify-content-center container">
        <div class="card p-3 bg-white"><i class="fa fa-apple"></i>
            <div class="about-product text-center mt-2"><img src={currentProduct.url} width="300"/>
                <div>
                    <h4>{currentProduct.name}</h4>
                    <h6 class="mt-0 text-black-50">{currentProduct.type}</h6>
                </div>
            </div>
            <div class="stats mt-2">
                <div class="d-flex justify-content-between p-price"><span>Цена</span><span>{currentProduct.price}</span></div>
                <div class="d-flex justify-content-between p-price"><span>Осталось</span><span>{currentProduct.product_left}</span></div>
                <div class="d-flex justify-content-between p-price"><span>Сообщи если меньше чем-</span><span>{currentProduct.restriction}</span></div>
                <div class="d-flex justify-content-between p-price"><span>Последное обновление</span><span>{currentProduct.lastAdded_at}</span></div>
            </div>
            <div class="d-flex justify-content-between total font-weight-bold mt-4"><span>Итого продано</span><span>{currentProduct.totalSale}</span></div>
        </div>
    </div>
    )}
    </div>
  )
}

export default SHowProduct
