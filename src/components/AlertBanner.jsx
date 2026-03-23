import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';

// MUST be "export const AlertBanner" to match the import in App.jsx
export const AlertBanner = ({ metrics }) => {
  // Hide banner if there are no alerts
  if (!metrics || (!metrics.blocked && !metrics.delinquent)) return null;

  return (
    <Box bg="red.subtle" border="1px solid" borderColor="red.muted" p={4} borderRadius="md" mb={8}>
      <Flex align="center" gap={3}>
        <AlertTriangle color="red" size={20} />
        <Text color="red.fg" fontWeight="bold">
          Attention Required: {metrics.blocked} Blocked Items
        </Text>
      </Flex>
    </Box>
  );
};