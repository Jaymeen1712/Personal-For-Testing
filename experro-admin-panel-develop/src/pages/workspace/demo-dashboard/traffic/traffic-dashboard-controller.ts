import { useMemo } from 'react';
import moment from 'moment/moment';
import { TFunction } from 'react-i18next';

import { BREAK_BY, getDateArray, numberFormatter } from '../../../../utills';
import { usePieChartsDashboard, useVisitorsDashboard } from '../services';
import useUser from '../../../../hooks/user';

const useTrafficDashboardController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
  t,
}: {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  pastStartDate?: string;
  pastEndDate?: string;
  t: TFunction<'translation', undefined>;
}) => {
  const visitorsDashboard = useVisitorsDashboard(
    workspaceId,
    environment,
    startDate,
    endDate,
    false
  );

  const visitorsDashboardPreviousDurationRecords = useVisitorsDashboard(
    workspaceId,
    environment,
    pastStartDate,
    pastEndDate,
    true
  );

  const pieChartDashboardTopCategories = usePieChartsDashboard(
    workspaceId,
    environment,
    BREAK_BY,
    startDate,
    endDate
  );

  const user = useUser();

  const websiteOptions = useMemo(() => {
    if (
      visitorsDashboard.isSuccess &&
      visitorsDashboard.data &&
      visitorsDashboard.data !== undefined
    ) {
      return {
        title: {
          text: '',
        },
        chart: {
          type: 'areaspline',
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
          categories: visitorsDashboard.data?.datesOfSelectedDuration,
        },
        yAxis: {
          title: {
            text: 'Traffic',
          },
          allowDecimals: false,
          min: 0,
        },
        tooltip: {
          // @ts-ignore
          formatter: function () {
            return (
              '<b>' +
              // @ts-ignore
              numberFormatter(this.y) +
              '</b>'
            );
          },
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
          verticalAlign: 'bottom',
          layout: 'horizontal',
          align: 'center',
          itemStyle: {
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
          },
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1,
            },
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
        colors: ['#f9faaa', '#DDD6FE'],
        series: [
          {
            name: t('common.labels.visitors'),
            showInLegend: true,
            lineColor: '#F59E0B',
            plotOptions: {
              series: {
                pointStart: Date.UTC(2022, 6, 30),
                pointInterval: 36e5,
              },
            },
            marker: {
              fillColor: 'white',
              lineWidth: 2,
              lineColor: '#F59E0B',
            },
            data: visitorsDashboard.data?.totalUsersOfSelectedDuration,
          },
          {
            name: t('common.labels.new_visitors'),
            lineColor: '#8B5CF6',
            marker: {
              fillColor: 'white',
              lineWidth: 2,
              lineColor: '#8B5CF6',
            },
            showInLegend: true,
            data: visitorsDashboard.data?.totalNewUsersOfSelectedDuration,
          },
        ],
      };
    } else {
      const dates = getDateArray(moment(startDate), moment(endDate));

      return {
        title: {
          text: '',
        },
        chart: {
          type: 'areaspline',
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
            text: 'Traffic',
          },
          allowDecimals: false,
          min: 0,
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
          verticalAlign: 'bottom',
          layout: 'horizontal',
          align: 'center',
          itemStyle: {
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
          },
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1,
            },
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
        colors: ['#f9faaa', '#DDD6FE'],
        series: [
          {
            name: t('common.labels.visitors'),
            showInLegend: true,
            lineColor: '#F59E0B',
            plotOptions: {
              series: {
                pointStart: Date.UTC(2022, 6, 30),
                pointInterval: 36e5,
              },
            },
            marker: {
              fillColor: 'white',
              lineWidth: 2,
              lineColor: '#F59E0B',
            },
            data: Array(
              moment(endDate).diff(moment(startDate), 'days') + 1
            ).fill(0),
          },
          {
            name: t('common.labels.new_visitors'),
            lineColor: '#8B5CF6',
            marker: {
              fillColor: 'white',
              lineWidth: 2,
              lineColor: '#8B5CF6',
            },
            showInLegend: true,
            data: Array(
              moment(endDate).diff(moment(startDate), 'days') + 1
            ).fill(0),
          },
        ],
      };
    }
  }, [
    visitorsDashboard.data,
    visitorsDashboard.isSuccess,
    t,
    startDate,
    endDate,
  ]);

  const topDevicesOptions = useMemo(() => {
    if (
      pieChartDashboardTopCategories.isSuccess &&
      pieChartDashboardTopCategories.data &&
      pieChartDashboardTopCategories.data.length > 0
    ) {
      return {
        title: {
          textAlign: 'center',
          verticalAlign: 'middle',
          text: '',
        },
        credits: { enabled: false },
        colors:
          pieChartDashboardTopCategories.data[0]['device_category'].colorData,
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

              const x = event.target.plotSizeX / 2 - event.target.plotLeft / 2;
              const y = event.target.plotSizeY / 2 + event.target.plotTop;

              event.middleValue = event.target.renderer
                .text(t('common.labels.no_of_sessions'), x - 15, y)
                .css({
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#6B7280',
                })
                .add();

              event.middleValueLabel = event.target.renderer
                .text(
                  pieChartDashboardTopCategories.data &&
                    pieChartDashboardTopCategories.data[0]['device_category']
                      .totalModuleCount &&
                    pieChartDashboardTopCategories.data[0]['device_category']
                      .totalModuleCount !== undefined
                    ? numberFormatter(
                        pieChartDashboardTopCategories.data[0][
                          'device_category'
                        ].totalModuleCount
                      )
                    : numberFormatter(0),
                  4,
                  14
                )
                .css({
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '24px',
                  color: '#111827',
                })
                .add();

              event.middleValueLabel.translate(
                x - event.middleValueLabel.getBBox().width / 4,
                y + event.middleValue.getBBox().height / 2
              );
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
        series: [
          {
            name: 'Registrations',
            colorByPoint: true,
            innerSize: '70%',
            data:
              pieChartDashboardTopCategories.data &&
              pieChartDashboardTopCategories.data[0]['device_category']
                .moduleWiseData
                ? pieChartDashboardTopCategories.data[0]['device_category']
                    .moduleWiseData
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

              const x = event.target.plotSizeX / 2 - event.target.plotLeft / 2;
              const y = event.target.plotSizeY / 2 + event.target.plotTop;

              event.middleValue = event.target.renderer
                .text(t('common.labels.no_of_sessions'), x - 15, y)
                .css({
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#6B7280',
                })
                .add();

              event.middleValueLabel = event.target.renderer
                .text(numberFormatter(0), 4, 14)
                .css({
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '24px',
                  color: '#111827',
                })
                .add();

              event.middleValueLabel.translate(
                x - event.middleValueLabel.getBBox().width / 4,
                y + event.middleValue.getBBox().height / 2
              );
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
  }, [
    t,
    pieChartDashboardTopCategories.data,
    pieChartDashboardTopCategories.isSuccess,
  ]);

  const topOsOptions = useMemo(() => {
    if (
      pieChartDashboardTopCategories.isSuccess &&
      pieChartDashboardTopCategories.data &&
      pieChartDashboardTopCategories.data?.length > 0
    ) {
      return {
        title: {
          textAlign: 'center',
          verticalAlign: 'middle',
          text: '',
        },
        credits: { enabled: false },
        colors: pieChartDashboardTopCategories.data[0]['os_name'].colorData,
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

              const x = event.target.plotSizeX / 2 - event.target.plotLeft / 2;
              const y = event.target.plotSizeY / 2 + event.target.plotTop;

              event.middleValue = event.target.renderer
                .text(t('common.labels.no_of_sessions'), x - 15, y)
                .css({
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#6B7280',
                })
                .add();

              event.middleValueLabel = event.target.renderer
                .text(
                  pieChartDashboardTopCategories.data &&
                    pieChartDashboardTopCategories.data[0]['os_name']
                      .totalModuleCount &&
                    pieChartDashboardTopCategories.data[0]['os_name']
                      .totalModuleCount !== undefined
                    ? numberFormatter(
                        pieChartDashboardTopCategories.data[0]['os_name']
                          .totalModuleCount
                      )
                    : numberFormatter(0),
                  4,
                  14
                )
                .css({
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '24px',
                  color: '#111827',
                })
                .add();

              event.middleValueLabel.translate(
                x - event.middleValueLabel.getBBox().width / 4,
                y + event.middleValue.getBBox().height / 2
              );
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
        series: [
          {
            name: 'Registrations',
            colorByPoint: true,
            innerSize: '70%',
            data:
              pieChartDashboardTopCategories.data &&
              pieChartDashboardTopCategories.data[0]['os_name'].moduleWiseData
                ? pieChartDashboardTopCategories.data[0]['os_name']
                    .moduleWiseData
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
        colors: ['#78350F'],
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

              const x = event.target.plotSizeX / 2 - event.target.plotLeft / 2;
              const y = event.target.plotSizeY / 2 + event.target.plotTop;

              event.middleValue = event.target.renderer
                .text(t('common.labels.no_of_sessions'), x - 15, y)
                .css({
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#6B7280',
                })
                .add();

              event.middleValueLabel = event.target.renderer
                .text(numberFormatter(0), 4, 14)
                .css({
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '24px',
                  color: '#111827',
                })
                .add();

              event.middleValueLabel.translate(
                x - event.middleValueLabel.getBBox().width / 4,
                y + event.middleValue.getBBox().height / 2
              );
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
  }, [
    t,
    pieChartDashboardTopCategories.data,
    pieChartDashboardTopCategories.isSuccess,
  ]);

  const topBrowsers = useMemo(() => {
    if (
      pieChartDashboardTopCategories.isSuccess &&
      pieChartDashboardTopCategories.data &&
      pieChartDashboardTopCategories.data?.length > 0
    ) {
      return {
        title: {
          textAlign: 'center',
          verticalAlign: 'middle',
          text: '',
        },
        credits: { enabled: false },
        colors: pieChartDashboardTopCategories.data[0]['device_name'].colorData,
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

              const x = event.target.plotSizeX / 2 - event.target.plotLeft / 2;
              const y = event.target.plotSizeY / 2 + event.target.plotTop;

              event.middleValue = event.target.renderer
                .text(t('common.labels.no_of_sessions'), x - 15, y)
                .css({
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#6B7280',
                })
                .add();

              event.middleValueLabel = event.target.renderer
                .text(
                  pieChartDashboardTopCategories.data &&
                    pieChartDashboardTopCategories.data[0]['device_name']
                      .totalModuleCount &&
                    pieChartDashboardTopCategories.data[0]['device_name']
                      .totalModuleCount !== undefined
                    ? numberFormatter(
                        pieChartDashboardTopCategories.data[0]['device_name']
                          .totalModuleCount
                      )
                    : numberFormatter(0),
                  4,
                  14
                )
                .css({
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '24px',
                  color: '#111827',
                })
                .add();

              event.middleValueLabel.translate(
                x - event.middleValueLabel.getBBox().width / 4,
                y + event.middleValue.getBBox().height / 2
              );
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
        series: [
          {
            name: 'Registrations',
            colorByPoint: true,
            innerSize: '70%',
            data:
              pieChartDashboardTopCategories.data &&
              pieChartDashboardTopCategories.data[0]['device_name']
                .moduleWiseData
                ? pieChartDashboardTopCategories.data[0]['device_name']
                    .moduleWiseData
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
        colors: ['#064E3B'],
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

              const x = event.target.plotSizeX / 2 - event.target.plotLeft / 2;
              const y = event.target.plotSizeY / 2 + event.target.plotTop;

              event.middleValue = event.target.renderer
                .text(t('common.labels.no_of_sessions'), x - 15, y)
                .css({
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#6B7280',
                })
                .add();

              event.middleValueLabel = event.target.renderer
                .text(numberFormatter(0), 4, 14)
                .css({
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '24px',
                  color: '#111827',
                })
                .add();

              event.middleValueLabel.translate(
                x - event.middleValueLabel.getBBox().width / 4,
                y + event.middleValue.getBBox().height / 2
              );
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
  }, [
    pieChartDashboardTopCategories.data,
    pieChartDashboardTopCategories.isSuccess,
    t,
  ]);

  const topLocations = useMemo(() => {
    if (
      pieChartDashboardTopCategories.isSuccess &&
      pieChartDashboardTopCategories.data &&
      pieChartDashboardTopCategories.data?.length > 0
    ) {
      return {
        title: {
          textAlign: 'center',
          verticalAlign: 'middle',
          text: '',
        },
        credits: { enabled: false },
        colors: pieChartDashboardTopCategories.data[0]['country'].colorData,
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

              const x = event.target.plotSizeX / 2 - event.target.plotLeft / 2;
              const y = event.target.plotSizeY / 2 + event.target.plotTop;

              event.middleValue = event.target.renderer
                .text(t('common.labels.no_of_sessions'), x - 15, y)
                .css({
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#6B7280',
                })
                .add();

              event.middleValueLabel = event.target.renderer
                .text(
                  pieChartDashboardTopCategories.data &&
                    pieChartDashboardTopCategories.data[0]['country']
                      .totalModuleCount &&
                    pieChartDashboardTopCategories.data[0]['country']
                      .totalModuleCount !== undefined
                    ? numberFormatter(
                        pieChartDashboardTopCategories.data[0]['country']
                          .totalModuleCount
                      )
                    : numberFormatter(0),
                  4,
                  14
                )
                .css({
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '24px',
                  color: '#111827',
                })
                .add();

              event.middleValueLabel.translate(
                x - event.middleValueLabel.getBBox().width / 4,
                y + event.middleValue.getBBox().height / 2
              );
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
        series: [
          {
            name: 'Registrations',
            colorByPoint: true,
            innerSize: '70%',
            data:
              pieChartDashboardTopCategories.data &&
              pieChartDashboardTopCategories.data[0]['country'].moduleWiseData
                ? pieChartDashboardTopCategories.data[0]['country']
                    .moduleWiseData
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
        colors: ['#7F1D1D'],
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

              const x = event.target.plotSizeX / 2 - event.target.plotLeft / 2;
              const y = event.target.plotSizeY / 2 + event.target.plotTop;

              event.middleValue = event.target.renderer
                .text(t('common.labels.no_of_sessions'), x - 15, y)
                .css({
                  fontSize: '12px',
                  lineHeight: '14px',
                  color: '#6B7280',
                })
                .add();

              event.middleValueLabel = event.target.renderer
                .text(numberFormatter(0), 4, 14)
                .css({
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '24px',
                  color: '#111827',
                })
                .add();

              event.middleValueLabel.translate(
                x - event.middleValueLabel.getBBox().width / 4,
                y + event.middleValue.getBBox().height / 2
              );
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
  }, [
    t,
    pieChartDashboardTopCategories.isSuccess,
    pieChartDashboardTopCategories.data,
  ]);

  return {
    websiteOptions,
    topDevicesOptions,
    topOsOptions,
    topBrowsers,
    topLocations,
    visitorsDashboard,
    visitorsDashboardPreviousDurationRecords,
    pieChartDashboardTopCategories,
    userEmail: user?.user?.email,
  };
};

export default useTrafficDashboardController;
