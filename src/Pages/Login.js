import { useContext, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  Checkbox,
  FormHelperText,
  InputRightElement
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import {signInWithEmailAndPassword, getAuth} from 'firebase/auth'
import { MyContext } from "../App";
import { useNavigate } from "react-router-dom";
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const values = useContext(MyContext);

  const {setCurrentUser} = values;
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [remember, setRemember] = useState(false)

  const navigate = useNavigate()
  const handleShowClick = () => setShowPassword(!showPassword);
  const auth = getAuth()
  const handleLoginSubmit = async e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);

    try {
        await signInWithEmailAndPassword(auth, email, password)
        navigate('/')
        var user = {
          role: email.split('@')[0],
          email:email
        }
        remember && localStorage.setItem('userData', JSON.stringify({...user}));
        setCurrentUser({...user})
    } catch (error) {
      alert('Почта или код не правильно')
    }
  };
  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleLoginSubmit}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="email" onChange={(e)=> setEmail(e.target.value)} placeholder="test@gmail.com" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="testpass"
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Спрятать" : "Показать"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Checkbox onChange={(e)=>setRemember(e.target.checked)}>Запомнить меня</Checkbox>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Войти
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
