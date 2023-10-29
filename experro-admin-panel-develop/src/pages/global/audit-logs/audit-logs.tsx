import React from 'react';
import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import SubSideBar from '../../../components/sub-sidebar';
import useAuditLogsController from './audit-logs-controller';
import ListAuditLogs from './list';
import HeaderAuditLogs from './header-audit-logs';

interface IAuditLogs {
  onMainSidebarActiveItem?: (val: string) => void;
}

const AuditLogs: React.FC<IAuditLogs> = ({ onMainSidebarActiveItem }) => {
  const {
    t,
    startDate,
    endDate,
    onStartDateEndDateChange,
  } = useAuditLogsController({ onMainSidebarActiveItem });

  return (
    <>
      <SubSideBar
        isGlobalPage={true}
        sidebarActiveItemKey={SIDEBAR_KEYS.GLOBAL.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.AUDIT_LOGS
        }>
        <HeaderAuditLogs
          t={t}
          startDate={startDate}
          endDate={endDate}
          onStartDateEndDateChange={onStartDateEndDateChange}
        />
        <ListAuditLogs
          startDate={startDate}
          endDate={endDate}
        />
      </SubSideBar>
    </>
  );
};

export default AuditLogs;
