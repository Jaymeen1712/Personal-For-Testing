import { useQuery } from 'react-query';
import axios from 'axios';
import moment from 'moment/moment';
import Cookies from 'js-cookie';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  convertUtcToCurrentTimeZone,
  USER_ACCESS_KEY,
} from '../../../../../../utills';

interface ITotalUserResponse {
  category: string;
  total: number;
  reverseColor: boolean;
  index: number;
}

const searchSummaryAnalytics = async (
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
    const datesOfSelectedDuration: string[] = [];
    const totalSearchesOfSelectedDuration: number[] = [];

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
          (search: ITotalUserResponse) => {
            totalSearchesOfSelectedDuration.push(search.total);
            datesOfSelectedDuration.push(
              moment(convertUtcToCurrentTimeZone(search.category)).format(
                'DD MMM'
              )
            );
            return true;
          }
        );
      }
    }

    return {
      totalSearchesOfSelectedDuration: totalSearchesOfSelectedDuration,
      datesOfSelectedDuration: datesOfSelectedDuration,
    };
  }
};

const useSearchSummaryAnalytics = (
  workspaceId: string,
  event: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  breakBy?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.SEARCH_SUMMARY,
      workspaceId,
      event,
      environmentId,
      startDate,
      endDate,
      breakBy,
    ],
    () =>
      searchSummaryAnalytics(
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

export default useSearchSummaryAnalytics;
