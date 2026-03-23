import { useState, useEffect, useCallback } from 'react';
import { 
  SDPD_ActionRegister_Tracker,
  SDPD_SubmittalLog_Tracker,
  SDPD_RFILog_Tracker,
  SDPD_SSRS_Tracker,
  SDPD_Interface_Tracker,
  SDPD_RiskRegister_Tracker
} from '@api/BoardSDK.js';

export const useExecutiveData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoardData = useCallback(async () => {
    setLoading(true);
    try {
      const sdk = {
        action: new SDPD_ActionRegister_Tracker(),
        ssrs: new SDPD_SSRS_Tracker(),
        interface: new SDPD_Interface_Tracker(),
        rfi: new SDPD_RFILog_Tracker(),
        sub: new SDPD_SubmittalLog_Tracker(),
        risk: new SDPD_RiskRegister_Tracker()        
      };

      // Aggregations - Get all statuses
      const [actionResRaw, rfiResRaw, subResRaw, interfaceResRaw, ssrsResRaw, riskResRaw] = await Promise.all([
        sdk.action.aggregate().groupBy('STATUS').countItems('count').execute(),
        sdk.rfi.aggregate().groupBy('WORK STATUS').countItems('count').execute(),
        sdk.sub.aggregate().groupBy('WORK STATUS').countItems('count').execute(),
        sdk.interface.aggregate().groupBy('DELIVERY STATUS').countItems('count').execute(),
        sdk.ssrs.aggregate().groupBy('DELIVERY STATUS').countItems('count').execute(),
        sdk.risk.aggregate().groupBy("CATEGORY").countItems("count").execute()
      ]);

      // Manual Filtering (since notAnyOf is unsupported in aggregate API)
      const actionRes = actionResRaw.filter(s => s["STATUS"] !== 'CLOSED');
      const rfiRes = rfiResRaw.filter(s => s["WORK STATUS"] !== 'CLOSED');
      const subRes = subResRaw.filter(s => s["WORK STATUS"] !== 'CLOSED');
      const interfaceRes = interfaceResRaw.filter(s => s.deliveryStatus !== '✅ COMPLETE');
      const ssrsRes = ssrsResRaw.filter(s => s.deliveryStatus !== '✅ COMPLETE');
      const riskRes = riskResRaw.filter(s => s["STATUS"] != "MITIGATED");

      // Critical Checks (Direct matching filters ARE supported)
      const [blockedActions, delinquentRFIs, delinquentSubs, blockedInterfaces, blockedSSRS] = await Promise.all([
        sdk.action.aggregate().where({ status: ['BLOCKED', 'OVERDUE MSI', 'OVERDUE MCSO'] }).countItems('count').execute(),
        sdk.rfi.aggregate().where({ "WORK STATUS": 'DELINQUENT' }).countItems('count').execute(),
        sdk.sub.aggregate().where({ "WORK STATUS": 'DELINQUENT' }).countItems('count').execute(),
        sdk.interface.aggregate().where({ "DELIVERY STATUS": '🛑 BLOCKED' }).countItems('count').execute(),
        sdk.ssrs.aggregate().where({ "DELIVERY STATUS" : '🛑 BLOCKED' }).countItems('count').execute()
      ]);
      //Create the CAD and RMS separations for the SSRS and interface boards
      const [cad_ssrs, rms_ssrs, cad_interfaces, rms_interfaces] = await Promise.all([
        sdk.ssrs.aggregate().where({"DATA SOURCE" : "🖥️ PremierOne CAD"}).groupBy('DELIVERY STATUS').countItems('count').execute(),
        sdk.ssrs.aggregate().where({"DATA SOURCE" : "⚖️PremierOne RMS"}).groupBy('DELIVERY STATUS').countItems("count").execute(),
        sdk.interface.aggregate().where({"SYSTEM" : "🖥️ PremierOne CAD"}).groupBy('DELIVERY STATUS').countItems('count').execute(),
        sdk.interface.aggregate().where({"SYSTEM" : "⚖️PremierOne RMS"}).groupBy('DELIVERY STATUS').countItems("count").execute(),
      ])



      setData({
        boards: {
          action: { title: 'Action Register', stats: actionRes, atRisk: blockedActions[0]?.count || 0 },
          rfi: { title: 'RFIs', stats: rfiRes, atRisk: delinquentRFIs[0]?.count || 0 },
          sub: { title: 'Submittals', stats: subRes, atRisk: delinquentSubs[0]?.count || 0 },
          ssrs: { title: 'SSRS Reports', stats: ssrsRes, atRisk: blockedSSRS[0]?.count || 0, ssrs_cad: cad_ssrs, ssrs_rms: rms_ssrs} ,
          interface: { title: 'Interfaces', stats: interfaceRes, atRisk: blockedInterfaces[0]?.count || 0, interface_cad: cad_interfaces, interface_rms: rms_interfaces },
          risk: {title : "Risk Register", stats: riskRes}
        },
        criticalTotal: (blockedActions[0]?.count || 0) + (delinquentRFIs[0]?.count || 0) + (delinquentSubs[0]?.count || 0) + (blockedInterfaces[0]?.count || 0) + (blockedSSRS[0]?.count || 0)
      });
    } catch (err) {
      console.error('Executive Data Fetch Error:', err);
      setError('Failed to aggregate board metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBoardData(); }, [fetchBoardData]);

  return { data, loading, error, refetch: fetchBoardData };
};
