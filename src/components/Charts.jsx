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
  LabelList // <-- Added LabelList here
} from 'recharts';
import { Box } from '@chakra-ui/react';

// A robust color palette for our Pie charts
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#df2f4a', '#00c875'];

export const Pie = ({ data, showLegend, colors }) => {
  // Ensure we don't crash if data is missing or empty
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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

// Updated Bar component with LabelList and spacing fixes
export const Bar = ({ 
  data, 
  xField = 'label', 
  yFields,           // Supports an array of keys for multiple bars
  yField = 'value',  // Fallback for single-key backward compatibility
  colors = ['#3182ce', '#e53e3e', '#38a169', '#d69e2e'], 
  layout = 'vertical' 
}) => {
  if (!data || data.length === 0) return null;

  // In Recharts, if you want horizontal bars (left-to-right), the layout prop must be 'vertical'.
  const isHorizontalBar = layout === 'horizontal';
  
  // Safely handle both single yField strings or new yFields arrays
  const dataKeys = yFields || [yField];

  return (
    <Box w="full" h="full" minH="300px">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isHorizontalBar ? 'vertical' : 'horizontal'}
          // Increased margins to ensure labels don't get clipped off the edges
          margin={
            isHorizontalBar 
              ? { top: 10, right: 20, left: 10, bottom: 5 } 
              : { top: 10, right: 20, left: 0, bottom: 10 }
          }
        >
          {isHorizontalBar ? (
            <>
              {/* Horizontal Bar Config */}
              <XAxis type="number" hide/>
              <YAxis 
                dataKey={xField} 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                width={200} // Increased width for long text
                interval={0} // Forces all labels to show
                angle={0}
                textAnchor='end'
                tick={{ fontSize: 6, fill: '#718096' }}
              />
            </>
          ) : (
            <>
              {/* Vertical Column Config */}
              <XAxis 
                dataKey={xField} 
                axisLine={false} 
                tickLine={false}
                interval={0} // Forces all labels to show
                angle={0}  // Tilts the text to prevent overlapping
                textAnchor="end" // Aligns tilted text properly to the tick
                height={80} // Gives the tilted text room at the bottom
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
            >
              {/* Adds the actual number values onto the bars */}
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