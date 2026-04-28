import { useState, useEffect, useCallback } from 'react';
import * as SDK from '@api/BoardSDK.js';

export const useExecutiveData = (projectName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoardData = useCallback(async () => {
    if (!projectName) return;
    setLoading(true);
    setError(null);

    try {
      // Dynamically instantiate trackers using the projectName prefix
      const sdk = {
        action: new SDK[`${projectName}_ActionRegister_Tracker`](),
        ssrs: new SDK[`${projectName}_SSRS_Tracker`](),
        interface: new SDK[`${projectName}_Interface_Tracker`](),
        rfi: new SDK[`${projectName}_RFILog_Tracker`](),
        sub: new SDK[`${projectName}_SubmittalLog_Tracker`](),
        risk: new SDK[`${projectName}_RiskRegister_Tracker`]()        
      };

      // Aggregations - Get status counts
      const [actionRaw, rfiRaw, subRaw, interfaceRaw, ssrsRaw, riskRaw] = await Promise.all([
        sdk.action.aggregate().groupBy('STATUS').countItems('count').execute(),
        sdk.rfi.aggregate().groupBy('WORK STATUS').countItems('count').execute(),
        sdk.sub.aggregate().groupBy('WORK STATUS').countItems('count').execute(),
        sdk.interface.aggregate().groupBy('DELIVERY STATUS').countItems('count').execute(),
        sdk.ssrs.aggregate().groupBy('DELIVERY STATUS').countItems('count').execute(),
        sdk.risk.aggregate().groupBy("CATEGORY").countItems("count").execute()
      ]);

      // Manual Filtering to remove closed/complete items
      const activeStats = {
        action: actionRaw.filter(s => s["STATUS"] !== 'CLOSED'),
        rfi: rfiRaw.filter(s => s["WORK STATUS"] !== 'CLOSED'),
        sub: subRaw.filter(s => s["WORK STATUS"] !== 'CLOSED'),
        interface: interfaceRaw.filter(s => s["DELIVERY STATUS"] !== '✅ COMPLETE'),
        ssrs: ssrsRaw.filter(s => s["DELIVERY STATUS"] !== '✅ COMPLETE'),
        risk: riskRaw.filter(s => s["STATUS"] !== "MITIGATED")
      };

      // Critical Checks for "At Risk" counts
      const [blockedActions, delinquentRFIs, delinquentSubs, blockedInterfaces, blockedSSRS] = await Promise.all([
        sdk.action.aggregate().where({ status: ['BLOCKED', 'OVERDUE MSI', `OVERDUE ${projectName}`] }).countItems('count').execute(),
        sdk.rfi.aggregate().where({ "WORK STATUS": 'DELINQUENT' }).countItems('count').execute(),
        sdk.sub.aggregate().where({ "WORK STATUS": 'DELINQUENT' }).countItems('count').execute(),
        sdk.interface.aggregate().where({ "DELIVERY STATUS": '🛑 BLOCKED' }).countItems('count').execute(),
        sdk.ssrs.aggregate().where({ "DELIVERY STATUS" : '🛑 BLOCKED' }).countItems('count').execute()
      ]);

      // CAD and RMS specific data for SSRS and Interfaces
      const [cad_ssrs, rms_ssrs, cad_interfaces, rms_interfaces] = await Promise.all([
        sdk.ssrs.aggregate().where({"DATA SOURCE" : "🖥️ PremierOne CAD"}).groupBy('DELIVERY STATUS').countItems('count').execute(),
        sdk.ssrs.aggregate().where({"DATA SOURCE" : "⚖️PremierOne RMS"}).groupBy('DELIVERY STATUS').countItems("count").execute(),
        sdk.interface.aggregate().where({"SYSTEM" : "🖥️ PremierOne CAD"}).groupBy('DELIVERY STATUS').countItems('count').execute(),
        sdk.interface.aggregate().where({"SYSTEM" : "⚖️PremierOne RMS"}).groupBy('DELIVERY STATUS').countItems("count").execute(),
      ]);

      setData({
        boards: {
          action: { title: 'Action Register', stats: activeStats.action, atRisk: blockedActions[0]?.count || 0, boardId: sdk.action.boardId },
          rfi: { title: 'RFIs', stats: activeStats.rfi, atRisk: delinquentRFIs[0]?.count || 0, boardId: sdk.rfi.boardId },
          sub: { title: 'Submittals', stats: activeStats.sub, atRisk: delinquentSubs[0]?.count || 0, boardId: sdk.sub.boardId },
          ssrs: { 
            title: 'SSRS Reports', 
            stats: activeStats.ssrs, 
            atRisk: blockedSSRS[0]?.count || 0, 
            boardId: sdk.ssrs.boardId, 
            ssrs_cad: cad_ssrs, 
            ssrs_rms: rms_ssrs
          },
          interface: { 
            title: 'Interfaces', 
            stats: activeStats.interface, 
            atRisk: blockedInterfaces[0]?.count || 0, 
            boardId: sdk.interface.boardId, 
            interface_cad: cad_interfaces, 
            interface_rms: rms_interfaces 
          },
          risk: { title: "Risk Register", stats: activeStats.risk, boardId: sdk.risk.boardId }
        },
        criticalTotal: (blockedActions[0]?.count || 0) + (delinquentRFIs[0]?.count || 0) + (delinquentSubs[0]?.count || 0) + (blockedInterfaces[0]?.count || 0) + (blockedSSRS[0]?.count || 0)
      });
    } catch (err) {
      console.error('Executive Data Fetch Error:', err);
      setError('Failed to aggregate board metrics.');
    } finally {
      setLoading(false);
    }
  }, [projectName]);

  useEffect(() => { 
    fetchBoardData(); 
  }, [fetchBoardData]);

  return { data, loading, error, refetch: fetchBoardData };
};