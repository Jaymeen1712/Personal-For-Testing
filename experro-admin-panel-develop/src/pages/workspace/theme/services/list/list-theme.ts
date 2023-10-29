import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse, IListThemeResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const listTheme = async (
  workspaceId: string,
  skip?: number,
  skipLimit?: number,
  orderBy?: string,
  columnField?: string
) => {
  if (skip && skipLimit) {
    const response = await apiClient.get<
      string,
      IAxiosResponse<{ totalCount: string; items: IListThemeResponse[] }>
    >(`${APIS_ROUTES.THEME_SERVICE}/${workspaceId}/theme-versions`, {
      params: {
        // @ts-ignore
        skip: `${skip * skipLimit - skipLimit}`,
        rows: skipLimit,
        order_by: orderBy,
        sort_by: columnField,
      },
    });

    return response.response.Data;
  } else {
    const response = await apiClient.get<
      string,
      IAxiosResponse<{ totalCount: string; items: IListThemeResponse[] }>
    >(`${APIS_ROUTES.THEME_SERVICE}/${workspaceId}/theme-versions`);

    return response.response.Data;
  }
};

const useListTheme = (
  workspaceId: string,
  skip?: number,
  skipLimit?: number,
  orderBy?: string,
  columnField?: string
) =>
  useQuery([API_QUERY_KEY.THEME_LIST, workspaceId, skip, skipLimit], () =>
    listTheme(workspaceId, skip, skipLimit, orderBy, columnField)
  );

export default useListTheme;
