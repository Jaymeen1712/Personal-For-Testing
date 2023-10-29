import { useQuery } from 'react-query';
import apiClient from '../../../../../../apis/api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import { IAxiosResponse } from '../../../../../../types';

interface IListPageTemplateResponse {
  template: string;
  id: string;
}

const listThemeTemplate = async (workspaceId: string, type: string) => {
  if (type !== 'collection') return [];
  const response = await apiClient.get<
    string,
    IAxiosResponse<IListPageTemplateResponse[]>
  >(`${APIS_ROUTES.THEME_SERVICE}/${workspaceId}${APIS_ROUTES.PAGE_TEMPLATE}`);
  return response.response.Data;
};

const useListThemeTemplate = (workspaceId: string, type: string) =>
  useQuery([API_QUERY_KEY.PAGE_TEMPLATE], () =>
    listThemeTemplate(workspaceId, type)
  );

export default useListThemeTemplate;
