import { useEffect,useState } from "react";
import Products from "./Admin/Products";
import React from "react";
import Tables from "./Admin/Tables";
import Navbar from "./Components/Navbar";
import { getDatabase, onValue, ref } from "firebase/database";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Orders from "./Tailor/Orders";
import {useToast} from '@chakra-ui/react'
import Details from "./Tailor/Details";
import firebase from "./firebase.config";
import SHowProduct from "./Admin/SHowProduct";
import NewTable from "./Admin/NewTable";

export const MyContext = React.createContext();

function App() {

  const db = getDatabase()
  const [data,setData]=useState([])
  const [notify,setNotify]=useState([]);
  const [open, setOpen] =  useState(false);
  const [tablesData,setTablesData]=useState()
  const [ordersData,setOrdersData]=useState()
  const toast=useToast()
  const [numberOfPeople,setNumberOfPeople]=useState(1)

  const currentDate = () => {
    const current = new Date();
      const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}  ${current.getHours()}:${current.getMinutes()}`;
      return date
  }

const callToast=()=>{
 return toast({
    title:"title",
    description: "description+tableNumber",
    status: "success",
    duration: 12000,
    isClosable: true,
  })
}

  //for orders
const statuses=['добавил','принял','готовил',"доставил"]
const tableStatuses= ['empty','booked','full']
const typeOfTables = ['xavli', 'darun', 'berun', 'Все'];
const typeOfFood = ['Блюдо', 'Хлеб', 'Салат', 'Напиток', 'Другой', 'Все'];
const [products, setProducts]=useState([])

useEffect(()=>{
  const initialref=ref(db,"/table");
  onValue(initialref, (snapshot) => {
    let datas=snapshot.val()
    if(snapshot.val()){
      setData(Object.entries(datas))
    }
  });
  onValue(ref(db,"/notify"),(snapshot)=>{
    if(snapshot.val()){
      setNotify(snapshot.val())
    }
  })
  const starCountRef = ref(db, 'todo/');
  const ordersRef = ref(db, 'table/');
  onValue(starCountRef, (snapshot) => {
    let data = snapshot.val()
    if(snapshot.val())
      setTablesData(Object.entries(data));
    })

  onValue(ordersRef, (snapshot) => {
    let orderData = snapshot.val()
    if(snapshot.val()){
      setOrdersData(Object.entries(orderData));
      console.log('orders',orderData)
    }
  })

  const starCountRefProd = ref(db, 'product/');
  onValue(starCountRefProd, (snapshot) => {
    if(snapshot.val()){
        setProducts (Object.entries(snapshot.val()))
    }
  })
},[])

useEffect(()=>{
   if(notify.description ){
    toast({
      title: notify.title,
      description: notify.description,
      status: notify.status,
      duration: 4000,
      isClosable: true,
    })
    let audioTag=document.getElementById(notify.title.split(" ")[1]);
    audioTag.currentTime=0;
    audioTag.play()
   }
 },[notify.change])

 const cafeData = {
  numberOfPeople,
  numberOfPeople,
  setNumberOfPeople: (e) => setNumberOfPeople(e),
  notify,
  tablesData,
  products,
  setProducts: (e) => setProducts(e),
  db,
  typeOfTables,
  typeOfFood,
  tableStatuses,
  currentDate:currentDate(),
  data,
}

  return (
    <MyContext.Provider value={cafeData}>
      <Router>
      <Navbar/>
        <audio id="удален" src="https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav" />
        <audio id="принят" src="https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3" />
        <audio id="завершен" src="http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3" />
        <audio id="стол" src="https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a" />
        <Routes>
          <Route exact path="/" element={<Tables/>} />
          <Route path="/products"  element={<Products/>}  />
          <Route path="/details"  element={<Details tablesData={tablesData} statuses={statuses} data={data} />}  />
          <Route path="/order/:tableNumber/:numberOfPeople/:tableId/:tableType" element={<Orders tablesData={tablesData} checkData={data} specialProducts={products} setCheckData={(e)=>setData(e)} notify={notify}  callToast={callToast}  statuses={statuses} setOpen={(e)=>setOpen(e)} />}  />
          <Route path="/products/:productId" element={<SHowProduct/>}  />
          <Route path="/tables" element={<NewTable/>}  />
        </Routes>
      </Router>
    </MyContext.Provider>
  );
}

export default App;
