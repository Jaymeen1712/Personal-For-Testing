import React, { useMemo } from 'react';
import moment from 'moment/moment';
import { useHistory } from 'react-router-dom';

import { IRecentRecords } from '../../../../../types';
import { useRecentlyScheduledRecordsDashboard } from '../../services';

const useRecentlyScheduleRecordsCmsDashboardController = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}: IRecentRecords) => {
  const history = useHistory();

  const recentlyScheduledRecordDashboard = useRecentlyScheduledRecordsDashboard(
    workspaceId,
    environment,
    startDate,
    endDate
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTitleClick = (record: any) => {
    if (record.type === 'collection') {
      history.push(
        `/workspaces/${workspaceId}/content-library/collection-type/${record.contentModelId}/field/${record.id}/version/${record.currentVersionId}/language/${record.language}`
      );
    } else {
      history.push(
        `/workspaces/${workspaceId}/content-library/single-type/${record.contentModelId}/field/${record.id}/version/${record.currentVersionId}/language/${record.language}`
      );
    }
  };

  const scheduledRecordsColumns = useMemo(
    () => [
      {
        title: t('common.labels.title'),
        dataIndex: 'title',
        width: '36%',
        render: (title: string, record: object) => (
          <>
            <div className="table-text">
              <p
                className="text-blue cursor-pointer text-truncate"
                onClick={() => onTitleClick(record)}>
                {/*@ts-ignore*/}
                {record.title}
              </p>
              <span className="gray-text">
                {/*@ts-ignore*/}
                {record.contentModelName && record.contentModelName}
              </span>
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.scheduled_by'),
        dataIndex: 'createdBy',
        width: '28%',
        render: (createdBy: string, record: object) => (
          <div className="table-text">
            {/*@ts-ignore*/}
            <div>{record.createdBy ? record.createdBy : '-'}</div>
          </div>
        ),
      },
      {
        title: t('common.labels.Scheduled_on'),
        dataIndex: 'createdAt',
        width: '36%',
        render: (createdAt: string, record: object) => (
          <div className="table-text">
            <div>
              {/*@ts-ignore*/}
              {record.createdAt
                ? // @ts-ignore
                  moment(record.createdAt).local().format('DD MMM YYYY,LT')
                : '-'}
            </div>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  return { scheduledRecordsColumns, recentlyScheduledRecordDashboard };
};

export default useRecentlyScheduleRecordsCmsDashboardController;
