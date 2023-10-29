import { useQuery } from 'react-query';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  countryListWithCountryCode,
} from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface ICustomerByRegion {
  country: string;
  eventSum: number;
  newUserEventsum: number;
  newUsers: number;
  totalUsers: number;
}

const customerByRegion = async (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
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
    const customByRegionData: ICustomerByRegion[] = [];

    const response = await apiClient.get<
      string,
      { response: ICustomerByRegion[] }
    >(`${APIS_ROUTES.EVENT_SUMMARY_WITH_USER_STATE}`, {
      params: {
        date_range: 'CUSTOM',
        metrics: metrics,
        start_date: startDate,
        end_date: endDate,
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
      for (let i = 0; i <= response.response.length - 1; i++) {
        if (
          response.response[i].country !== '' &&
          response.response[i].eventSum > 0
        ) {
          customByRegionData.push(response.response[i]);
        }
      }
    }

    if (
      customByRegionData &&
      customByRegionData &&
      customByRegionData.length > 0
    ) {
      if (customByRegionData.length > 5) {
        let othersDataTotalModuleCount = 0;

        customByRegionData.splice(0, 4).map((data) => {
          if (data.country !== '' || data.eventSum > 0) {
            totalModuleCount += data.eventSum;

            selectedModuleData.push([
              data.country && data.country !== ''
                ? // @ts-ignore
                  countryListWithCountryCode[data.country]
                : 'N/A',
              data.eventSum,
            ]);
          }
          return true;
        });

        customByRegionData.map((data) => {
          othersDataTotalModuleCount += data.eventSum;
          totalModuleCount += data.eventSum;
          return true;
        });

        selectedModuleData.push(['others', othersDataTotalModuleCount]);
      } else {
        customByRegionData.map((data) => {
          if (data.country !== '' || data.eventSum > 0) {
            totalModuleCount += data.eventSum;
            selectedModuleData.push([
              data.country && data.country !== ''
                ? // @ts-ignore
                  countryListWithCountryCode[data.country]
                : 'N/A',
              data.eventSum,
            ]);
          }
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
    }

    return {
      moduleWiseData: selectedModuleData,
      colorData: ['#6366F1', '#F59E0B', '#00B679', '#EF4444', '#EB4898'],
    };
  }
};

const useCustomerByRegion = (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  aggregateFunction: string,
  segment: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.CUSTOMER_BY_REGION,
      workspaceId,
      environmentId,
      metrics,
      aggregateFunction,
      segment,
      startDate,
      endDate,
    ],
    () =>
      customerByRegion(
        workspaceId,
        environmentId,
        metrics,
        aggregateFunction,
        segment,
        startDate,
        endDate
      )
  );

export default useCustomerByRegion;
