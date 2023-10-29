import { useQuery } from 'react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
  API_QUERY_KEY,
  APIS_ROUTES,
  USER_ACCESS_KEY,
} from '../../../../../../utills';

interface ISearchClickedCartOrdersResponse {
  segment_value: string;
  total_count: number;
}

const topSearchesClicksCartsOrdersAnalytics = async (
  workspaceId: string,
  event: string[],
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  segmentName?: string,
  segmentValueToFilter?: string
) => {
  if (!workspaceId || !environmentId || !event || !startDate || !endDate) {
    return;
  } else {
    const tempSelectedModuleData: [string, number][] = [];
    // let allRecordCount = 0;
    const selectedModuleData: [string, number][] = [];

    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    const totalSearch = await apiClient.get(`${APIS_ROUTES.TOTAL_SEARCHES}`, {
      params: {
        event: 'product_searched',
        date_range: 'CUSTOM',
        start_date: startDate,
        end_date: endDate,
        metrics: 'total_count',
      },
      headers: {
        // @ts-ignore
        'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
        'x-workspace-id': workspaceId,
        'x-env-id': environmentId,
      },
    });

    if (totalSearch.data) {
      if (totalSearch.data.length > 0) {
        tempSelectedModuleData.push([
          'product_searched',
          totalSearch.data[0].sum,
        ]);
      } else {
        tempSelectedModuleData.push(['product_searched', 0]);
      }
    }

    await Promise.all(
      event.map(async (event) => {
        const response = await apiClient.get(
          `${APIS_ROUTES.TOP_ZERO_SEARCH_AND_SEARCH_RECORDS}`,
          {
            params: {
              event: event,
              date_range: 'CUSTOM',
              start_date: startDate,
              end_date: endDate,
              row: 100,
              start: 0,
              segment_name: segmentName,
              metrics: 'total_count',
              segment_values_to_filter: segmentValueToFilter,
            },
            headers: {
              // @ts-ignore
              'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
              'x-workspace-id': workspaceId,
              'x-env-id': environmentId,
            },
          }
        );

        if (response) {
          if (response.data && response.data.length > 0) {
            let totalEventData = 0;
            response.data.map((totalData: ISearchClickedCartOrdersResponse) => {
              totalEventData += totalData.total_count;
              // allRecordCount += totalData.total_count;
              return true;
            });
            tempSelectedModuleData.push([event, totalEventData]);
          } else {
            tempSelectedModuleData.push([event, 0]);
          }
        }
      })
    );

    if (tempSelectedModuleData && tempSelectedModuleData.length > 0) {
      tempSelectedModuleData.map((moduleData) => {
        if (moduleData[1] === 0) {
          if (moduleData[0] === 'product_searched') {
            selectedModuleData.push(['searchs', 0]);
          }
          if (moduleData[0] === 'product_viewed') {
            selectedModuleData.push(['clicks', 0]);
          }
          if (moduleData[0] === 'product_added_to_cart') {
            selectedModuleData.push(['carts', 0]);
          }
          if (moduleData[0] === 'product_purchased') {
            selectedModuleData.push(['orders', 0]);
          }
        } else {
          if (moduleData[0] === 'product_searched') {
            selectedModuleData.push([
              'searches',
              moduleData[1],
              // parseFloat(((moduleData[1] / allRecordCount) * 100).toFixed(2)),
            ]);
          }
          if (moduleData[0] === 'product_viewed') {
            selectedModuleData.push([
              'clicks',
              moduleData[1],
              // parseFloat(((moduleData[1] / allRecordCount) * 100).toFixed(2)),
            ]);
          }
          if (moduleData[0] === 'product_added_to_cart') {
            selectedModuleData.push([
              'carts',
              moduleData[1],
              // parseFloat(((moduleData[1] / allRecordCount) * 100).toFixed(2)),
            ]);
          }
          if (moduleData[0] === 'product_purchased') {
            selectedModuleData.push([
              'orders',
              moduleData[1],
              // parseFloat(((moduleData[1] / allRecordCount) * 100).toFixed(2)),
            ]);
          }
        }
        return true;
      });
    }

    return {
      selectedModuleData: selectedModuleData.sort(function (a, b) {
        return b[1] - a[1];
      }),
      colors: ['#6366F1', '#FBBF24', '#F87171', '#00B679'],
    };
  }
};

const useTopSearchesClicksCartsOrdersAnalytics = (
  workspaceId: string,
  event: string[],
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  segmentName?: string,
  segmentValueToFilter?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.TOP_SEARCHES_CLICKS_CARTS_ORDERS_ANALYTICS,
      workspaceId,
      environmentId,
      startDate,
      endDate,
      event,
      segmentName,
      segmentValueToFilter,
    ],
    () =>
      topSearchesClicksCartsOrdersAnalytics(
        workspaceId,
        event,
        environmentId,
        startDate,
        endDate,
        segmentName,
        segmentValueToFilter
      ),
    {
      cacheTime: 0,
    }
  );

export default useTopSearchesClicksCartsOrdersAnalytics;
