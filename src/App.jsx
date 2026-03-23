import React from 'react';
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { LayoutDashboard, RefreshCw } from 'lucide-react';
import Button from '@components/Button';
import { useExecutiveData } from './hooks/useExecutiveData'; 
import { BoardMetricsGrid } from './components/BoardMetricsGrid';
import { DeliveryTrends, InterfaceCards, SsrsCards } from './components/DashboardCharts';
import { AlertBanner } from './components/AlertBanner';
import './theme-tokens.css';

const App = () => {
  const { data, loading, error, refetch } = useExecutiveData();

  return (
    <Box bg="bg.subtle" minH="100vh" pb={10}>
      <Box bg="white" borderBottom="1px solid" borderColor="border.subtle" mb={8}>
        <Container maxW="container.xl" py={6}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Flex align="center" gap={3}>
              <Box bg="blue.solid" p={2} borderRadius="lg" color="white">
                <LayoutDashboard size={24} />
              </Box>
              <Box>
                <Heading textStyle="2xl" fontWeight="700" color="fg">SDPD Portfolio Health</Heading>
                <Text color="fg.muted" textStyle="sm">Active tracking and SDPD delivery monitoring</Text>
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
        
        <Box mb={10}>
          <Heading textStyle="lg" mb={4} color="fg.muted" fontWeight="600">PORTFOLIO SEGMENTS</Heading>
          <BoardMetricsGrid boards={data?.boards} loading={loading} />
        </Box>

        <Box mb= {5}>
          <Heading textStyle="lg" mb={4} color="fg.muted" fontWeight="600">DELIVERY TRENDS</Heading>
          <DeliveryTrends boards={data?.boards} loading={loading} />
        </Box>
        <Box mb= {5}>
          <Heading textStyle="lg" mb={4} color = "fg.muted" fontWeight = "600">INTERFACE TRENDS</Heading>
          <InterfaceCards boards = {data?.boards} loading = {loading} />
        </Box>
        <Box mb= {5}>
          <Heading textStyle="lg" mb={4} color = "fg.muted" fontWeight = "600">SSRS TRENDS</Heading>
          <SsrsCards boards = {data?.boards} loading = {loading} />
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

export default App;
