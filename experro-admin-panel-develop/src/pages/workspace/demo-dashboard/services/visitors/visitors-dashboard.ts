import { useQuery } from 'react-query';
import moment from 'moment/moment';

import apiClient from '../../../../../apis/api-client';
import { RootObject } from '../../../../../types';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  convertUtcToCurrentTimeZone,
} from '../../../../../utills';

const visitorsDashboard = async (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  isDuration?: boolean
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    let totalUsers = 0;
    let newUsers = 0;
    const totalUsersOfSelectedDuration: number[] = [];
    const totalNewUsersOfSelectedDuration: number[] = [];
    const datesOfSelectedDuration: string[] = [];

    const response = await apiClient.get<string, RootObject>(
      `${APIS_ROUTES.DASHBOARD_COUNT}`,
      {
        params: {
          date_range: 'CUSTOM',
          start_date: startDate,
          end_date: endDate,
        },
        headers: {
          'x-workspace-id': workspaceId,
          'x-env-id': environmentId,
        },
      }
    );

    if (response) {
      if (
        response.response.totalUsers &&
        response.response.totalUsers.categories &&
        response.response.totalUsers.categories.length > 0
      ) {
        //here it's a logic for the counting of total users and new users, and
        //also we pass the all the dates of selected duration in the format of DD MMM.
        for (
          let i = 0;
          i <= response.response.totalUsers.categories.length - 1;
          i++
        ) {
          totalUsers += response.response.totalUsers.categories[i].total;
          totalUsersOfSelectedDuration.push(
            response.response.totalUsers.categories[i].total
          );
          datesOfSelectedDuration.push(
            moment(
              convertUtcToCurrentTimeZone(
                response.response.totalUsers.categories[i].category
              )
            ).format('DD MMM')
          );
        }
      } else {
        totalUsers = 0;
      }

      if (
        response.response.newUsers &&
        response.response.newUsers.categories &&
        response.response.newUsers.categories.length > 0
      ) {
        for (
          let i = 0;
          i <= response.response.newUsers.categories.length - 1;
          i++
        ) {
          newUsers += response.response.newUsers.categories[i].total;
          totalNewUsersOfSelectedDuration.push(
            response.response.newUsers.categories[i].total
          );
        }
      } else {
        newUsers = 0;
      }
    }

    return {
      totalUsers: totalUsers,
      newUsers: newUsers,
      returnVisitors: totalUsers - newUsers,
      ...(!isDuration && {
        //if Duration is provided as a true, so we will pass the other 3 parameters.
        totalUsersOfSelectedDuration: totalUsersOfSelectedDuration,
        totalNewUsersOfSelectedDuration: totalNewUsersOfSelectedDuration,
        datesOfSelectedDuration: datesOfSelectedDuration,
      }),
    };
  }
};

const useVisitorsDashboard = (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  isDuration?: boolean
) =>
  useQuery(
    [
      API_QUERY_KEY.DASHBOARD_VISITORS_COUNT,
      workspaceId,
      environmentId,
      startDate,
      endDate,
      isDuration,
    ],
    () =>
      visitorsDashboard(
        workspaceId,
        environmentId,
        startDate,
        endDate,
        isDuration
      ),
    { cacheTime: 0 }
  );

export default useVisitorsDashboard;
