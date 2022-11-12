import React, { useContext } from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import { MyContext } from '../App';

const PrivateRoute = ({component: RouteComponent, ...rest}) => {
  const {currentUser} = useContext(MyContext);
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute
