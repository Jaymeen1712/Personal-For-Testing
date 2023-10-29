import React, { useMemo } from 'react';
import moment from 'moment/moment';
import { useHistory } from 'react-router-dom';

import { IRecentRecords } from '../../../../../types';
import { useRecentlyPublishedRecordsDashboard } from '../../services';

const useRecentlyPublishedRecordsCmsDashboardController = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}: IRecentRecords) => {
  const history = useHistory();

  const recentlyPublishedRecordsDashboard =
    useRecentlyPublishedRecordsDashboard(
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

  const recentlyPublishedRecordsColumns = useMemo(
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
        title: t('common.labels.published_by'),
        dataIndex: 'publishedBy',
        width: '28%',
        render: (publishedBy: string, record: object) => (
          <div className="table-text">
            {/*@ts-ignore*/}
            <div>{record.publishedBy ? record.publishedBy : '-'}</div>
          </div>
        ),
      },
      {
        title: t('common.labels.published_on'),
        dataIndex: 'publishedAt',
        width: '36%',
        render: (publishedAt: string, record: object) => (
          <div className="table-text">
            <div>
              {/*@ts-ignore*/}
              {record.publishedAt
                ? // @ts-ignore
                  moment(record.publishedAt).local().format('DD MMM YYYY,LT')
                : '-'}
            </div>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  return { recentlyPublishedRecordsColumns, recentlyPublishedRecordsDashboard };
};

export default useRecentlyPublishedRecordsCmsDashboardController;
