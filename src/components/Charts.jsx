import React from 'react';
import {
  PieChart,
  Pie as RechartsPie,
  Cell,
  BarChart,
  Bar as RechartsBar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList 
} from 'recharts';
import { Box } from '@chakra-ui/react';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#df2f4a', '#00c875'];

const STATUS_COLORS = {
  'WAITING MSI': '#FFBB28',      
  'ON HOLD': '#0088FE',   
  'RESOLVED': '#00C49F',     
  'OPEN / NEW': '#6e6e6e',  
  'WAITING SDPD': '#FF8042', 
  'OVERDUE MSI' : "#d61515", 
  "WAITING MCSO" : "##FF8042",
};

export const Pie = ({ data, showLegend, colors }) => {
  if (!data || data.length === 0) return null;

  return (
    <Box w="full" h="full" minH="300px">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <RechartsPie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
            nameKey="label"
          >
            {
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.id] || PIE_COLORS[index % PIE_COLORS.length]} />
              
            ))}
          </RechartsPie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
          />
          {showLegend && <Legend verticalAlign="bottom" height={36} />}
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export const Bar = ({ 
  data, 
  xField = 'label', 
  yFields,           
  yField = 'value',  
  colors = ['#3182ce', '#e53e3e', '#38a169', '#d69e2e'], 
  layout = 'vertical',
  onBarClick // <-- Add this prop
}) => {
  if (!data || data.length === 0) return null;

  const isHorizontalBar = layout === 'horizontal';
  const dataKeys = yFields || [yField];

  return (
    <Box w="full" h="full" minH="300px">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isHorizontalBar ? 'vertical' : 'horizontal'}
          margin={
            isHorizontalBar 
              ? { top: 10, right: 20, left: 10, bottom: 5 } 
              : { top: 10, right: 20, left: 0, bottom: 10 }
          }
        > 
          {isHorizontalBar ? (
            <>
              <XAxis type="number" hide/>
              <YAxis 
                dataKey={xField} 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                width={200} 
                interval={0} 
                angle={0}
                textAnchor='end'
                tick={{ fontSize: 6, fill: '#718096' }}
              />
            </>
          ) : (
            <>
              <XAxis 
                dataKey={xField} 
                axisLine={false} 
                tickLine={false}
                interval={0} 
                angle={0}  
                textAnchor="end" 
                height={80} 
                tick={{ fontSize: 8,fill: '#718096', dy: 10}}
              />
              <YAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} hide />
            </>
          )}
          
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.04)' }} 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          />
          
          {dataKeys.map((field, index) => (
            <RechartsBar 
              key={field}
              dataKey={field} 
              fill={colors[index % colors.length]} 
              radius={isHorizontalBar ? [0, 4, 4, 0] : [4, 4, 0, 0]} 
              barSize={isHorizontalBar ? 24 : 40}
              onClick={(data) => {
                 if(onBarClick) {
                   // Ensure we pass the clean id string from the transformed data
                   onBarClick(data.id || data.payload?.id || data.name);
                 }
              }}
              cursor={onBarClick ? "pointer" : "default"} // Make it look clickable
            >
              <LabelList 
                dataKey={field} 
                position={isHorizontalBar ? 'right' : 'top'} 
                fill="#4A5568" 
                fontSize={12}
                fontWeight="bold"
              />
            </RechartsBar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};