import { Button } from '@chakra-ui/react'
import React,{useContext} from 'react'
import { MyContext } from '../App'
import OutcomeDataGrid from '../Components/OutcomeDataGrid'
import OutcomeModal from '../Components/OutcomeModal'

const Outcomes = () => {
  const {currentUser} = useContext(MyContext);
  return (
    <>
      <Button mt='2'></Button>
      <OutcomeModal/>
      {currentUser.role === 'admin' && (
        <OutcomeDataGrid/>
      )}
    </>
  )
}

export default Outcomes
