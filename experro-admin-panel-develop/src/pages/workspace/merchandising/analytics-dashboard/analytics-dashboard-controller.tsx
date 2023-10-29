import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';

import { EVENTS, getDateArray, numberFormatter } from '../../../../utills';
import { useListEnvironments } from '../../../../apis/environments';
import {
  useSearchSummaryAnalytics,
  useTopDevicesAnalytics,
  useTopSearchesClicksCartsOrdersAnalytics,
  useTopZeroSearchAndSearchAnalytics,
  useTotalSearches,
} from '../services';

interface IAnalyticsDashboardController {
  environment: string | null;
}

export interface IAnalyticaParams {
  workspaceId: string;
}

const useAnalyticsDashboardController = ({
  environment,
}: IAnalyticsDashboardController) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IAnalyticaParams>();

  const [domain, setDomain] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [pastStartDate, setPastStartDate] = useState<string>();
  const [pastEndDate, setPastEndDate] = useState<string>();

  const listEnvironments = useListEnvironments(workspaceId);

  const totalSearch = useTotalSearches(
    workspaceId,
    'product_searched',
    environment,
    startDate,
    endDate
  );

  const totalPreviousSearch = useTotalSearches(
    workspaceId,
    'product_searched',
    environment,
    pastStartDate,
    pastEndDate
  );

  const totalZeroResultSearches = useTotalSearches(
    workspaceId,
    'product_searched_zero_result',
    environment,
    startDate,
    endDate
  );

  const totalZeroResultPreviousSearches = useTotalSearches(
    workspaceId,
    'product_searched_zero_result',
    environment,
    pastStartDate,
    pastEndDate
  );

  const topZeroSearchRecordsAnalytics = useTopZeroSearchAndSearchAnalytics(
    workspaceId,
    'product_searched_zero_result',
    environment,
    startDate,
    endDate,
    'search_term'
  );

  const topSearchedRecordsAnalytics = useTopZeroSearchAndSearchAnalytics(
    workspaceId,
    'product_searched',
    environment,
    startDate,
    endDate,
    'search_term'
  );

  const searchSummaryAnalytics = useSearchSummaryAnalytics(
    workspaceId,
    'product_searched',
    environment,
    startDate,
    endDate,
    'device_category'
  );

  const topSearchesClicksCartsOrdersAnalytics =
    useTopSearchesClicksCartsOrdersAnalytics(
      workspaceId,
      EVENTS,
      environment,
      startDate,
      endDate,
      'mode',
      'search'
    );

  const topDevices = useTopDevicesAnalytics(
    workspaceId,
    'product_searched',
    environment,
    startDate,
    endDate,
    'device_category'
  );

  const searchConversionFunnelData = useMemo(() => {
    if (
      topSearchesClicksCartsOrdersAnalytics.isSuccess &&
      topSearchesClicksCartsOrdersAnalytics.data &&
      topSearchesClicksCartsOrdersAnalytics.data !== undefined
    ) {
      return {
        title: {
          text: undefined,
        },
        chart: {
          type: 'funnel',
          spacingTop: 44,
          animation: false,
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        credits: { enabled: false },
        colors: topSearchesClicksCartsOrdersAnalytics.data.colors,
        connectorPadding: -10,
        tooltip: {
          // @ts-ignore
          formatter: function () {
            return (
              '<small>' +
              // @ts-ignore
              this.point.name +
              '</small>: <b>' +
              // @ts-ignore
              numberFormatter(this.y) +
              '</b>'
            );
          },
          headerFormat: '',
          // @ts-ignore
          formatter: function () {
            return (
              '<small>' +
              // @ts-ignore
              this.point.name +
              '</small>: <b>' +
              // @ts-ignore
              numberFormatter(this.y) +
              '</b>'
            );
          },
          style: {
            color: '#fff',
            textTransform: 'capitalize',
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
          align: 'center',
          itemMarginTop: 25,
          itemMarginBottom: 0,
          itemDistance: 50,
          itemStyle: {
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
            textTransform: 'capitalize',
          },
          labelFormat: '<span>{name}</span><br/><b>{y}</b>',
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              style: {
                textTransform: 'capitalize',
                fontWeight: '500',
                fontSize: '12px',
              },
              format:
                '<small>{point.name}</small> <b>{point.percentage:.2f}%</b>',
            },
            center: ['50%', '50%'],
            neckWidth: '30%',
            neckHeight: '25%',
            width: '70%',
          },
        },
        series: [
          {
            name: 'Registrations',
            showInLegend: true,
            colorByPoint: true,
            data:
              topSearchesClicksCartsOrdersAnalytics.data &&
              topSearchesClicksCartsOrdersAnalytics.data.selectedModuleData
                ? topSearchesClicksCartsOrdersAnalytics.data.selectedModuleData
                : [],
          },
        ],
      };
    } else {
      return {
        title: {
          text: undefined,
        },
        credits: { enabled: false },
        colors: ['#6366F1'],
        chart: {
          type: 'funnel',
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
          // @ts-ignore
          formatter: function () {
            return (
              '<small>' +
              // @ts-ignore
              this.point.name +
              '</small>: <b>' +
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
            dataLabels: {
              enabled: true,
              style: {
                textTransform: 'capitalize',
                fontWeight: '500',
                fontSize: '12px',
              },
              format:
                '<small>{point.name}</small>  <b>{point.percentage:.2f}%</b>',
            },
            center: ['40%', '50%'],
            neckWidth: '30%',
            neckHeight: '25%',
            width: '80%',
          },
        },
        legend: {
          verticalAlign: 'bottom',
          align: 'center',
          itemMarginTop: 25,
          itemMarginBottom: 0,
          itemDistance: 50,
          itemStyle: {
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
            textTransform: 'capitalize',
          },
          labelFormat: '<span>{name}</span><br/><b>{y}</b>',
        },
        series: [
          {
            showInLegend: true,
            colorByPoint: true,
            data: [['N/A', 0]],
          },
        ],
      };
    }
  }, [
    topSearchesClicksCartsOrdersAnalytics.isSuccess,
    topSearchesClicksCartsOrdersAnalytics.data,
  ]);

  const onProductName = useCallback(
    (record: object) => {
      window.open(
        // @ts-ignore
        `https://${domain}/search?q=${record.segment_value}`,
        '_blank'
      );
    },
    [domain]
  );

  const topTenZeroResultSearch = useMemo(
    () => [
      {
        title: t('common.labels.search_term'),
        dataIndex: 'segment_value',
        width: '80%',
        render: (segment_value: string, record: object) => (
          <>
            <p
              className="text-blue text-truncate cursor-pointer"
              onClick={() => onProductName(record)}>
              {/*@ts-ignore*/}
              {record.segment_value ? record.segment_value : '-'}
            </p>
          </>
        ),
      },
      {
        title: t('common.labels.hits'),
        dataIndex: 'total_count',
        width: '20%',
        render: (total_count: number, record: object) => (
          <>
            <p className="text-truncate">
              {/*@ts-ignore*/}
              {record.total_count ? numberFormatter(record.total_count) : '-'}
            </p>
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, onProductName]
  );

  const topTenSearchResultSearch = useMemo(
    () => [
      {
        title: t('common.labels.search_term'),
        dataIndex: 'segment_value',
        width: '80%',
        render: (segment_value: string, record: object) => (
          <>
            <p
              className="text-blue text-truncate cursor-pointer"
              onClick={() => onProductName(record)}>
              {/*@ts-ignore*/}
              {record.segment_value ? record.segment_value : '-'}
            </p>
          </>
        ),
      },
      {
        title: t('common.labels.hits'),
        dataIndex: 'total_count',
        width: '20%',
        render: (total_count: number, record: object) => (
          <>
            <p className="text-truncate">
              {/*@ts-ignore*/}
              {record.total_count ? numberFormatter(record.total_count) : '-'}
            </p>
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, onProductName]
  );

  const topDevicesAnalytics = useMemo(() => {
    if (
      topDevices.isSuccess &&
      topDevices.data &&
      topDevices.data !== undefined
    ) {
      return {
        title: {
          text: '',
        },
        chart: {
          type: 'column',
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        credits: { enabled: false },
        xAxis: {
          categories: topDevices.data.dateDurations,
        },
        yAxis: {
          title: {
            text: '',
          },
        },
        legend: {
          verticalAlign: 'bottom',
          align: 'center',
          itemStyle: {
            color: '#6C6B80',
            fontWeight: 'normal',
            fontSize: '14px',
            textTransform: 'capitalize',
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
          shared: false,
          style: {
            color: '#fff',
          },
          backgroundColor: '#1F2937',
          borderColor: '#1F2937',
          borderRadius: 4,
          borderWidth: 3,
          display: 'block',
        },
        series: topDevices.data.deviceData ? topDevices.data.deviceData : [],
      };
    } else {
      const dates = getDateArray(moment(startDate), moment(endDate));

      return {
        title: {
          text: '',
        },
        chart: {
          type: 'column',
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
        },
        legend: {
          verticalAlign: 'bottom',
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
          shared: false,
          style: {
            color: '#fff',
          },
          backgroundColor: '#1F2937',
          borderColor: '#1F2937',
          borderRadius: 4,
          borderWidth: 3,
          display: 'block',
        },
        series: Array(moment(endDate).diff(moment(startDate), 'days') + 1).fill(
          0
        ),
      };
    }
  }, [topDevices.data, topDevices.isSuccess, startDate, endDate]);

  const searchSummary = useMemo(() => {
    if (
      searchSummaryAnalytics.isSuccess &&
      searchSummaryAnalytics.data &&
      searchSummaryAnalytics.data !== undefined
    ) {
      return {
        title: {
          text: '',
        },
        chart: {
          type: 'areaspline',
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            load: function (event: any) {
              event.target.reflow();
            },
          },
        },
        credits: { enabled: false },
        xAxis: {
          categories: searchSummaryAnalytics.data?.datesOfSelectedDuration,
        },
        yAxis: {
          title: {
            text: '',
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
          enabled: false,
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
        colors: ['#DDD6FE', '#f9faaa'],
        series: [
          {
            name: t('common.labels.search'),
            showInLegend: true,
            lineColor: '#8B5CF6',
            plotOptions: {
              series: {
                pointStart: Date.UTC(2022, 6, 30),
                pointInterval: 36e5,
              },
            },
            marker: {
              fillColor: 'white',
              lineWidth: 2,
              lineColor: '#8B5CF6',
            },
            data: searchSummaryAnalytics.data?.totalSearchesOfSelectedDuration,
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
          enabled: false,
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
        colors: ['#DDD6FE', '#f9faaa'],
        series: [
          {
            name: t('common.labels.search'),
            showInLegend: true,
            lineColor: '#8B5CF6',
            plotOptions: {
              series: {
                pointStart: Date.UTC(2022, 6, 30),
                pointInterval: 36e5,
              },
            },
            marker: {
              fillColor: 'white',
              lineWidth: 2,
              lineColor: '#8B5CF6',
            },
            data: Array(
              moment(endDate).diff(moment(startDate), 'days') + 1
            ).fill(0),
          },
        ],
      };
    }
  }, [
    searchSummaryAnalytics.isSuccess,
    searchSummaryAnalytics.data,
    t,
    startDate,
    endDate,
  ]);

  const onStartDateEndDateChange = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dates: any,
    dateStrings: [string, string]
  ) => {
    if (dates) {
      setStartDate(moment(new Date(dateStrings[0])).format('YYYY-MM-DD'));
      setEndDate(
        // @ts-ignore
        moment(new Date(dateStrings[1]).getTime()).format('YYYY-MM-DD')
      );
      setPastStartDate(
        moment(
          new Date(
            new Date(dateStrings[0]).getTime() -
              Math.ceil(
                (new Date(dateStrings[1]).getTime() -
                  new Date(dateStrings[0]).getTime()) /
                  (1000 * 3600 * 24)
              ) *
                24 *
                60 *
                60 *
                1000
          )
        )
          .utc()
          .format('YYYY-MM-DD')
      );
      setPastEndDate(
        moment(new Date(dateStrings[0])).utc().format('YYYY-MM-DD')
      );
    }
  };

  useEffect(() => {
    if (listEnvironments.isSuccess && listEnvironments.data) {
      const result = listEnvironments.data.find(
        (item) => item.id === environment
      );

      if (result) {
        if (result.customDomain) {
          setDomain(result.customDomain);
        } else if (result.cacheDomain) {
          setDomain(result.cacheDomain);
        } else {
          setDomain(result.workspaceDomain);
        }
      }
    }
  }, [listEnvironments.isSuccess, listEnvironments.data, environment]);

  useEffect(() => {
    setStartDate(
      moment(new Date(new Date(Date.now()).getTime() - 7 * 24 * 60 * 60 * 1000))
        .utc()
        .format('YYYY-MM-DD')
    );
    setEndDate(
      moment(new Date(new Date(Date.now()).getTime()))
        .utc()
        .format('YYYY-MM-DD')
    );
    setPastStartDate(
      moment(
        new Date(new Date(Date.now()).getTime() - 15 * 24 * 60 * 60 * 1000)
      )
        .utc()
        .format('YYYY-MM-DD')
    );
    setPastEndDate(
      moment(new Date(new Date(Date.now()).getTime() - 8 * 24 * 60 * 60 * 1000))
        .utc()
        .format('YYYY-MM-DD')
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    totalSearch,
    totalPreviousSearch,
    totalZeroResultSearches,
    totalZeroResultPreviousSearches,
    searchSummaryAnalytics,
    searchSummary,
    topSearchesClicksCartsOrdersAnalytics,
    searchConversionFunnelData,
    topZeroSearchRecordsAnalytics,
    topTenZeroResultSearch,
    topSearchedRecordsAnalytics,
    topTenSearchResultSearch,
    topDevicesAnalytics,
    topDevices,
    t,
    onStartDateEndDateChange,
    startDate,
    endDate,
    daysDifference: Math.ceil(
      // @ts-ignore
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 3600 * 24)
    ),
  };
};

export default useAnalyticsDashboardController;
