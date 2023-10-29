import React, { useEffect, useMemo, useState } from 'react';
import { TFunction } from 'react-i18next';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { useTopLandingPages } from '../../services';

interface ITopLandingPagesTraffic {
  name: string;
  visits: number;
  percentageChanges: number;
  isSuccess: boolean;
}

interface IUseTopLandingPagesController {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  pastStartDate?: string;
  pastEndDate?: string;
}

const useTopLandingPagesController = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}: IUseTopLandingPagesController) => {
  const [topLandingPagesData, setTopLandingPagesData] = useState<
    ITopLandingPagesTraffic[]
  >([]);

  const topLandingPages = useTopLandingPages(
    workspaceId,
    environment,
    'eventCount',
    '[CLY]_view',
    'count',
    'view',
    startDate,
    endDate
  );

  const topLandingPagesPreviousDates = useTopLandingPages(
    workspaceId,
    environment,
    'eventCount',
    '[CLY]_view',
    'count',
    'view',
    pastStartDate,
    pastEndDate
  );

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('common.labels.visits'),
        dataIndex: 'visits',
        key: 'visits',
      },
      {
        title: t('common.labels.percentage_change'),
        dataIndex: 'percentageChanges',
        key: 'percentageChanges',
        render: (
          percentageChanges: number,
          record: ITopLandingPagesTraffic
        ) => (
          <div className={`ant-row ant-row-middle`}>
            <span
              className={`ant-tag ${
                record.isSuccess ? 'ant-tag-success' : 'ant-tag-error'
              } rate`}>
              <i>
                <ArrowLineIcon />
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
      topLandingPages.isSuccess &&
      topLandingPages.data &&
      topLandingPages.data.length > 0 &&
      topLandingPagesPreviousDates.data &&
      topLandingPagesPreviousDates.isSuccess
    ) {
      const array: ITopLandingPagesTraffic[] = [];

      if (topLandingPagesPreviousDates.data.length > 0) {
        for (let i = 0; i <= topLandingPages.data.length - 1; i++) {
          for (
            let j = 0;
            j < topLandingPagesPreviousDates.data.length - 1;
            j++
          ) {
            if (
              topLandingPagesPreviousDates.data[j].view ===
              topLandingPages.data[i].view
            ) {
              array.push({
                name: topLandingPages.data[i].view,
                visits: topLandingPages.data[i].eventCount,
                percentageChanges:
                  topLandingPages.data[i].eventCount >
                  topLandingPagesPreviousDates.data[j].eventCount
                    ? (topLandingPages.data[i].eventCount /
                        topLandingPagesPreviousDates.data[j].eventCount) *
                      100
                    : (topLandingPagesPreviousDates.data[j].eventCount /
                        topLandingPages.data[i].eventCount) *
                      100,
                isSuccess:
                  topLandingPages.data[i].eventCount >
                  topLandingPagesPreviousDates.data[j].eventCount
                    ? true
                    : false,
              });
            }
          }
        }

        const notContainingElements = topLandingPages.data.filter(
          (o) => !array.some((i) => i.name === o.view)
        );

        if (notContainingElements.length > 0) {
          for (let i = 0; i <= notContainingElements.length - 1; i++) {
            array.push({
              name: notContainingElements[i].view,
              visits: notContainingElements[i].eventCount,
              percentageChanges: 100,
              isSuccess: true,
            });
          }
        }
      } else {
        for (let i = 0; i <= topLandingPages.data.length - 1; i++) {
          array.push({
            name: topLandingPages.data[i].view,
            visits: topLandingPages.data[i].eventCount,
            percentageChanges: 100,
            isSuccess: true,
          });
        }
      }

      setTopLandingPagesData([...array]);
    }
  }, [
    topLandingPages.data,
    topLandingPages.isSuccess,
    topLandingPagesPreviousDates.data,
    topLandingPagesPreviousDates.isSuccess,
  ]);

  return {
    topLandingPages,
    topLandingPagesPreviousDates,
    columns,
    topLandingPagesData,
  };
};

export default useTopLandingPagesController;
