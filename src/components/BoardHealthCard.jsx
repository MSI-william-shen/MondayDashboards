import React from 'react';
import { Card, Box, Flex, Text, Badge, Stack, Separator } from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';

export const BoardHealthCard = ({ title, stats, atRisk, colorPalette = "blue", boardId, onClick }) => {
  const total = stats.reduce((acc, s) => acc + s.count, 0);
  
  return (
    <Card.Root 
      className="executive-card" 
      variant="subtle" 
      borderLeft="4px solid" 
      borderLeftColor={`${colorPalette}.solid`}
      cursor="pointer"
      onClick={() => onClick && onClick(boardId)}
      _hover={{ transform: "translateY(-4px)", shadow: "lg", borderColor: `${colorPalette}.solid` }}
      transition="all 0.2s ease"
    >
      <Card.Body p={5}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontWeight="700" color="fg" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
            {title}
          </Text>
          {/* Info Icon has been removed from here */}
        </Flex>

        <Stack gap={3}>
          <Flex justify="space-between" align="baseline">
            <Text className="kpi-value" fontSize="3xl" color="fg">{total}</Text>
            <Text fontSize="xs" color="fg.muted">TOTAL ACTIVE</Text>
          </Flex>

          <Separator />

          <Flex justify="space-between" align="center">
            <Flex align="center" gap={2}>
              <AlertCircle size={14} color={atRisk > 0 ? "#df2f4a" : "#00c875"} />
              <Text fontSize="sm" color={atRisk > 0 ? "fg.error" : "fg.success"} fontWeight="600">
                {atRisk} At Risk
              </Text>
            </Flex>
            <Badge colorPalette={atRisk > 0 ? "red" : "green"} variant="subtle" size="sm">
              {atRisk > 0 ? "ATTENTION" : "STABLE"}
            </Badge>
          </Flex>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};