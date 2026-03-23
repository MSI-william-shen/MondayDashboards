// src/App.jsx
import React, { useState } from 'react';
import { Box, Flex, Container, Heading } from '@chakra-ui/react';
import { ProjectDashboard } from './components/ProjectDashboard';
import './theme-tokens.css';

const App = () => {
  // Track which project dashboard is currently active
  const [activeProject, setActiveProject] = useState('SDPD');

  return (
    <Box bg="bg.subtle" minH="100vh">
      
      {/* Top-Level Project Selection Header */}
      <Box bg="var(--executive-blue)" borderBottom="1px solid" borderColor="gray.700">
        <Container maxW="container.xl" py={3}>
          <Flex align="center" justify="space-between">
            <Heading size="md" color="white" letterSpacing="wide">
              Executive Dashboards
            </Heading>
            
            {/* Project Switcher */}
            <Flex gap={1} bg="rgba(0,0,0,0.2)" p={1} borderRadius="md">
              <Box
                as="button"
                px={4}
                py={1.5}
                borderRadius="md"
                bg={activeProject === 'SDPD' ? 'blue.solid' : 'transparent'}
                color={activeProject === 'SDPD' ? 'white' : 'gray.300'}
                fontWeight="600"
                fontSize="sm"
                onClick={() => setActiveProject('SDPD')}
                transition="all 0.2s"
              >
                SDPD
              </Box>
              <Box
                as="button"
                px={4}
                py={1.5}
                borderRadius="md"
                bg={activeProject === 'MCSO' ? 'blue.solid' : 'transparent'}
                color={activeProject === 'MCSO' ? 'white' : 'gray.300'}
                fontWeight="600"
                fontSize="sm"
                onClick={() => setActiveProject('MCSO')}
                transition="all 0.2s"
              >
                MCSO
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* By using the "key" prop, React knows to completely unmount and 
        remount the component when the project changes, resetting its internal states. 
      */}
      <ProjectDashboard key={activeProject} projectName={activeProject} />
      
    </Box>
  );
};

export default App;