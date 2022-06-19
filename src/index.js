import React from 'react';
// import ReactDOM from 'react-dom/client';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>

    <ChakraProvider>
    <App tab='home' />
    </ChakraProvider>
    </StrictMode>
);
 