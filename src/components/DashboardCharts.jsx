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
      <ChartCard title="Action Register Status" /*subtitle="Workload distribution (excl. closed)"*/>
        <Pie data={transformData(boards.action.stats, "STATUS")} showLegend colors={{ scheme: 'set2' }} />
      </ChartCard>
      <ChartCard title = "Risk Register Status">
        <Pie data = {transformData(boards.risk.stats, "CATEGORY")} showLegend colors = {{scheme: "set2"}} />
      </ChartCard>
    </SimpleGrid>
  );
};

export const InterfaceCards = ({ boards, loading }) => {
  if (loading || !boards) return null;

  const transformData = (stats, labelKey) => 
    stats.map(s => ({ id: s[labelKey], label: s[labelKey], value: s.count }));
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
      <ChartCard title="RMS Interfaces">
          <Bar 
            data= {transformData(boards.interface.interface_rms, "DELIVERY STATUS")} 
            xField="label" 
            yField="value" 
            colors={['#1b263b']}
            layout="horizontal"
          />
        </ChartCard>
        <ChartCard title="CAD Interfaces">
          <Bar 
            data= {transformData(boards.interface.interface_cad, "DELIVERY STATUS")} 
            xField="label" 
            yField="value" 
            colors={['#1b263b']}
            layout="horizontal"
          />
        </ChartCard>
    </SimpleGrid>
  );
}
export const SsrsCards = ({ boards, loading }) => {
  if (loading || !boards) return null;

  const transformData = (stats, labelKey) => 
    stats.map(s => ({ id: s[labelKey], label: s[labelKey], value: s.count }));
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <ChartCard title="RMS SSRS" /*subtitle="In-progress requests (excl. closed)"*/>
          <Bar 
            data={transformData(boards.ssrs.ssrs_rms, "DELIVERY STATUS")} 
            xField="label" 
            yField="value" 
            colors={['#9d50dd']}
          />
        </ChartCard>
        <ChartCard title="CAD SSRS" /*subtitle="In-progress requests (excl. closed)"*/>
          <Bar 
            data={transformData(boards.ssrs.ssrs_cad, "DELIVERY STATUS")} 
            xField="label" 
            yField="value" 
            colors={['#9d50dd']}
          />
      </ChartCard>
    </SimpleGrid>
  );
}