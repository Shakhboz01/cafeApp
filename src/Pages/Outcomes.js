import { Button } from '@chakra-ui/react'
import React from 'react'
import OutcomeDataGrid from '../Components/OutcomeDataGrid'
import OutcomeModal from '../Components/OutcomeModal'

const Outcomes = () => {
  return (
    <>
      <Button mt='2'></Button>
      <OutcomeModal/>
      <OutcomeDataGrid/>
    </>
  )
}

export default Outcomes
