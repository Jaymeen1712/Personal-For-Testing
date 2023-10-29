import { TFunction } from 'react-i18next';
import React, { useEffect, useMemo, useState } from 'react';

import { useSessionByTrafficSources } from '../../services';
import ZigzagArrowIcon from '../../../../../images/icons/zig-zag-arrow-icon';
import { percentage } from '../../../../../utills';
import ZigzagArrowDownIcon from '../../../../../images/icons/zig-zag-arrow-down-icon';

interface ISessionByTraffic {
  source: string;
  count: number;
  percentageChanges: number;
  isSuccess: boolean;
}

interface IUseSessionByTrafficSourcesController {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  pastStartDate?: string;
  pastEndDate?: string;
}

const useSessionByTrafficSourcesController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
  t,
}: IUseSessionByTrafficSourcesController) => {
  const [sessionByTrafficSourcesData, setSessionByTrafficSourcesData] =
    useState<ISessionByTraffic[]>([]);

  const sessionByTrafficSource = useSessionByTrafficSources(
    workspaceId,
    environment,
    'source',
    startDate,
    endDate
  );

  const sessionByTrafficSourcePreviousDuration = useSessionByTrafficSources(
    workspaceId,
    environment,
    'source',
    pastStartDate,
    pastEndDate
  );

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.source'),
        dataIndex: 'source',
        key: 'source',
      },
      {
        title: t('common.labels.counts'),
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: t('common.labels.percentage_change'),
        dataIndex: 'percentageChanges',
        key: 'percentageChanges',
        render: (percentageChanges: number, record: ISessionByTraffic) => (
          <div className={`ant-row ant-row-middle`}>
            <span
              className={`ant-tag ${
                record.isSuccess ? 'ant-tag-success' : 'ant-tag-error'
              } rate`}>
              <i>
                <ZigzagArrowIcon />
                <ZigzagArrowDownIcon />
              </i>
              {`${percentageChanges.toFixed(2)}%`}
            </span>
          </div>
        ),
      },
    ],
    [t]
  );

  useEffect(() => {
    if (
      sessionByTrafficSource.isSuccess &&
      sessionByTrafficSource.data &&
      sessionByTrafficSource.data.length > 0 &&
      sessionByTrafficSourcePreviousDuration.data &&
      sessionByTrafficSourcePreviousDuration.isSuccess
    ) {
      const array: ISessionByTraffic[] = [];

      if (sessionByTrafficSourcePreviousDuration.data.length > 0) {
        for (let i = 0; i <= sessionByTrafficSource.data.length - 1; i++) {
          for (
            let j = 0;
            j < sessionByTrafficSourcePreviousDuration.data.length - 1;
            j++
          ) {
            if (
              sessionByTrafficSourcePreviousDuration.data[j].source ===
              sessionByTrafficSource.data[i].source
            ) {
              array.push({
                source:
                  sessionByTrafficSource.data[i].source === ''
                    ? 'Direct'
                    : sessionByTrafficSource.data[i].source,
                count: sessionByTrafficSource.data[i].sessionCount,
                percentageChanges: Number(
                  Math.abs(
                    percentage(
                      sessionByTrafficSource.data[i].sessionCount,
                      sessionByTrafficSourcePreviousDuration.data[j]
                        .sessionCount
                    )
                  ).toFixed(2)
                ),
                isSuccess:
                  sessionByTrafficSource.data[i].sessionCount >
                  sessionByTrafficSourcePreviousDuration.data[j].sessionCount
                    ? true
                    : false,
              });
            }
          }
        }

        const notContainingElements = sessionByTrafficSource.data.filter(
          (o) => !array.some((i) => i.source === o.source)
        );

        if (notContainingElements.length > 0) {
          for (let i = 0; i <= notContainingElements.length - 1; i++) {
            array.push({
              source:
                notContainingElements[i].source === ''
                  ? 'Direct'
                  : notContainingElements[i].source,
              count: notContainingElements[i].sessionCount,
              percentageChanges: 100,
              isSuccess: true,
            });
          }
        }
      } else {
        for (let i = 0; i <= sessionByTrafficSource.data.length - 1; i++) {
          array.push({
            source:
              sessionByTrafficSource.data[i].source === ''
                ? 'Direct'
                : sessionByTrafficSource.data[i].source,
            count: sessionByTrafficSource.data[i].sessionCount,
            percentageChanges: 100,
            isSuccess: true,
          });
        }
      }

      setSessionByTrafficSourcesData([...array]);
    }
  }, [
    sessionByTrafficSource.data,
    sessionByTrafficSource.isSuccess,
    sessionByTrafficSourcePreviousDuration.data,
    sessionByTrafficSourcePreviousDuration.isSuccess,
  ]);

  return {
    sessionByTrafficSource,
    sessionByTrafficSourcePreviousDuration,
    columns,
    sessionByTrafficSourcesData,
  };
};

export default useSessionByTrafficSourcesController;
