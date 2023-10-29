import React, { useMemo } from 'react';
import moment from 'moment/moment';
import { useHistory } from 'react-router-dom';

import { IRecentRecords } from '../../../../../types';
import { useRecentlyModifiedRecordsDashboard } from '../../services';

const useRecentlyModifiedRecordsCmsDashboardController = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}: IRecentRecords) => {
  const history = useHistory();

  const recentlyModifiedRecordsDashboard = useRecentlyModifiedRecordsDashboard(
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

  const recentlyModifiedRecordsColumns = useMemo(
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
        title: t('common.labels.modified_by'),
        dataIndex: 'modifiedBy',
        width: '28%',
        render: (modifiedBy: string, record: object) => (
          <div className="table-text">
            {/*@ts-ignore*/}
            <div>{record.modifiedBy ? record.modifiedBy : '-'}</div>
          </div>
        ),
      },
      {
        title: t('common.labels.modified_on'),
        dataIndex: 'modifiedAt',
        width: '36%',
        render: (createdAt: string, record: object) => (
          <div className="table-text">
            <div>
              {/*@ts-ignore*/}
              {record.modifiedAt
                ? // @ts-ignore
                  moment(record.modifiedAt).local().format('DD MMM YYYY,LT')
                : '-'}
            </div>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  return { recentlyModifiedRecordsDashboard, recentlyModifiedRecordsColumns };
};

export default useRecentlyModifiedRecordsCmsDashboardController;
