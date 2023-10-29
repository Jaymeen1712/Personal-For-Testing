import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';
import { ListRecordResponse } from '../../../../../../types';

const getRecordListPublicApi = async (
  workspaceId: string,
  contentModalId: string,
  skip: number,
  skipLimit: number,
  searchData?: string
) => {
  if (!contentModalId) return [];

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ListRecordResponse[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentModalId}/public-content-model-data`,
    {
      params: {
        fieldsToQuery:
          'id,title,language,created_by,status,current_version_id,modified_by,modified_at,environment,created_at,page_slug,published_version_id,content_model_id',
        search: `${searchData}`,
        skip: `${searchData ? 0 : `${skip * skipLimit - skipLimit}`}`,
        limit: `${searchData ? 1000 : skipLimit}`,
      },
    }
  );

  return result.response.Data.items;
};

const useGetRecordListPublicApi = (
  workspaceId: string,
  contentModalId: string,
  skip: number,
  skipLimit: number,
  searchData: string
) =>
  useQuery<ListRecordResponse[], IAPIError>(
    [API_QUERY_KEY.CONTENT_LIBRARY_RECORD_LIST_PUBLIC_API],
    () =>
      getRecordListPublicApi(
        workspaceId,
        contentModalId,
        skip,
        skipLimit,
        searchData
      ),
    {
      cacheTime: 0,
    }
  );

export default useGetRecordListPublicApi;
