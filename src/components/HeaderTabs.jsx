// src/components/HeaderTabs.jsx
import React from 'react';
import { Flex, Button } from '@chakra-ui/react';

export const HeaderTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Portfolio Overview' },
    { id: 'delivery', label: 'Delivery Trends' },
    { id: 'interfaces', label: 'Interface Trends' },
    { id: 'ssrs', label: 'SSRS Trends' },
  ];

  return (
    <Flex 
      gap={4} 
      mb={6} 
      borderBottom="1px solid" 
      borderColor="border.subtle" 
      pb={4} 
      overflowX="auto"
    >
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
  );
};