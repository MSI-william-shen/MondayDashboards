// src/components/ProjectDashboard.jsx
import React, { useState } from 'react';
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { LayoutDashboard, RefreshCw } from 'lucide-react';
import Button from '@components/Button';
import { useExecutiveData } from '../hooks/useExecutiveData';
import { BoardMetricsGrid } from './BoardMetricsGrid';
import { DeliveryTrends, InterfaceCards, SsrsCards } from './DashboardCharts';
import { AlertBanner } from './AlertBanner';
import { HeaderTabs } from './HeaderTabs';
import { BoardDetailView } from './BoardDetailView';

export const ProjectDashboard = ({ projectName }) => {

  const { data, loading, error, refetch } = useExecutiveData(projectName);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Stores { id: '...', type: '...', filterParams: {...}, visibleColumns: [...] }
  const [selectedBoardConfig, setSelectedBoardConfig] = useState(null); 

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedBoardConfig(null); 
  };

  const handleBoardClick = (boardId, type, filterParams = null, visibleColumns = null) => {
    if (boardId) {
      setSelectedBoardConfig({ id: boardId, type, filterParams, visibleColumns });
      
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

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
        
        <HeaderTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        
        <Box className="fade-in">
          {activeTab === 'overview' && (
            <Box mb={10}>
              <Heading textStyle="lg" mb={4} color="fg.muted" fontWeight="600">PORTFOLIO SEGMENTS</Heading>
              <BoardMetricsGrid boards={data?.boards} loading={loading} onCardClick={handleBoardClick} />
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
              <InterfaceCards boards={data?.boards} loading={loading} onChartClick={handleBoardClick} />
            </Box>
          )}

          {activeTab === 'ssrs' && (
            <Box mb={5}>
              <Heading textStyle="lg" mb={4} color="fg.muted" fontWeight="600">SSRS TRENDS</Heading>
              {/* ✅ Added onChartClick to SSRS Cards here */}
              <SsrsCards boards={data?.boards} loading={loading} onChartClick={handleBoardClick} />
            </Box>
          )}
        </Box>

        {error && (
          <Box mt={6} p={4} bg="red.subtle" borderRadius="md" border="1px solid" borderColor="red.muted">
            <Text color="red.fg" fontWeight="bold">Error: {error}</Text>
          </Box>
        )}

        <BoardDetailView 
          boardConfig={selectedBoardConfig} 
          projectName={projectName}
          onClose={() => setSelectedBoardConfig(null)} 
        />
        
      </Container>
    </Box>
  );
};