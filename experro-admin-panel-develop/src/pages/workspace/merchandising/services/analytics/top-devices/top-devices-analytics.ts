import axios from 'axios';
import moment from 'moment/moment';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

import {
  API_QUERY_KEY,
  APIS_ROUTES,
  convertUtcToCurrentTimeZone,
  divideTheArrayIntoChunks,
  USER_ACCESS_KEY,
} from '../../../../../../utills';

interface ITotalCountResponse {
  category: string;
  total: number;
  reverseColor: boolean;
  index: number;
}

interface ITotalCountDataResponse {
  name: string;
  data: number[];
}

const topDevicesAnalytics = async (
  workspaceId: string,
  event: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  breakBy?: string
) => {
  if (
    !workspaceId ||
    !environmentId ||
    !event ||
    !startDate ||
    !endDate ||
    !breakBy
  ) {
    return;
  } else {
    const tempDatesOfSelectedDuration: string[] = [];
    const deviceData: { name: string; data: number[] }[] = [];
    const dateDurations: string[] = [];

    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    const response = await apiClient.get(`${APIS_ROUTES.SEARCH_SUMMARY}`, {
      params: {
        event: event,
        date_range: 'CUSTOM',
        start_date: startDate,
        end_date: endDate,
        break_by: breakBy,
      },
      headers: {
        // @ts-ignore
        'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
        'x-workspace-id': workspaceId,
        'x-env-id': environmentId,
      },
    });

    if (response) {
      if (
        response.data.total_count &&
        response.data.total_count.categories &&
        response.data.total_count.categories.length > 0
      ) {
        response.data.total_count.categories.map(
          (search: ITotalCountResponse) => {
            tempDatesOfSelectedDuration.push(
              moment(convertUtcToCurrentTimeZone(search.category)).format(
                'DD MMM'
              )
            );
            return true;
          }
        );

        if (tempDatesOfSelectedDuration.length > 0) {
          const tempSelectedDuration = divideTheArrayIntoChunks(
            tempDatesOfSelectedDuration,
            7
          );
          tempSelectedDuration.map((selectedDuration: string[]) => {
            if (selectedDuration.length > 0) {
              dateDurations.push(
                `${selectedDuration[0]}-${
                  selectedDuration[selectedDuration.length - 1]
                }`
              );
            } else {
              dateDurations.push(selectedDuration[0]);
            }
            return true;
          });
        }
      }
      if (
        response.data.total_count &&
        response.data.total_count.data &&
        response.data.total_count.data.length > 0
      ) {
        response.data.total_count.data.map((data: ITotalCountDataResponse) => {
          const tempFinalDeviceData: number[] = [];
          const tempTotalDeviceData = divideTheArrayIntoChunks(data.data, 7);
          tempTotalDeviceData.map((tempTotalDeviceData: number[]) => {
            tempFinalDeviceData.push(
              tempTotalDeviceData.reduce((partialSum, a) => partialSum + a, 0)
            );
            return true;
          });
          deviceData.push({
            name:
              data.name && data.name !== ''
                ? data.name === 'pc'
                  ? 'Desktop'
                  : data.name.charAt(0).toUpperCase() + data.name.slice(1)
                : 'N/A',
            data: tempFinalDeviceData,
          });
          return true;
        });
      }

      return {
        dateDurations: dateDurations,
        deviceData: deviceData,
      };
    }
  }
};

const useTopDevicesAnalytics = (
  workspaceId: string,
  event: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  breakBy?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.ANALYTICS_TOP_DEVICES,
      workspaceId,
      event,
      environmentId,
      startDate,
      endDate,
      breakBy,
    ],
    () =>
      topDevicesAnalytics(
        workspaceId,
        event,
        environmentId,
        startDate,
        endDate,
        breakBy
      ),
    {
      cacheTime: 0,
    }
  );

export default useTopDevicesAnalytics;
