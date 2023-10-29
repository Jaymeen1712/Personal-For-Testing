import { useMemo } from 'react';
import moment from 'moment/moment';

import { useUnitSoldByDevices } from '../../services';
import { getDateArray, numberFormatter } from '../../../../../utills';

interface IUseUnitSoldByDeviceController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useUnitSoldByDeviceController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseUnitSoldByDeviceController) => {
  const unitSoldByDevices = useUnitSoldByDevices(
    workspaceId,
    environment,
    'quantity',
    'product_purchased',
    'count',
    'device_category',
    startDate,
    endDate
  );

  const unitSoldByDeviceData = useMemo(() => {
    if (
      unitSoldByDevices.isSuccess &&
      unitSoldByDevices.data &&
      unitSoldByDevices.data !== undefined
    ) {
      return {
        title: {
          text: '',
        },
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
        credits: { enabled: false },
        xAxis: {
          categories: unitSoldByDevices.data.dateDurations,
        },
        yAxis: {
          title: {
            text: '',
          },
          allowDecimals: false,
          min: 0,
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
        colors: ['#60A5FA', '#FCD34D', '#F87171'],
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
        plotOptions: {
          series: {
            pointWidth: 30,
          },
        },
        series: unitSoldByDevices.data.deviceData
          ? unitSoldByDevices.data.deviceData
          : [],
      };
    } else {
      const dates = getDateArray(moment(startDate), moment(endDate));

      return {
        title: {
          text: '',
        },
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
        credits: { enabled: false },
        xAxis: {
          categories: dates,
        },
        yAxis: {
          title: {
            text: '',
          },
          allowDecimals: false,
          min: 0,
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
        colors: ['#60A5FA', '#FCD34D', '#F87171'],
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
        plotOptions: {
          series: {
            pointWidth: 30,
          },
        },
        series: Array(moment(endDate).diff(moment(startDate), 'days') + 1).fill(
          0
        ),
      };
    }
  }, [endDate, startDate, unitSoldByDevices.isSuccess, unitSoldByDevices.data]);

  return {
    unitSoldByDeviceData,
    unitSoldByDevices,
  };
};

export default useUnitSoldByDeviceController;
