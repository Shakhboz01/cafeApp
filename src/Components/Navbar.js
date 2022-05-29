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
      {/* <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>
      </li> */}
    </ul>
    {/* <form className="form-inline my-2 my-lg-0">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" ariaLabel="Search"/>
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form> */}
  </div>
</nav>
    </div>
  )
}

export default Navbar
