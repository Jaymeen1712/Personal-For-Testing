import { useMemo } from 'react';

import {
  useTopCustomerByRevenue,
  useWorkspaceDetailsDashboard,
} from '../../services';
import { currencyFormatter } from '../../../../../utills';

interface IUseTopCustomersYRevenue {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useTopCustomersRevenueController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseTopCustomersYRevenue) => {
  const topCustomerByRevenue = useTopCustomerByRevenue(
    workspaceId,
    environment,
    'eventSum',
    'checkout_completed',
    'sum',
    'userId',
    startDate,
    endDate
  );

  const workspaceDashboardDetails = useWorkspaceDetailsDashboard(workspaceId);

  const topCustomerByRevenueData = useMemo(() => {
    if (
      topCustomerByRevenue.isSuccess &&
      topCustomerByRevenue.data &&
      topCustomerByRevenue.data !== undefined
    ) {
      return {
        title: {
          text: undefined,
        },
        credits: { enabled: false },
        chart: {
          type: 'column',
          marginBottom: 100,
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        xAxis: {
          categories:
            topCustomerByRevenue.data?.userId.length > 0
              ? topCustomerByRevenue.data?.userId
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
          enabled: true,
          verticalAlign: 'bottom',
          layout: 'horizontal',
          align: 'center',
          itemStyle: {
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
          },
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
            name: 'Revenue',
            color: '#6366F1',
            borderColor: '#6366F1',
            data:
              topCustomerByRevenue.data?.revenue.length > 0
                ? topCustomerByRevenue.data?.revenue
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
              return (
                workspaceDashboardDetails.data?.currency &&
                currencyFormatter(
                  // @ts-ignore
                  workspaceDashboardDetails.data?.currency,
                  // @ts-ignore
                  this.value
                ) + 'k'
              );
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
          marginBottom: 100,
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
          enabled: true,
          verticalAlign: 'bottom',
          layout: 'horizontal',
          align: 'center',
          itemStyle: {
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
          },
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
            name: 'Revenue',
            color: '#6366F1',
            borderColor: '#6366F1',
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
              return (
                workspaceDashboardDetails.data?.currency &&
                currencyFormatter(
                  // @ts-ignore
                  workspaceDashboardDetails.data?.currency,
                  // @ts-ignore
                  this.value
                ) + 'k'
              );
            },
          },
        },
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    topCustomerByRevenue.data,
    topCustomerByRevenue.isSuccess,
    workspaceDashboardDetails.data?.currency,
    workspaceDashboardDetails.data,
    workspaceDashboardDetails,
  ]);

  return {
    topCustomerByRevenue,
    topCustomerByRevenueData,
  };
};

export default useTopCustomersRevenueController;
