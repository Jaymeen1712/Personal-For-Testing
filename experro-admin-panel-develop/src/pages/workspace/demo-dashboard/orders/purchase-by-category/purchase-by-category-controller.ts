import { useMemo } from 'react';

import { usePurchaseByCategory } from '../../services';
import { numberFormatter } from '../../../../../utills';

interface IUsePurchaseByCategoryController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const usePurchaseByCategoryController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUsePurchaseByCategoryController) => {
  const purchaseByCategory = usePurchaseByCategory(
    workspaceId,
    environment,
    'quantity',
    'product_purchased',
    'sum',
    'product_category',
    startDate,
    endDate
  );

  const purchaseByCategories = useMemo(() => {
    if (
      purchaseByCategory.isSuccess &&
      purchaseByCategory.data &&
      purchaseByCategory.data !== undefined
    ) {
      return {
        title: {
          text: undefined,
        },
        chart: {
          type: 'bar',
          marginBottom: 100,
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        credits: { enabled: false },
        xAxis: {
          gridLineWidth: 1,
          lineWidth: 1,
          categories:
            purchaseByCategory.data?.categories.length > 0
              ? purchaseByCategory.data?.categories
              : ['N/A'],
          title: {
            text: null,
          },
        },
        tooltip: {
          headerFormat: '',
          // @ts-ignore
          formatter: function () {
            return (
              '<b>' +
              // @ts-ignore
              numberFormatter(this.y) +
              '</b>'
            );
          },
          style: {
            color: '#fff',
          },
          backgroundColor: '#1F2937',
          borderColor: '#1F2937',
          borderRadius: 4,
          borderWidth: 3,
          display: 'block',
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
            name: 'Purchases',
            color: '#6366F1',
            borderColor: '#6366F1',
            data:
              purchaseByCategory.data?.quantity.length > 0
                ? purchaseByCategory.data?.quantity
                : [0],
          },
        ],
        yAxis: {
          title: {
            text: null,
          },
          tickInterval: 5,
          min: 0,
          gridLineWidth: 0,
        },
      };
    } else {
      return {
        title: {
          text: undefined,
        },
        chart: {
          type: 'bar',
          marginBottom: 100,
          width: '20px',
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        credits: { enabled: false },
        categories: ['N/A'],
        xAxis: {
          gridLineWidth: 1,
          lineWidth: 1,
          categories: ['N/A'],
          title: {
            text: null,
          },
        },
        tooltip: {
          headerFormat: '',
          // @ts-ignore
          formatter: function () {
            return (
              '<b>' +
              // @ts-ignore
              numberFormatter(this.y) +
              '</b>'
            );
          },
          style: {
            color: '#fff',
          },
          backgroundColor: '#1F2937',
          borderColor: '#1F2937',
          borderRadius: 4,
          borderWidth: 3,
          display: 'block',
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
            name: 'Purchases',
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
          gridLineWidth: 0,
        },
      };
    }
  }, [purchaseByCategory.data, purchaseByCategory.isSuccess]);

  return { purchaseByCategories, purchaseByCategory };
};

export default usePurchaseByCategoryController;
