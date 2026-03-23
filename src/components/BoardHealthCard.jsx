import React from 'react';
import { Card, Box, Flex, Text, Badge, Icon, Stack, Separator } from '@chakra-ui/react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const BoardHealthCard = ({ title, stats, atRisk, colorPalette = "blue" }) => {
  const total = stats.reduce((acc, s) => acc + s.count, 0);
  
  return (
    <Card.Root className="executive-card" variant="subtle" borderLeft="4px solid" borderLeftColor={`${colorPalette}.solid`}>
      <Card.Body p={5}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontWeight="700" color="fg" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
            {title}
          </Text>
          <Icon color={`${colorPalette}.fg`} asChild>
            <Info size={16} />
          </Icon>
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
