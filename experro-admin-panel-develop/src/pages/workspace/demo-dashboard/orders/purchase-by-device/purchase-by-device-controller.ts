import { useMemo } from 'react';

import { usePurchaseByDevice } from '../../services';

interface IUsePurchaseByDeviceController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const usePurchaseByDeviceController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUsePurchaseByDeviceController) => {
  const purchaseByDeviceData = usePurchaseByDevice(
    workspaceId,
    environment,
    'quantity',
    'product_purchased',
    'count',
    'device_category',
    startDate,
    endDate
  );

  const purchasedByDevice = useMemo(() => {
    if (
      purchaseByDeviceData.isSuccess &&
      purchaseByDeviceData.data &&
      purchaseByDeviceData.data !== undefined
    ) {
      return {
        title: {
          textAlign: 'center',
          verticalAlign: 'middle',
          text: '',
        },
        credits: { enabled: false },
        colors: purchaseByDeviceData.data.colorData,
        chart: {
          type: 'pie',
          marginBottom: 100,
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        connectorPadding: -10,
        tooltip: {
          headerFormat: '',
          pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>',
          style: {
            color: '#fff',
          },
          backgroundColor: '#1F2937',
          borderColor: '#1F2937',
          borderRadius: 4,
          borderWidth: 3,
          display: 'block',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            showInLegend: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
            },
          },
        },
        legend: {
          verticalAlign: 'bottom',
          layout: 'horizontal',
          align: 'center',
          itemStyle: {
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
          },
        },
        series: [
          {
            name: 'Registrations',
            colorByPoint: true,
            data:
              purchaseByDeviceData.data &&
              purchaseByDeviceData.data.moduleWiseData
                ? purchaseByDeviceData.data.moduleWiseData
                : [],
          },
        ],
      };
    } else {
      return {
        title: {
          textAlign: 'center',
          verticalAlign: 'middle',
          text: '',
        },
        credits: { enabled: false },
        colors: ['#312E81'],
        chart: {
          type: 'pie',
          marginBottom: 100,
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        connectorPadding: -10,
        tooltip: {
          headerFormat: '',
          pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>',
          style: {
            color: '#fff',
          },
          backgroundColor: '#1F2937',
          borderColor: '#1F2937',
          borderRadius: 4,
          borderWidth: 3,
          display: 'block',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
          },
        },
        legend: {
          verticalAlign: 'bottom',
          layout: 'horizontal',
          align: 'center',
          itemStyle: {
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
          },
        },
        series: [
          {
            name: 'Registrations',
            colorByPoint: true,
            data: [['N/A', 0]],
          },
        ],
      };
    }
  }, [purchaseByDeviceData.data, purchaseByDeviceData.isSuccess]);

  return {
    purchaseByDeviceData,
    purchasedByDevice,
  };
};

export default usePurchaseByDeviceController;
