import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../App'


const Navbar = () => {

  const values = useContext(MyContext);
  const {tablesData, setCallNavigationFromNavbar} = values;
  const navigate = useNavigate()
  const navigations=(item)=>{
      try{
        setCallNavigationFromNavbar({
          tableNumber:item[1].tableNumber,
          tableType: item[1].tableType
        })
        if(window.location.pathname.split('/')[1] === 'order'){
          navigate('/')
          setTimeout(() => {
            navigate(`/order/${item[1].tableNumber}/${item[1].tableType}`)
          }, 200);
        }
        else{
          navigate(`/order/${item[1].tableNumber}/${item[1].tableType}`)

        }

      }
      catch(error){
        console.log('error occured: ',error)
      }
  }
  return (
    <div style={{position:"fixed", width:"100vw",zIndex:2 }} >
      <nav className="navbar navbar-expand-lg  navbar-fixed navbar-dark bg-dark">
        <Link to="/" >
          <div className="navbar-brand" >Sizning cafe</div>
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link to='/' >
                <div className="nav-link" style={{cursor:'pointer'}} >Домой <span className="sr-only">(current)</span></div>
              </Link>
            </li>
            <li className="nav-item active">
              <Link to='/tables' >
                <div className="nav-link" style={{cursor:'pointer'}} >Столы <span className="sr-only">(current)</span></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" >
                <div className="nav-link" >Продукты</div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/details" >
                <div className="nav-link" >Детали</div>
              </Link>
            </li>
            <li class="dropdown">
              <div class="dropdown-toggle nav-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Столы<span class="caret"></span></div>
              <ul class=" bg-dark dropdown-menu">
                {tablesData && tablesData.sort((a,b)=>a[1].tableNumber-b[1].tableNumber)
                .filter(table=>table[1].status == 'full').map(item=>(
                    <div onClick={() => navigations(item)} key={item[0]} style={{cursor:"pointer"}} className='nav-link'  >
                      {item[1].tableNumber} {item[1].title}
                    </div>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
