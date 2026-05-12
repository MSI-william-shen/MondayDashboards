import React from 'react';
import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import Button from '@components/Button';
import { ExternalLink } from 'lucide-react';

const ChartCard = ({ title, subtitle, boardId, children }) => {
  const handleOpenBoard = () => {
    if (boardId) {
      window.open(`https://motorolasolutions891304.monday.com/boards/${boardId}`, '_blank');
    }
  };

  return (
    <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="border.subtle" boxShadow="md">
      <Flex justify="space-between" align="flex-start" mb={2}>
        <Box>
          <Heading size="md" color="fg">{title}</Heading>
          {subtitle && <Text fontSize="xs" color="fg.muted">{subtitle}</Text>}
        </Box>
        
        {/* Deliberate click action */}
        {boardId && (
          <Button variant="ghost" size="xs" onClick={handleOpenBoard}>
            <ExternalLink size={14} style={{ marginRight: '4px' }} />
            View Board
          </Button>
        )}
      </Flex>
      
      <Box height="300px">
        {children}
      </Box>
    </Box>
  );
};

export default ChartCard;