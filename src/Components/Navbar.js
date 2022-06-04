import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div>
   
      <nav  className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link to="/" >
  <div className="navbar-brand" >ANOR</div>
        </Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <Link to='/' >
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
      
    </ul>

  </div>
</nav>
    </div>
  )
}

export default Navbar
