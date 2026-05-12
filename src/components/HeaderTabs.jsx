import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { Printer } from 'lucide-react';

export const HeaderTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Portfolio Overview' },
    { id: 'delivery', label: 'Delivery Trends' },
    { id: 'interfaces', label: 'Interface Trends' },
    { id: 'ssrs', label: 'SSRS Trends' },
    { id: 'risk', label: 'Risk Register' }, // <-- New Tab Added
  ];

  return (
    <Flex 
      gap={4} 
      mb={6} 
      borderBottom="1px solid" 
      borderColor="border.subtle" 
      pb={4} 
      align="center"
      justify="space-between"
      wrap="wrap"
      className="no-print"
    >
      <Flex gap={4} overflowX="auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            colorPalette={activeTab === tab.id ? 'blue' : 'gray'}
            variant={activeTab === tab.id ? 'solid' : 'ghost'}
            size="sm"
            fontWeight="600"
            borderRadius="md"
            transition="all 0.2s"
          >
            {tab.label}
          </Button>
        ))}
      </Flex>

      <Button 
        onClick={() => window.print()}
        variant="outline"
        size="sm"
        colorPalette="gray"
        fontWeight="600"
      >
        <Printer size={16} style={{ marginRight: '6px' }} />
        Print Page
      </Button>
    </Flex>
  );
};