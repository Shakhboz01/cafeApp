import React,{useState, useEffect, createContext, useCallback, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App'

export const LoginContext = createContext({isAuth:false, token : "", setAuth: () => {}})

const LoginProvider = ({children}) => {
  const values = useContext(MyContext);
  const {currentUser} = values;
  // const [isAuth,setAuth] = useState(localStorage.getItem("isAuth") || false)
  // const [token, setToken] = useState(localStorage.getItem("token"))
  const navigate = useNavigate();

  useEffect(() => {
    if(!currentUser){
      navigate('/login')
    }
  },[currentUser])

  return (
    <div>
      {children}
    </div>
  )
}
export default LoginProvider
