import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Import defaultSystem alongside ChakraProvider
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Pass defaultSystem to the value prop */}
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);