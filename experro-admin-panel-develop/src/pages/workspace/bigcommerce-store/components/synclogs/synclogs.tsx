import React from 'react';
import { TFunction } from 'react-i18next';

import { IBigcommerceStoreSyncLog } from '../../../../../types';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import NoDataFound from '../../../../../components/no-data-found';

interface SyncLogsProps {
  storeSyncLogs?: IBigcommerceStoreSyncLog[];
  t: TFunction<'translation', undefined>;
}
const SyncLogs: React.FC<SyncLogsProps> = ({ t, storeSyncLogs }) => {
  return (
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
        <div className="HV-center table-center">
          <NoDataFound
            icon={<NoRecordIcon />}
            title={t('common.labels.no_data_found')}
          />
        </div>
      )}
    </div>
  );
};
export default SyncLogs;
