import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { MyContext } from '../App'

const ButtonCover=styled.div`
height:60px;
display:flex;
align-items:center;
position:relative;
z-index:2;
`
const Button=styled.button`
background:none;
height:75%;
color:black;
border-radius:5px;
padding:5px;
border:none;
letter-spacing:1.7px;
text-align:center;
margin-top:33px;
font-size:19px;
background-color:#ffc107;
transition:all 0.7s ease;
&:hover{
  height:100%;
  background:none;
border:1px solid #ffc107;
color:white;
}
`

const Home = () => {
  const navigate = useNavigate();
  const values = useContext(MyContext);
  const {setShowNav} = values;
  return (
    <div style={{width:'100vw', height:'100vh', background:'black', display:'grid',placeItems:'center'}}>
      <div>
        <h1 style={{color:'#1eff07ed', margin:'auto', fontWeight:'bold', textWrap:'wrap'}} class="display-2">OSON SAVDO</h1>
        <blockquote class="blockquote">
          <footer class="blockquote-footer mt-1.5"><cite title="Source Title">Правдивость</cite> ведет к праведности!</footer>
        </blockquote>
        <ButtonCover  >
          <Button onClick={()=>{setShowNav(true);navigate('/tables')}} sx={{fontWeight:"bold"}} className='animate__animated animate__fadeInUp' >Начать работу</Button>
        </ButtonCover>
      </div>
    </div>
  )
}

export default Home
