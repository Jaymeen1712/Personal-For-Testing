import { useQuery } from 'react-query';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  countryListWithCountryCode,
} from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface IOrderByLocationResponse {
  country: string;
  eventCount: number;
  newUserEventcount: number;
  newUsers: number;
  totalUsers: number;
}

const orderByLocation = async (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  event: string,
  aggregateFunction: string,
  segment: string,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const selectedModuleData: [string, number][] = [];
    let totalModuleCount = 0;

    const response = await apiClient.get<
      string,
      { response: IOrderByLocationResponse[] }
    >(`${APIS_ROUTES.EVENT_SUMMARY_WITH_USER_STATE}`, {
      params: {
        date_range: 'CUSTOM',
        metrics: metrics,
        start_date: startDate,
        end_date: endDate,
        event: event,
        frequency: 'days',
        break_by_date: false,
        aggregateFunction: aggregateFunction,
        segment: segment,
      },
      headers: {
        'x-workspace-id': workspaceId,
        // @ts-ignore
        'x-env-id': environmentId,
      },
    });

    if (response && response.response && response.response.length > 0) {
      if (response.response.length > 5) {
        let othersDataTotalModuleCount = 0;

        response.response.splice(0, 4).map((data) => {
          totalModuleCount += data.eventCount;
          selectedModuleData.push([
            data.country && data.country !== '' ? data.country : 'N/A',
            data.eventCount,
          ]);
          return true;
        });

        response.response.map((data) => {
          othersDataTotalModuleCount += data.eventCount;
          totalModuleCount += data.eventCount;
          return true;
        });

        selectedModuleData.push(['others', othersDataTotalModuleCount]);
      } else {
        response.response.map((data) => {
          totalModuleCount += data.eventCount;
          selectedModuleData.push([
            data.country && data.country !== ''
              ? // @ts-ignore
                countryListWithCountryCode[data.country]
              : 'N/A',
            data.eventCount,
          ]);
          return true;
        });
      }

      if (selectedModuleData && selectedModuleData.length > 0) {
        selectedModuleData.map((module) => {
          //This is a logic for creating an array of Percentage of each and every item of array,
          // so with the help of this we are able to show the tooltip on each item inside the pie-chart.
          if (totalModuleCount > 0) {
            module[1] = (module[1] / totalModuleCount) * 100;
          } else {
            module[1] = 0;
          }
          return true;
        });
      }

      return {
        moduleWiseData: selectedModuleData,
        colorData: ['#6366F1', '#F59E0B', '#00B679', '#EF4444', '#EB4898'],
      };
    }
  }
};

const useOrderByLocation = (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  event: string,
  aggregateFunction: string,
  segment: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.ORDER_BY_LOCATION,
      workspaceId,
      environmentId,
      metrics,
      event,
      aggregateFunction,
      segment,
      startDate,
      endDate,
    ],
    () =>
      orderByLocation(
        workspaceId,
        environmentId,
        metrics,
        event,
        aggregateFunction,
        segment,
        startDate,
        endDate
      )
  );

export default useOrderByLocation;
