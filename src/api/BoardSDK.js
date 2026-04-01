import mondaySdk from 'monday-sdk-js';
const monday = mondaySdk();
monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjYxNjM1MDE0NSwiYWFpIjoxMSwidWlkIjo4NjIzMDE5NiwiaWFkIjoiMjAyNi0wMi0wM1QyMjowNjowMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjI4Njg2NjUsInJnbiI6InVzZTEifQ.7j0rTJpDX663VvdZoJ6Qr0KrUPsCDA8Mln3IED5157I")
class BoardBase {
  constructor(boardId) {
    this.boardId = boardId;
  }

  aggregate() {
    // Variables to store the requested query operations
    let groupByKey = null;
    let countKey = 'count';
    let whereFilters = null;

    const builder = {
      groupBy: function(field) { groupByKey = field; return builder; },
      countItems: function(field) { countKey = field; return builder; },
      where: function(conditions) { whereFilters = conditions; return builder; },
      
      execute: async () => {
        try {
          // 1. Fetch the raw items from Monday
          const query = `query { boards (ids: [${this.boardId}]) { columns {id title} items_page(limit: 500) { items { name column_values { id type text } } } } }`;
          const response = await monday.api(query, { apiVersion: '2024-01' });
          
          const items = response?.data?.boards?.[0]?.items_page?.items || [];
          const columns = response?.data?.boards?.[0]?.columns || [];
          
          // Create the title dictionary
          const columnMap = {};
          columns.forEach(col => {
            columnMap[col.id] = col.title;
          });

          // 2. Flatten the items into object
          const flattenedData = items.map(item => {
            const row = { "Name": item.name };
            item.column_values.forEach(colVal => {
              const title = columnMap[colVal.id];
              if (title) {
                row[title] = colVal.text;
              }
            });
            return row;
          });

          let filteredItems = flattenedData; 

          // 3. Apply the .where() filters
          if (whereFilters) {
            filteredItems = filteredItems.filter(item => {
              return Object.entries(whereFilters).every(([key, validValues]) => {
                const itemValue = item[key];
                if (Array.isArray(validValues)) return validValues.includes(itemValue);
                return validValues === itemValue;
              });
            });
          }

          // 4. Apply the .groupBy() logic
          if (groupByKey) {
            const groups = {};
            filteredItems.forEach(item => {
              const val = item[groupByKey] || "Unknown";
              groups[val] = (groups[val] || 0) + 1;
            });

            return Object.entries(groups).map(([key, count]) => ({
              [groupByKey]: key,
              [countKey]: count
            }));
          } 
          
          // 5. If no grouping, return the total count
          return [{ [countKey]: filteredItems.length }];

        } catch (err) {
          console.error(`Error fetching board ${this.boardId}:`, err);
          return []; 
        }
      }
    };
    
    return builder;
  }
}
// Your existing specific board exports
// export class ActionRegisterMcsoBoard extends BoardBase { constructor() { super('8055409759'); } }
// export class SsrsReportsStatusTrackerMcsoBoard extends BoardBase { constructor() { super('9161263758'); } }
// export class RfiRequestForInformationMcsoBoard extends BoardBase { constructor() { super('8055796270'); } }
// export class SubSubmittalLogMcsoBoard extends BoardBase { constructor() { super('8055800458'); } }
// export class InterfaceStatusTrackerMcsoBoard extends BoardBase { constructor() { super('9043836950'); } }
export class SDPD_SSRS_Tracker extends BoardBase { constructor() {super ('18392974762')}}
export class SDPD_Interface_Tracker extends BoardBase {constructor() {super ('10009808842')}}
export class SDPD_ActionRegister_Tracker extends BoardBase{constructor() {super("8709896145")}}
export class SDPD_SubmittalLog_Tracker extends BoardBase {constructor() {super("8709902368")}}
export class SDPD_RFILog_Tracker extends BoardBase {constructor() {super("8709901882")}}
export class SDPD_RiskRegister_Tracker extends BoardBase {constructor() {super("8709898403")}}

export class MCSO_SSRS_Tracker extends BoardBase { constructor() {super ('9161263758')}}
export class MCSO_Interface_Tracker extends BoardBase {constructor() {super ('193279747')}}
export class MCSO_ActionRegister_Tracker extends BoardBase{constructor() {super("8055409759")}}
export class MCSO_SubmittalLog_Tracker extends BoardBase {constructor() {super("8055800458")}}
export class MCSO_RFILog_Tracker extends BoardBase {constructor() {super("8055796270")}}
export class MCSO_RiskRegister_Tracker extends BoardBase {constructor() {super("8055764612")}}