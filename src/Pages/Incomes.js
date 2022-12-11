import { Button } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { MyContext } from '../App'
import IncomeDataGrid from '../Components/IncomeDataGrid'
import IncomeModal from '../Components/IncomeModal'

const Incomes = () => {
  const {currentUser} = useContext(MyContext);
  return (
    <div>
     <Button mt='2'></Button>
      <IncomeModal/>
      {currentUser.role === 'admin' && (
        <IncomeDataGrid/>
      )}
    </div>
  )
}

export default Incomes
