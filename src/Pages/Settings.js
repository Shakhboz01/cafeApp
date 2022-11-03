import React, { useContext, useState } from 'react'
import { MyContext } from '../App'
import {AiFillDelete, AiFillEdit, AiFillMinusSquare, AiOutlineArrowRight} from 'react-icons/ai'
import {SiAddthis} from 'react-icons/si'
import { ref, set, update } from 'firebase/database'

const Settings = () => {
  const values = useContext(MyContext);
  const {typeOfFood, toast, db, productNaming, typeOfTables} = values;

  const [newTableName, setNewTableName] = useState('')
  const [showTable, setShowTable] = useState(false)

  const [newFoodName, setNewFoodName] = useState('')
  const [showFood, setShowFood] = useState(false)

  const [newNamingName, setNewNamingName] = useState('')
  const [showNaming, setShowNaming] = useState(false)

  //table
  const handleTableSub = (e) =>{
    e.preventDefault()
    try {
      var arr = typeOfTables;
      arr.push(newTableName);
      set(ref(db, '/settings/typeOfTables'), arr)
      setNewTableName('')
      toast({
        title:"Успешно добавлено",
        description: "",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: 'top-accent'
      })
    } catch (error) {
      alert(error)
    }
  }

  const deleteTypeOfTable = (table) => {
    try {
      var arr = typeOfTables;
      var ind = arr.findIndex(item => item === table);
      console.log(ind)
      arr.splice(ind, 1)
      set(ref(db, 'settings/typeOfTables'), arr)
      toast({
        title:"Успешно удален",
        description: "",
        status: "danger",
        duration: 2000,
        isClosable: true,
        variant: 'top-accent'
      })
    } catch (error) {
      alert(error)
    }
  }


  //food
  const deleteTypeOfFood = (table) => {
    try {
      var arr = typeOfFood;
      var ind = arr.findIndex(item => item === table);
      console.log(ind)
      arr.splice(ind, 1)
      set(ref(db, 'settings/typeOfFood'), arr)
      toast({
        title:"Успешно удален",
        description: "",
        status: "danger",
        duration: 2000,
        isClosable: true,
        variant: 'top-accent'
      })
    } catch (error) {
      alert(error)
    }
  }

  const handleFoodSub = (e) =>{
    e.preventDefault()
    try {
      var arr = typeOfFood;
      arr.push(newFoodName);
      set(ref(db, '/settings/typeOfFood'), arr)
      setNewFoodName('')
      toast({
        title:"Успешно добавлено",
        description: "",
        status: "success",
        duration: 2000,
        isClosable: true,
        variant: 'top-accent'
      })
    } catch (error) {
      alert(error)
    }
  }

  //naming
  const deleteTypeOfNaming = (table) => {
    try {
      var arr = productNaming;
      var ind = arr.findIndex(item => item === table);
      console.log(ind)
      arr.splice(ind, 1)
      set(ref(db, 'settings/productNaming'), arr)
      toast({
        title:"Успешно удален",
        description: "",
        status: "danger",
        duration: 2000,
        isClosable: true,
        variant: 'top-accent'
      })
    } catch (error) {
      alert(error)
    }
  }

  const handleNamingSub = (e) =>{
    e.preventDefault()
    try {
      var arr = productNaming;
      arr.push(newNamingName);
      set(ref(db, '/settings/productNaming'), arr)
      setNewNamingName('')
      toast({
        title:"Успешно добавлено",
        description: "",
        status: "success",
        duration: 2000,
        isClosable: true,
        variant: 'top-accent'
      })
    } catch (error) {
      alert(error)
    }
  }


  return (
    <div className = 'container'>
      <div class='row align-items-center'>
        <h1 style = {{marginTop:'80px'}} className='h3 col-12 text-center'>
          Типы стола
        </h1>
          {typeOfTables && typeOfTables.map((table, ind) => (
            <div className='p-1 m-2 ' style={{fontStyle:'oblique', fontWeight:'semi-bold', background:'rgb(58 58 58)', display:'flex', alignItems: 'center'}} key={ind}>
              <span className='h6' style={{color:'#2bff00'}}>
                {table}
              </span>
              <div>
                <AiFillDelete onDoubleClick={() => deleteTypeOfTable(table)} style={{cursor:"pointer",margin:"0 5px", color:"red",fontSize:"23px"}}/>
              </div>
            </div>
          ))}
        <div>
          {showTable ? (
            <AiFillMinusSquare style={{fontSize:'27px', cursor:'pointer', color:'red'}} onClick={()=> setShowTable(false)}/>
            ) : (
            <SiAddthis style={{color:'green', fontSize:'25px',cursor:'pointer'}} onClick={()=> setShowTable(true)}/>
          )}
        </div>
        {showTable && (
          <form className='input-group' onSubmit = {(e) => handleTableSub(e)} >
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">Новый тип стола</span>
            </div>
            <input onChange={(e)=> setNewTableName(e.target.value)} required value={newTableName} type="text" class="form-control" placeholder="Название" aria-label="Новый тип стола" aria-describedby="basic-addon1"/>
            <button type='submit' className='btn btn-primary'>Добавить</button>
          </form>
        )}
      </div>

      <div class='row align-items-center'>
        <h1 style = {{marginTop:'80px'}} className='h3 col-12 text-center'>
          Типы продукты
        </h1>
          {typeOfFood && typeOfFood.map((food, ind) => (
            <div className='p-1 m-2 ' style={{fontStyle:'oblique', fontWeight:'semi-bold', background:'rgb(58 58 58)', display:'flex', alignItems: 'center'}} key={ind}>
              <span className='h6' style = {{color:'#2bff00'}}>
                {food}
              </span>
              <div>
                <AiFillDelete onDoubleClick={() => deleteTypeOfFood(food)} style={{cursor:"pointer",margin:"0 5px", color:"red",fontSize:"23px"}}/>
              </div>
            </div>
          ))}
        <div>
          {showFood ? (
            <AiFillMinusSquare style={{fontSize:'27px', cursor:'pointer', color:'red'}} onClick={()=> setShowFood(false)}/>
            ) : (
            <SiAddthis style={{color:'green', fontSize:'25px',cursor:'pointer'}} onClick={()=> setShowFood(true)}/>
          )}
        </div>
        {showFood && (
          <form className='input-group' onSubmit = {(e) => handleFoodSub(e)} >
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">Новый тип стола</span>
            </div>
            <input onChange={(e)=> setNewFoodName(e.target.value)} required value={newFoodName} type="text" class="form-control" placeholder="Название" aria-label="Новый тип стола" aria-describedby="basic-addon1"/>
            <button type='submit' className='btn btn-primary'>Добавить</button>
          </form>
        )}
      </div>

      <div class='row align-items-center'>
        <h1 style = {{marginTop:'80px'}} className='h3 col-12 text-center'>
          Наименование
        </h1>
          {productNaming && productNaming.map((naming, ind) => (
            <div className='p-1 m-2 ' style={{fontStyle:'oblique', fontWeight:'semi-bold', background:'rgb(58 58 58)', display:'flex', alignItems: 'center'}} key={ind}>
              <span className='h6' style = {{color:'#2bff00'}}>
                {naming}
              </span>
              <div>
                <AiFillDelete onDoubleClick={() => deleteTypeOfNaming(naming)} style={{cursor:"pointer",margin:"0 5px", color:"red",fontSize:"23px"}}/>
              </div>
            </div>
          ))}
        <div>
          {showNaming ? (
            <AiFillMinusSquare style={{fontSize:'27px', cursor:'pointer', color:'red'}} onClick={()=> setShowNaming(false)}/>
            ) : (
            <SiAddthis style={{color:'green', fontSize:'25px',cursor:'pointer'}} onClick={()=> setShowNaming(true)}/>
          )}
        </div>
        {showNaming && (
          <form className='input-group' onSubmit = {(e) => handleNamingSub(e)} >
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">Новый тип стола</span>
            </div>
            <input onChange={(e)=> setNewNamingName(e.target.value)} required value={newNamingName} type="text" class="form-control" placeholder="Название" aria-label="Новый тип стола" aria-describedby="basic-addon1"/>
            <button type='submit' className='btn btn-primary'>Добавить</button>
          </form>
        )}
      </div>
      <div class='row'>
      {/* typeOfTables */}
      </div>
      <div class='row'>
      {/* kg, gramm */}
      </div>
      <div class='row'>
      {/* Usluga */}
      </div>
      <div class='row'>
      {/* IncomeTypes */}
      </div>
      <div class='row'>
      {/* OutcomeTypes */}
      </div>
    </div>
  )
}

export default Settings
