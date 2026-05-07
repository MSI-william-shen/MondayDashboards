import React from 'react';
import { SimpleGrid, Skeleton } from '@chakra-ui/react';
import { BoardHealthCard } from './BoardHealthCard';

export const BoardMetricsGrid = ({ boards, loading, onCardClick }) => {
  if (loading || !boards) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} gap={4} mb={8}>
        {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="160px" borderRadius="xl" />)}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} gap={4} mb={8}>
      <BoardHealthCard 
        title="Action Register" 
        stats={boards.action.stats} 
        atRisk={boards.action.atRisk} 
        colorPalette="blue"
        boardId={boards.action.boardId}
        onClick={(id) => onCardClick(id, 'action')}
      />
      <BoardHealthCard 
        title="RFIs" 
        stats={boards.rfi.stats} 
        atRisk={boards.rfi.atRisk} 
        colorPalette="purple"
        boardId={boards.rfi.boardId}
        onClick={(id) => onCardClick(id, 'rfi')}
      />
      <BoardHealthCard 
        title="Submittals" 
        stats={boards.sub.stats} 
        atRisk={boards.sub.atRisk} 
        colorPalette="orange"
        boardId={boards.sub.boardId}
        onClick={(id) => onCardClick(id, 'sub')}
      />
      <BoardHealthCard 
        title="SSRS Tracker" 
        stats={boards.ssrs.stats} 
        atRisk={boards.ssrs.atRisk} 
        colorPalette="teal"
        boardId={boards.ssrs.boardId}
        onClick={(id) => onCardClick(id, 'ssrs')}
      />
      <BoardHealthCard 
        title="Interfaces" 
        stats={boards.interface.stats} 
        atRisk={boards.interface.atRisk} 
        colorPalette="cyan"
        boardId={boards.interface.boardId}
        onClick={(id) => onCardClick(id, 'interface')}
      />
    </SimpleGrid>
  );
};