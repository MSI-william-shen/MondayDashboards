import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const ChartCard = ({ title, subtitle, children }) => (
  <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="border.subtle" boxShadow="md">
    <Heading size="md" mb={1} color="fg">{title}</Heading>
    {subtitle && <Text fontSize="xs" color="fg.muted" mb={4}>{subtitle}</Text>}
    <Box height="300px">
      {children}
    </Box>
  </Box>
);

export default ChartCard;