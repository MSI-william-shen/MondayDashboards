import React, { useState, useEffect } from 'react';
import { Box, Heading, Flex, Text, Spinner, Table } from '@chakra-ui/react';
import { X, ExternalLink, SquareArrowOutUpRight } from 'lucide-react';
import Button from '@components/Button';
import { monday } from '@api/BoardSDK';

export const BoardDetailView = ({ boardConfig, projectName, onClose }) => {
  const [items, setItems] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [boardName, setBoardName] = useState('');

  useEffect(() => {
    if (!boardConfig?.id) return;
    let isMounted = true;

    const fetchRawBoardData = async () => {
      setLoading(true);
      try {
        const query = `query { 
          boards (ids: [${boardConfig.id}]) { 
            name
            columns { id title } 
            items_page(limit: 500) { 
              items { id name column_values { id type text } } 
            } 
          } 
        }`;
        
        const response = await monday.api(query, { apiVersion: '2024-01' });
        const board = response?.data?.boards?.[0];
        
        if (board && isMounted) {
          setBoardName(board.name);
          
          const rawCols = [{ id: 'name', title: 'Item Name' }, ...board.columns];
          
          let displayCols = rawCols;
          if (boardConfig.visibleColumns && boardConfig.visibleColumns.length > 0) {
            const requestedCols = boardConfig.visibleColumns
              .filter(Boolean)
              .map(c => c.toLowerCase());
              
            displayCols = rawCols.filter(c => {
              const titleMatch = (c.title || '').toLowerCase();
              const idMatch = (c.id || '').toLowerCase();
              return requestedCols.includes(titleMatch) || requestedCols.includes(idMatch);
            });
          }
          setColumns(displayCols);

          const columnMap = {};
          board.columns.forEach(c => { columnMap[c.id] = c.title; });

          const rowData = board.items_page?.items?.map(item => {
            const row = { id: item.id, name: item.name };
            item.column_values.forEach(cv => {
              row[columnMap[cv.id]] = cv.text;
            });
            return row;
          }) || [];

          const filteredItems = rowData.filter(item => {
            if (boardConfig.type === 'interface_chart') {
              const sys = item['SYSTEM'] || item['System'] || '';
              const stat = item['DELIVERY STATUS'] || item['Delivery Status'] || '';
              return sys === boardConfig.filterParams?.system && stat === boardConfig.filterParams?.status;
            }
            // ✅ New logic: Filter explicitly by the parameters sent from the SSRS Chart
            if (boardConfig.type === 'ssrs_chart') {
              const ds = item['DATA SOURCE'] || item['Data Source'] || '';
              const stat = item['DELIVERY STATUS'] || item['Delivery Status'] || '';
              return ds === boardConfig.filterParams?.dataSource && stat === boardConfig.filterParams?.status;
            }
            if (boardConfig.type === 'action') {
              const status = (item['STATUS'] || item['Status'] || '').toUpperCase();
              return ['BLOCKED', 'OVERDUE MSI', `OVERDUE ${projectName}`.toUpperCase()].includes(status);
            }
            if (boardConfig.type === 'rfi' || boardConfig.type === 'sub') {
              const status = (item['WORK STATUS'] || '').toUpperCase();
              return status === 'DELINQUENT';
            }
            if (boardConfig.type === 'interface' || boardConfig.type === 'ssrs') {
              const status = item['DELIVERY STATUS'] || '';
              return status.includes('🛑 BLOCKED');
            }
            return true; 
          });

          setItems(filteredItems);
        }
      } catch (err) {
        console.error("Error fetching board details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRawBoardData();
    return () => { isMounted = false; };
  }, [boardConfig, projectName]);

  if (!boardConfig?.id) return null;

  const handleOpenItem = (itemId) => {
    monday.execute('openItemCard', { itemId: parseInt(itemId) });
  };

  let viewTitle = 'At Risk Items';
  let viewSubtitle = 'Viewing critical/blocked items from the register';

  if (boardConfig?.type === 'interface_chart') {
    viewTitle = `${boardConfig.filterParams?.system} - ${boardConfig.filterParams?.status}`;
    viewSubtitle = 'Viewing filtered items from the chart selection';
  } else if (boardConfig?.type === 'ssrs_chart') { // ✅ Title mapping logic for SSRS
    viewTitle = `${boardConfig.filterParams?.dataSource} - ${boardConfig.filterParams?.status}`;
    viewSubtitle = 'Viewing filtered items from the chart selection';
  }

  return (
    <Box mt={10} p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="border.subtle" boxShadow="md" className="fade-in">
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="md" color="fg">{boardName || 'Board Details'} - {viewTitle}</Heading>
          <Text fontSize="sm" color="fg.muted">{viewSubtitle}</Text>
        </Box>
        <Flex gap={3}>
          <Button variant="outline" colorPalette="gray" onClick={() => monday.execute('openBoard', { board_id: parseInt(boardConfig.id) })}>
            <ExternalLink size={16} style={{marginRight: '6px'}} /> View Full Board
          </Button>
          <Button variant="ghost" colorPalette="red" onClick={onClose}>
            <X size={16} style={{marginRight: '6px'}}/> Close
          </Button>
        </Flex>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" p={10} minH="200px">
          <Spinner size="xl" color="blue.solid" />
        </Flex>
      ) : (
        <Box overflowX="auto" maxH="500px" overflowY="auto" border="1px solid" borderColor="border.subtle" borderRadius="md">
          <Table.Root size="sm" variant="line" interactive>
            <Table.Header bg="bg.subtle" position="sticky" top={0} zIndex={1}>
              <Table.Row>
                <Table.ColumnHeader whiteSpace="nowrap" fontWeight="bold">Action</Table.ColumnHeader>
                {columns.map(col => (
                  <Table.ColumnHeader key={col.id} whiteSpace="nowrap" fontWeight="bold">
                    {col.title}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <Button size="xs" colorPalette="blue" onClick={() => handleOpenItem(item.id)}>
                      <SquareArrowOutUpRight size={14} style={{ marginRight: '4px' }} /> View Item
                    </Button>
                  </Table.Cell>
                  
                  {columns.map(col => (
                    <Table.Cell key={col.id} whiteSpace="nowrap" maxW="300px" truncate>
                      {col.id === 'name' ? item.name : (item[col.title] || '-')}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
              {items.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={columns.length + 1} textAlign="center" py={8} color="fg.muted">
                    No items found matching this criteria.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};