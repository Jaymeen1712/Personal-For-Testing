import { useQuery } from 'react-query';

import apiClient from '../../../api-client';
import { IAxiosResponse, IListWidgetRules } from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';

const listWidgetRule = async (
  widgetId?: string,
  workspaceId?: string,
  environment?: string | null,
  userId?: string,
  sortBy?: string,
  orderBy?: string,
  applicable?: string,
  status?: string,
  searchData?: string
) => {
  if (!widgetId || !workspaceId || !environment) return;

  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListWidgetRules[] | undefined }>
  >(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/contents/content-model-data/widget-rules`,
    {
      params: {
        fieldsToQuery:
          'id,title,description,language,created_by,created_at,modified_at,modified_by',
        metaDataFieldsToQuery: `rule_title_eti,widget_title_eti,environment_id,widget_id_esi,start_date_edti,end_date_edti,content_model_id,content_model_data_id,widget_rule_applicable_on_esi,status_esi,keyword_esai,page_url_esi`,
        search: searchData,
        environments_id: environment,
        widget_id: widgetId,
        sort_by: sortBy,
        applicable_on: applicable,
        status: status,
        users_id: userId,
        order_by: orderBy,
        // skip: 0,
        // limit: 2,
      },
    }
  );
  return response.response.Data.items;
};

const useListWidgetRule = (
  widgetId?: string,
  workspaceId?: string,
  environment?: string | null,
  userId?: string,
  sortBy?: string,
  orderBy?: string,
  applicable?: string,
  status?: string,
  searchData?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.WIDGET_RULE_LIST,
      workspaceId,
      widgetId,
      userId,
      sortBy,
      orderBy,
      applicable,
      status,
      searchData,
      environment,
    ],
    () =>
      listWidgetRule(
        widgetId,
        workspaceId,
        environment,
        userId,
        sortBy,
        orderBy,
        applicable,
        status,
        searchData
      ),
    {
      cacheTime: 0,
    }
  );

export default useListWidgetRule;
