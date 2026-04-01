// src/components/ProjectDashboard.jsx
import React, { useState } from 'react';
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { LayoutDashboard, RefreshCw } from 'lucide-react';
import Button from '@components/Button';
import { sdpdExecutiveData} from '../hooks/sdpdExecutiveData'; 
import { mcsoExecutiveData } from '../hooks/mcsoExecutiveData';
import { BoardMetricsGrid } from './BoardMetricsGrid';
import { DeliveryTrends, InterfaceCards, SsrsCards } from './DashboardCharts';
import { AlertBanner } from './AlertBanner';
import { HeaderTabs } from './HeaderTabs';



export const ProjectDashboard = ({ projectName }) => {
  // NOTE: In the future, you can update your custom hook to accept the project name
  // e.g., useExecutiveData(projectName) so it fetches the correct Monday.com boards!
  let project;
  switch(projectName){
    case "SDPD" : 
      project = sdpdExecutiveData()
    case "MCSO" : 
      project = mcsoExecutiveData()
  } 
  const { data, loading, error, refetch } = project ;
  

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Box pb={10}>
      <Box bg="white" borderBottom="1px solid" borderColor="border.subtle" mb={6}>
        <Container maxW="container.xl" py={6}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Flex align="center" gap={3}>
              <Box bg="blue.solid" p={2} borderRadius="lg" color="white">
                <LayoutDashboard size={24} />
              </Box>
              <Box>
                {/* Dynamically insert the Project Name */}
                <Heading textStyle="2xl" fontWeight="700" color="fg">
                  {projectName} Portfolio Health
                </Heading>
                <Text color="fg.muted" textStyle="sm">
                  Active tracking and {projectName} delivery monitoring
                </Text>
              </Box>
            </Flex>

            <Button variant="ghost" onClick={refetch}>
              <RefreshCw size={16} /> Sync Data
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl">
        <AlertBanner metrics={{ blocked: data?.criticalTotal, delinquent: 0 }} />
        
        <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <Box className="fade-in">
          {activeTab === 'overview' && (
            <Box mb={10}>
              <Heading textStyle="lg" mb={4} color="fg.muted" fontWeight="600">PORTFOLIO SEGMENTS</Heading>
              <BoardMetricsGrid boards={data?.boards} loading={loading} />
            </Box>
          )}

          {activeTab === 'delivery' && (
            <Box mb={5}>
              <Heading textStyle="lg" mb={4} color="fg.muted" fontWeight="600">DELIVERY TRENDS</Heading>
              <DeliveryTrends boards={data?.boards} loading={loading} />
            </Box>
          )}

          {activeTab === 'interfaces' && (
            <Box mb={5}>
              <Heading textStyle="lg" mb={4} color="fg.muted" fontWeight="600">INTERFACE TRENDS</Heading>
              <InterfaceCards boards={data?.boards} loading={loading} />
            </Box>
          )}

          {activeTab === 'ssrs' && (
            <Box mb={5}>
              <Heading textStyle="lg" mb={4} color="fg.muted" fontWeight="600">SSRS TRENDS</Heading>
              <SsrsCards boards={data?.boards} loading={loading} />
            </Box>
          )}
        </Box>

        {error && (
          <Box mt={6} p={4} bg="red.subtle" borderRadius="md" border="1px solid" borderColor="red.muted">
            <Text color="red.fg" fontWeight="bold">Error: {error}</Text>
          </Box>
        )}
      </Container>
    </Box>
  );
};