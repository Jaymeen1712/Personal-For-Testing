import { useMemo } from 'react';
import { TFunction } from 'react-i18next';

import useFromSessionStartToPurchase from '../../services/from-session-start-to-purchase';
import { FROM_SESSION_START_TO_PURCHASE } from '../../../../../utills';

interface IUseFromSessionStartToPurchaseController {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useFromSessionStartToPurchaseController = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseFromSessionStartToPurchaseController) => {
  const fromSessionStartToPurchase = useFromSessionStartToPurchase(
    workspaceId,
    environment,
    'eventCount',
    FROM_SESSION_START_TO_PURCHASE,
    'count',
    startDate,
    endDate
  );

  const fromSessionStartToPurchaseInfo = useMemo(() => {
    if (
      fromSessionStartToPurchase.isSuccess &&
      fromSessionStartToPurchase.data &&
      fromSessionStartToPurchase.data !== undefined
    ) {
      return {
        title: {
          text: undefined,
        },
        credits: { enabled: false },
        chart: {
          type: 'column',
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        xAxis: {
          categories:
            fromSessionStartToPurchase.data
              ?.fromSessionStartToPurchaseCategories.length > 0
              ? fromSessionStartToPurchase.data
                  ?.fromSessionStartToPurchaseCategories
              : ['N/A'],
          title: {
            text: null,
          },
        },
        plotOptions: {
          series: {
            pointWidth: 38,
          },
          column: {
            dataLabels: {
              enabled: true,
              format: '{y}k',
            },
          },
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 1500,
              },
              chartOptions: {
                legend: true,
              },
            },
          ],
        },
        series: [
          {
            name: 'Purchases',
            color: '#FCD34D',
            borderColor: '#FCD34D',
            data:
              fromSessionStartToPurchase.data?.fromSessionStartToPurchaseData
                .length > 0
                ? fromSessionStartToPurchase.data
                    ?.fromSessionStartToPurchaseData
                : [0],
          },
        ],
        yAxis: {
          title: {
            text: null,
          },
          tickInterval: 5,
          min: 0,
          labels: {
            // @ts-ignore
            formatter: function () {
              // @ts-ignore
              return this.value + 'k';
            },
          },
        },
      };
    } else {
      return {
        title: {
          text: undefined,
        },
        credits: { enabled: false },
        chart: {
          type: 'column',
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        xAxis: {
          categories: ['N/A'],
          title: {
            text: null,
          },
        },
        plotOptions: {
          series: {
            pointWidth: 38,
          },
          column: {
            dataLabels: {
              enabled: true,
              format: '{y}k',
            },
          },
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 1500,
              },
              chartOptions: {
                legend: true,
              },
            },
          ],
        },
        series: [
          {
            name: 'Purchases',
            color: '#FCD34D',
            borderColor: '#FCD34D',
            data: [0],
          },
        ],
        yAxis: {
          title: {
            text: null,
          },
          tickInterval: 5,
          min: 0,
          labels: {
            // @ts-ignore
            formatter: function () {
              // @ts-ignore
              return this.value + 'k';
            },
          },
        },
      };
    }
  }, [fromSessionStartToPurchase.isSuccess, fromSessionStartToPurchase.data]);

  return { fromSessionStartToPurchase, fromSessionStartToPurchaseInfo };
};

export default useFromSessionStartToPurchaseController;
