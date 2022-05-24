import React,{useState} from 'react'
import { Container,FormControl,
    FormLabel,
    Select,
    Input, Center, Button, Heading } from '@chakra-ui/react'
 

const Login = () => {
    // const navigate=useNavigate();
    const [role,setRole]=useState("tailor");
    const [states,setStates]=useState({});

    const error=()=>{
        alert("Что-то не так"); 
        setStates({});
    }
    const handleSubmit=(e)=>{
        e.preventDefault()
        const {name,password}=states;
        switch (role) {
            case "admin":
                if(name.toLowerCase()==='shakhboz' && password.toLowerCase()==='12345'){
                    // navigate("/admin")
                    console.log("Success")
                }
                else{ return error() }
                break;
            
            default:
                break;
        }
    }

  return (

    <Container maxW='100%' color='white' bg='teal.800' centerContent >

        <Center h="100vh" >
        <form onSubmit={(e)=>handleSubmit(e)}>
        <FormControl   display='flex' flexDirection='column' justifyContent='center' >

        <Heading mb={6} >{role}</Heading>

        <Select onChange={(e)=>setRole(e.target.value)} color='black' placeholder='Select position'>
        <option   value='admin'>Admin</option>
        <option value='tailor'>Tailor</option>
        <option value='cheif'>Cheif</option>
        </Select>

        <FormLabel htmlFor='name'>Name</FormLabel>
        <Input required onChange={(e)=>setStates(prev=>{return{...prev,name:e.target.value}})} defaultValue={states.name} id='name' type='text' />

        <FormLabel htmlFor='password'>Password</FormLabel>
        <Input required defaultValue={states.password} onChange={(e)=>setStates(prev=>{return{...prev,password:e.target.value}})} id='password' type='password'/>

        <Button type="submit" m='15px' colorScheme='blue'>Submit</Button>

        </FormControl>
            </form>    
        </Center>
    </Container>
  )
}

export default Login
