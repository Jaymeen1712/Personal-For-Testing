import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface IUnitSoldByDevicesResponse {
  deviceCategory: string;
  eventDate: string;
  newUserQuantity: number;
  newUsers: number;
  quantity: number;
  totalUsers: number;
}

const unitSoldByDevices = async (
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
    let tempDatesOfSelectedDuration: string[] = [];
    const deviceWiseData: {
      [k: string]: number[];
    } = {};
    const deviceData: { name: string; data: number[] }[] = [];

    const response = await apiClient.get<
      string,
      { response: IUnitSoldByDevicesResponse[] }
    >(`${APIS_ROUTES.EVENT_SUMMARY_WITH_USER_STATE}`, {
      params: {
        date_range: 'CUSTOM',
        metrics: metrics,
        start_date: startDate,
        end_date: endDate,
        event: event,
        frequency: 'days',
        break_by_date: true,
        aggregateFunction: aggregateFunction,
        segment: segment,
      },
      headers: {
        'x-workspace-id': workspaceId,
        // @ts-ignore
        'x-env-id': environmentId,
      },
    });

    if (response && response.response.length > 0) {
      const dates: string[] = [];
      let categories: string[] = [];

      response.response.forEach((unitByDevice) => {
        dates.push(unitByDevice.eventDate);
      });

      response.response.forEach((unitByDevice) => {
        categories.push(unitByDevice.deviceCategory);
      });

      if (dates.length > 0) {
        const datesSet = new Set(dates);
        const categoriesSet = new Set(categories);

        tempDatesOfSelectedDuration = Array.from(datesSet).sort(
          // @ts-ignore
          (a, b) => new Date(a) - new Date(b)
        );
        categories = Array.from(categoriesSet);

        if (categories.length > 0) {
          for (let i = 0; i <= categories.length - 1; i++) {
            if (deviceWiseData[categories[i]] === undefined) {
              deviceWiseData[categories[i]] = [];
            }
          }
        }

        for (let i = 0; i <= tempDatesOfSelectedDuration.length - 1; i++) {
          const data = response.response.filter(
            (device) => tempDatesOfSelectedDuration[i] === device.eventDate
          );

          if (data.length > 0 && data.length === categories.length) {
            for (let i = 0; i <= data.length - 1; i++) {
              Object.keys(deviceWiseData).map((key) => {
                if (key === data[i].deviceCategory) {
                  deviceWiseData[key].push(data[i].quantity);
                }

                return true;
              });
            }
          } else {
            for (let i = 0; i <= data.length - 1; i++) {
              Object.keys(deviceWiseData).map((key) => {
                if (key === data[i].deviceCategory) {
                  deviceWiseData[key].push(data[i].quantity);
                } else {
                  deviceWiseData[key].push(0);
                }

                return true;
              });
            }
          }
        }
        if (Object.keys(deviceWiseData).length > 0) {
          Object.keys(deviceWiseData).map((device) => {
            const item = {
              name:
                device === 'smartphone' ? 'Mobile' : 'pc' ? 'Desktop' : device,
              data: deviceWiseData[device],
            };

            deviceData.push(item);
            return true;
          });
        }
      }
    }

    return {
      dateDurations: tempDatesOfSelectedDuration,
      deviceData: deviceData,
    };
  }
};

const useUnitSoldByDevices = (
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
      API_QUERY_KEY.UNIT_SOLD_BY_DEVICES,
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
      unitSoldByDevices(
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

export default useUnitSoldByDevices;
