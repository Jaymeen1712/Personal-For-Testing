import { useQuery } from 'react-query';
import moment from 'moment/moment';

import {
  API_QUERY_KEY,
  APIS_ROUTES,
  convertUtcToCurrentTimeZone,
} from '../../../utills';
import { RootObject } from '../../../types';
import apiClient from '../../api-client';

const visitorsDashboard = async (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  isDuration?: boolean
) => {
  let totalUsers = 0;
  let newUsers = 0;
  const totalUsersOfSelectedDuration: number[] = [];
  const totalNewUsersOfSelectedDuration: number[] = [];
  const datesOfSelectedDuration: string[] = [];

  if (!workspaceId || !environmentId || !startDate || !endDate) return;

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
      response.response.totalUsers.categories.map((user) => {
        totalUsers += user.total;
        totalUsersOfSelectedDuration.push(user.total);
        datesOfSelectedDuration.push(
          moment(convertUtcToCurrentTimeZone(user.category)).format('DD MMM')
        );
        return true;
      });
    } else {
      totalUsers = 0;
    }

    if (
      response.response.newUsers &&
      response.response.newUsers.categories &&
      response.response.newUsers.categories.length > 0
    ) {
      response.response.newUsers.categories.map((newUser) => {
        newUsers += newUser.total;
        totalNewUsersOfSelectedDuration.push(newUser.total);
        return true;
      });
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
