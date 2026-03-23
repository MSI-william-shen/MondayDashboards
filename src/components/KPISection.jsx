import React from 'react';
import { SimpleGrid, Skeleton, Box } from '@chakra-ui/react';
import KPICard from '@components/KPICard';
import { Activity, AlertOctagon, ClipboardList, TrendingUp } from 'lucide-react';

export const KPISection = ({ metrics, loading }) => {
  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="120px" borderRadius="xl" />)}
      </SimpleGrid>
    );
  }

  const kpis = [
    { 
      label: 'Critical Blocks', 
      value: metrics?.blocked || 0, 
      icon: <AlertOctagon size={32} color="#df2f4a" />,
      description: 'Items halting progress'
    },
    { 
      label: 'Delinquent RFIs', 
      value: metrics?.delinquent || 0, 
      icon: <Activity size={32} color="#fdab3d" />,
      description: 'Past response deadline'
    },
    { 
      label: 'Active Actions', 
      value: metrics?.totalActive || 0, 
      icon: <ClipboardList size={32} color="#1b263b" />,
      description: 'Total live register items'
    },
    { 
      label: 'Delivery Velocity', 
      value: 'Stable', 
      icon: <TrendingUp size={32} color="#00c875" />,
      description: 'System-wide trend'
    }
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
      {kpis.map((kpi, idx) => (
        <KPICard 
          key={idx} 
          label={kpi.label} 
          value={kpi.value} 
          icon={kpi.icon}
        />
      ))}
    </SimpleGrid>
  );
};
