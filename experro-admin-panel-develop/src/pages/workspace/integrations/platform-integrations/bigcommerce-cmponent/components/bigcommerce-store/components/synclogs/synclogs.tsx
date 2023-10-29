import React from 'react';
import { TFunction } from 'react-i18next';

import { IBigcommerceStoreSyncLog } from '../../../../../../../../../types';
import NoRecordIcon from '../../../../../../../../../images/icons/no-records-icon';
import NoDataFound from '../../../../../../../../../components/no-data-found';
import { Button } from 'antd';
import RefreshIcon from '../../../../../../../../../images/icons/refresh-icon';

interface SyncLogsProps {
  storeSyncLogs?: IBigcommerceStoreSyncLog[];
  t: TFunction<'translation', undefined>;
  refreshStoreSyncLog: () => void;
  isStoreSyncLogsFetching: boolean;
}

const SyncLogs: React.FC<SyncLogsProps> = ({
  t,
  storeSyncLogs,
  refreshStoreSyncLog,
  isStoreSyncLogsFetching,
}) => {
  return (
    <>
      <div className="ant-row ant-row-end m-b-16">
        <Button
          type='text'
          size='small'
          onClick={refreshStoreSyncLog}
          loading={isStoreSyncLogsFetching}
          icon={<span className='anticon'><RefreshIcon /></span>}>
          {t('common.labels.refresh')}
        </Button>
      </div>
      <div className="store-logs">
        {storeSyncLogs && storeSyncLogs?.length > 0 ? (
          <pre>
            <ol type="1">
              {storeSyncLogs?.map((log) => (
                <li style={{ color: log.type === 'error' ? 'red' : '' }}>
                  {JSON.stringify(log)}
                </li>
              ))}
            </ol>
          </pre>
        ) : (
          <div className="HV-center">
            <NoDataFound
              icon={<NoRecordIcon />}
              title={t('common.labels.no_data_found')}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default SyncLogs;
