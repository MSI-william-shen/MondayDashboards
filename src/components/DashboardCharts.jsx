import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import ChartCard from '@components/ChartCard';
import { Pie, Bar } from '@components/Charts';

export const DeliveryTrends = ({ boards, loading }) => {
  if (loading || !boards) return null;

  const transformData = (stats, labelKey) => 
    stats.map(s => ({ id: s[labelKey], label: s[labelKey], value: s.count }));

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
      <ChartCard title="Action Register Status" boardId={boards.action.boardId}>
        <Pie data={transformData(boards.action.stats, "STATUS")} showLegend colors={{ scheme: 'set2' }} />
      </ChartCard>
      <ChartCard title="Risk Register Status" boardId={boards.risk.boardId}>
        <Pie data={transformData(boards.risk.stats, "CATEGORY")} showLegend colors={{ scheme: "set2" }} />
      </ChartCard>
    </SimpleGrid>
  );
};

export const InterfaceCards = ({ boards, loading, onChartClick }) => {
  if (loading || !boards) return null;

  const transformData = (stats, labelKey) => 
    stats.map(s => ({ id: s[labelKey], label: s[labelKey], value: s.count }));

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
      <ChartCard title="RMS Interfaces" boardId={boards.interface.boardId}>
        <Bar 
          data={transformData(boards.interface.interface_rms, "DELIVERY STATUS")} 
          xField="label" 
          yField="value" 
          colors={['#1b263b']}
          layout="horizontal"
          onBarClick={(statusId) => onChartClick(boards.interface.boardId, 'interface_chart', { system: '⚖️PremierOne RMS', status: statusId },
            ["Item Name", "DELIVERY STATUS", "SYSTEM", "NOTES"]
          )}
        />
      </ChartCard>
      <ChartCard title="CAD Interfaces" boardId={boards.interface.boardId}>
        <Bar 
          data={transformData(boards.interface.interface_cad, "DELIVERY STATUS")} 
          xField="label" 
          yField="value" 
          colors={['#1b263b']}
          layout="horizontal"
          onBarClick={(statusId) => onChartClick(boards.interface.boardId, 'interface_chart', { system: '🖥️ PremierOne CAD', status: statusId },
            ["Item Name", "DELIVERY STATUS", "SYSTEM", "NOTES"]
          )}
        />
      </ChartCard>
    </SimpleGrid>
  );
};

export const SsrsCards = ({ boards, loading }) => {
  if (loading || !boards) return null;

  const transformData = (stats, labelKey) => 
    stats.map(s => ({ id: s[labelKey], label: s[labelKey], value: s.count }));

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
      <ChartCard title="RMS SSRS" boardId={boards.ssrs.boardId}>
        <Bar 
          data={transformData(boards.ssrs.ssrs_rms, "DELIVERY STATUS")} 
          xField="label" 
          yField="value" 
          colors={['#9d50dd']}
        />
      </ChartCard>
      <ChartCard title="CAD SSRS" boardId={boards.ssrs.boardId}>
        <Bar 
          data={transformData(boards.ssrs.ssrs_cad, "DELIVERY STATUS")} 
          xField="label" 
          yField="value" 
          colors={['#9d50dd']}
        />
      </ChartCard>
    </SimpleGrid>
  );
};