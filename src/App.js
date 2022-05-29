import { useEffect,useState } from "react";
import Products from "./Admin/Products";
import Tables from "./Admin/Tables";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import firebase from "./firebase.config";
import { getDatabase,onValue,remove, ref, set, update } from "firebase/database";
import Example from "./Components/Dashboard";
import {BrowserRouter as Router,Routes,Route,Redirect } from "react-router-dom";
import Orders from "./Tailor/Orders";
 import { useToast } from '@chakra-ui/react'
 
 import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import SimpleBackdrop from "./Components/BAckdrop";
import Details from "./Tailor/Details";
import ToastExample from "./Components/Toast";
import {GiCancel} from 'react-icons/gi'
// import { store } from "./Redux/store";

// import {Provider} from 'react-redux'

function App() {
const [data,setData]=useState([])
const [notify,setNotify]=useState([]);
const [open, setOpen] =  useState(false);
const [tablesData,setTablesData]=useState()
const toast=useToast()
const callToast=()=>{
 return toast({
    title:"title",
    description: "description+tableNumber",
    status: "success",
    duration: 12000,
    isClosable: true,
  })
}
const db=getDatabase()

  //for orders
const statuses=['добавил','принял','готовил',"доставил"]
const [products,setProducts]=useState([])
let [change,setChange]=useState("")

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
onValue(starCountRef, (snapshot) => {
  let data=snapshot.val()
  if(snapshot.val())
    
  setTablesData(Object.entries(data));
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
      duration: 9000,
      isClosable: true,
    })
    let audioTag=document.getElementById(notify.title.split(" ")[1]);
  audioTag.currentTime=0;
  audioTag.play()
   }

  
 },[notify.change])
  return (

    // <Login/>
    <>
    
   <Router>
   <Navbar/>
   <audio id="удален" src="https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav" />
   <audio id="принят" src="https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3" />
   <audio id="завершен" src="http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3" />
   <audio id="стол" src="https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a" />

  {/* <SimpleBackdrop setOpen={(e)=>setOpen(e)} open={open} /> */}
  {/* <ToastExample/> */}
    {/* {alertData.show&&(
      <Alert width='94%' m='auto' opacity='0.94' zIndex='2' position='fixed' bottom='20'   status={alertData.status}>
  <AlertIcon />
  <AlertTitle>{alertData.title}</AlertTitle>
  <AlertDescription>{alertData.description}</AlertDescription>
  <GiCancel onClick={()=>setAlertData({show:false})} style={{cursor:"pointer",fontSize:"28px",position:"absolute",right:"10",color:"red"}} />
</Alert>
    )} */}
  
<Routes>
<Route exact path="/" element={<Tables notify={notify} tablesData={tablesData} />} />
<Route path="/products"  element={<Products products={products} />}  /> 
<Route path="/details"  element={<Details tablesData={tablesData} statuses={statuses} data={data} />}  /> 
<Route path="/order/:tableNumber/:numberOfPeople/:tableId"    element={<Orders notify={notify}  callToast={callToast}  statuses={statuses} setOpen={(e)=>setOpen(e)} />}  /> 
</Routes>

</Router>
    </>
  );
}

export default App;
