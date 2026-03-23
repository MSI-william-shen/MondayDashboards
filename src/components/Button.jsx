import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

const Button = ({ children, ...props }) => {
  return (
    <ChakraButton 
      colorScheme="blue" 
      size="sm" 
      fontWeight="600"
      borderRadius="md"
      {...props}
    >
      {children}
    </ChakraButton>
  );
};

export default Button;