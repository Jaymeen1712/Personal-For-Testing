import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAxiosResponse, InsightType } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import moment from 'moment-timezone';

const listTimeZones = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: InsightType[] }>
  >(`${APIS_ROUTES.TIME_ZONE}`);

  if (
    response &&
    response.response.Data &&
    response.response.Data.items &&
    response.response.Data.items.length > 0
  ) {
    for (let i = 0; i <= response.response.Data.items.length - 1; i++) {
      response.response.Data.items[i].label = `(UTC ${moment()
        .tz(response.response.Data.items[i].value)
        .format('Z')} ) ${response.response.Data.items[i].label} `;
    }
  }

  return response.response.Data.items;
};

const useListTimeZones = () =>
  useQuery([API_QUERY_KEY.TIME_ZONES], () => listTimeZones());

export default useListTimeZones;
