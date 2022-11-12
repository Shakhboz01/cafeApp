import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../App'

const Navbar = () => {
  const values = useContext(MyContext);
  const {tablesData, currentUser, setShowNav, setCurrentUser, setCallNavigationFromNavbar, tableStatuses} = values;
  const navigate = useNavigate()
  const navigations=(item)=>{
    try{
      setCallNavigationFromNavbar({
        tableNumber:item[1].tableNumber,
        tableType: item[1].tableType
      })
      if(window.location.pathname.split('/')[1] === 'order'){
        navigate('/temporary')
        setTimeout(() => {
          navigate(`/order/${item[1].tableNumber}/${item[1].tableType}`)
        }, 70);
      }
      else{
        navigate(`/order/${item[1].tableNumber}/${item[1].tableType}`)
      }

    }
    catch(error){
      console.log('error occured: ',error)
    }
  }

  const logOut = () => {
    setCurrentUser('');
    localStorage.removeItem('userData');
    setShowNav(false)
  }
  return (
    <div style={{position:"fixed",width:"100vw",zIndex:2 }} >
      <nav className="navbar navbar-expand-lg  navbar-fixed navbar-dark bg-primary">
        <Link to="/tables" >
          <div className = "navbar-brand" >OSON CAFE</div>
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/products" >
                <div className="nav-link" style={{color:'white'}} >Продукты</div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/details" >
                <div className="nav-link" style={{color:'white'}}>Детали</div>
              </Link>
            </li>
            <li class="dropdown">
              <div class="dropdown-toggle nav-link"style={{color:'white'}} data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Прочие<span class="caret"></span></div>
              <ul class=" bg-dark dropdown-menu">
                <li className="nav-item">
                  <Link to="/admin/settings" >
                    <div className="nav-link" style={{color:'white'}}>
                      Насртойки
                    </div>
                  </Link>
                </li>
              </ul>
            </li>
            {tablesData && tablesData.find(item => item[1].status === tableStatuses[2]) && (
             <li class="dropdown">
               <div class="dropdown-toggle nav-link"style={{color:'white'}} data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Столы<span class="caret"></span></div>
               <ul class=" bg-dark dropdown-menu">
                 {tablesData.sort((a, b)=>a[1].tableNumber-b[1].tableNumber)
                 .filter(table=>table[1].status == tableStatuses[2]).map(item=>(
                     <div onClick={() => navigations(item)} key={item[0]} style={{cursor:"pointer"}} className='nav-link'  >
                       {item[1].tableNumber} {item[1].title}
                     </div>
                 ))}
               </ul>
             </li>
            )}
          </ul>
          <div class="my-2 my-lg-0">
            {currentUser && (
              <button onClick={()=>logOut()} class="btn btn-danger my-2 my-sm-0" type="submit">Выйти</button>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
