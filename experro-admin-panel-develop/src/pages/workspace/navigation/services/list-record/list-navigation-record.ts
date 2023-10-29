import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IContentFilterParams,
  IContentModelRecordsResponse,
} from '../../../../../types';
import apiClient from '../../../../../apis/api-client';

const listNavigationRecord = async (
  workspaceId: string,
  contentModelId?: string,
  contentRecordFilters?: IContentFilterParams[]
) => {
  if (!contentModelId) return;

  const id = contentModelId.split('/', 4);

  const recordParams = contentRecordFilters?.filter(
    (record) => record.contentModelId === id[0]
  );

  const response = await apiClient.get<
    null,
    IAxiosResponse<IContentModelRecordsResponse>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}/${id[0]}/public-content-model-data`,
    {
      params: {
        fieldsToQuery:
          'id,title,status,content_model_id,menu_description_et,menu_title_es,page_slug,internal_name',
        fieldsDataToQuery: 'name_esi,link_es',
        skip: recordParams?.[0].params.search
          ? 0
          : recordParams?.[0].params.skip,
        limit: recordParams?.[0].params.search
          ? 1000
          : recordParams?.[0].params.limit
          ? recordParams?.[0].params.limit
          : 5,
        isCallFromMenu: true,
        search: recordParams?.[0].params.search,
      },
    }
  );

  if (id[1] === 'link') {
    response.response.Data.items.forEach((record) => {
      record.type = 'link';
    });
  }

  return response.response.Data;
};

const useListNavigationRecord = (
  workspaceId: string,
  contentModelId?: string,
  contentRecordFilters?: IContentFilterParams[]
) =>
  useQuery<IContentModelRecordsResponse | undefined, IAPIError>(
    [
      API_QUERY_KEY.NAVIGATION_RECORDS,
      workspaceId,
      contentModelId,
      contentRecordFilters,
    ],
    () =>
      listNavigationRecord(workspaceId, contentModelId, contentRecordFilters),
    { cacheTime: 0 }
  );

export default useListNavigationRecord;
