import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAxiosResponse, IListRules } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const listRule = async (
  subMenuItem?: string,
  workspaceId?: string,
  searchData?: string,
  environment?: string | null,
  sortBy?: string,
  orderBy?: string
) => {
  if (!workspaceId || !environment || !subMenuItem) return;

  let ruleType;
  let queryParams;
  if (subMenuItem === 'global-rules') {
    ruleType = 'global';
  } else if (subMenuItem === 'category-rules') {
    ruleType = 'category';
    queryParams = 'categories_eslai,categories,category_id_esai,category_id';
  } else if (subMenuItem === 'search-rules') {
    ruleType = 'search';
    queryParams = 'search_terms_eslai';
  }

  const response = await apiClient.get<
    string,
    IAxiosResponse<{ totalCount: number; items: IListRules[] | undefined }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/content-model-data/rules`,
    {
      params: {
        rule_type_esi: ruleType,
        fieldsToQuery:
          'id,title,language,created_by,description,created_at,modified_by',
        metaDataFieldsToQuery: `start_date_edti,end_date_edti,rule_title_eti,rule_type_esi,status_esi,version_id,content_model_id,environment_id,modified_at,rules_ej,sort_ej,slot_ej,pin_ej,${
          queryParams !== undefined && queryParams
        }`,
        search: `${searchData?.trim()}`,
        environments_id: environment,
        sort_by: sortBy,
        order_by: orderBy,
      },
    }
  );

  return response.response.Data;
};

const useListRule = (
  subMenuItem?: string,
  workspaceId?: string,
  searchData?: string,
  environment?: string | null,
  sortBy?: string,
  orderBy?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.RULE_LIST,
      subMenuItem,
      workspaceId,
      searchData,
      environment,
      sortBy,
      orderBy,
    ],
    () =>
      listRule(
        subMenuItem,
        workspaceId,
        searchData,
        environment,
        sortBy,
        orderBy
      ),
    {
      cacheTime: 0,
    }
  );

export default useListRule;
