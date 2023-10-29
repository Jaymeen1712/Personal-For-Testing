import { useQuery } from 'react-query';
import moment from 'moment/moment';

import apiClient from '../../../../../apis/api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

interface IWebSiteTrafficDashboardResponse {
  eventCount: number;
  eventDate: string;
  newUserEventcount: number;
  newUsers: number;
  totalUsers: number;
}

const webSiteTrafficDashboard = async (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const tempStartDate = new Date(startDate);
    const tempEndDate = new Date(endDate);
    const totalUsersOfSelectedDuration: number[] = [];
    const totalNewUsersOfSelectedDuration: number[] = [];
    const datesOfSelectedDuration: string[] = [];

    const response = await apiClient.get<
      string,
      { response: IWebSiteTrafficDashboardResponse[] }
    >(`${APIS_ROUTES.EVENT_SUMMARY_WITH_USER_STATE}`, {
      params: {
        date_range: 'CUSTOM',
        start_date: startDate,
        end_date: endDate,
        metrics: 'eventCount',
        break_by_date: true,
      },
      headers: {
        'x-workspace-id': workspaceId,
        'x-env-id': environmentId,
      },
    });

    if (response && tempStartDate && tempEndDate) {
      while (tempStartDate <= tempEndDate) {
        const dateWiseData = response.response.find(
          (data) =>
            data.eventDate === moment(tempStartDate).format('YYYY-MM-DD')
        );

        if (dateWiseData) {
          datesOfSelectedDuration.push(moment(tempStartDate).format('DD MMM'));
          totalUsersOfSelectedDuration.push(dateWiseData.totalUsers);
          totalNewUsersOfSelectedDuration.push(dateWiseData.newUsers);
        } else {
          datesOfSelectedDuration.push(moment(tempStartDate).format('DD MMM'));
          totalUsersOfSelectedDuration.push(0);
          totalNewUsersOfSelectedDuration.push(0);
        }
        tempStartDate.setDate(tempStartDate.getDate() + 1);
      }
    }

    return {
      //if Duration is provided as a true, so we will pass the other 3 parameters.
      totalUsersOfSelectedDuration: totalUsersOfSelectedDuration,
      totalNewUsersOfSelectedDuration: totalNewUsersOfSelectedDuration,
      datesOfSelectedDuration: datesOfSelectedDuration,
    };
  }
};

const useWebSiteTrafficDashboard = (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.DASHBOARD_WEBSITE_TRAFFIC,
      workspaceId,
      environmentId,
      startDate,
      endDate,
    ],
    () =>
      webSiteTrafficDashboard(workspaceId, environmentId, startDate, endDate),
    { cacheTime: 0 }
  );

export default useWebSiteTrafficDashboard;
