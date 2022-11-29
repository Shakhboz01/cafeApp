import { Button } from '@chakra-ui/react'
import React from 'react'
import IncomeDataGrid from '../Components/IncomeDataGrid'
import IncomeModal from '../Components/IncomeModal'

const Incomes = () => {
  return (
    <div>
     <Button mt='2' ></Button>
      <IncomeModal/>
      <IncomeDataGrid/>
    </div>
  )
}

export default Incomes
