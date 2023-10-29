import { useMemo } from 'react';

import { useCustomerByRegion } from '../../services';

interface IUseCustomerByRegionController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useCustomerByRegionController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseCustomerByRegionController) => {
  const customerByRegion = useCustomerByRegion(
    workspaceId,
    environment,
    'eventSum',
    'sum',
    'country',
    startDate,
    endDate
  );

  const customerByRegionData = useMemo(() => {
    if (
      customerByRegion.isSuccess &&
      customerByRegion.data &&
      customerByRegion.data !== undefined
    ) {
      return {
        title: {
          textAlign: 'center',
          verticalAlign: 'middle',
          text: '',
        },
        credits: { enabled: false },
        colors: customerByRegion.data.colorData,
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
            width: '45px',
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
          },
        },
        series: [
          {
            name: 'Registrations',
            colorByPoint: true,
            innerSize: '70%',
            data:
              customerByRegion.data && customerByRegion.data.moduleWiseData
                ? customerByRegion.data.moduleWiseData
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
            width: '45px',
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
          },
        },
        series: [
          {
            name: 'Registrations',
            colorByPoint: true,
            innerSize: '70%',
            data: [['N/A', 0]],
          },
        ],
      };
    }
  }, [customerByRegion.isSuccess, customerByRegion.data]);

  return { customerByRegion, customerByRegionData };
};

export default useCustomerByRegionController;
