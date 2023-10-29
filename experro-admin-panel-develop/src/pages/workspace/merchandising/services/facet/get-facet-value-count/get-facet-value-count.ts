import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const getFacetValueCount = async (
  workspaceId: string,
  environmentId: string,
  fields: string
) => {
  if (!workspaceId || !fields)
    return {} as {
      [k: string]: number;
    };
  const result = await apiClient.get<
    null,
    IAxiosResponse<{
      item: {
        [k: string]: number;
      };
    }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/content-fields/facet-fields/count`,
    {
      params: {
        fieldsToQuery: 'id',
        environments_id: environmentId,
        fields: fields,
      },
    }
  );
  return result.response.Data.item;
};

const useGetFacetValueCount = (
  workspaceId: string,
  environmentId: string,
  fields: string
) =>
  useQuery<
    {
      [k: string]: number;
    },
    IAPIError
  >(
    [API_QUERY_KEY.FACET_VALUE_COUNT],
    () => getFacetValueCount(workspaceId, environmentId, fields),
    {
      cacheTime: 0,
    }
  );

export default useGetFacetValueCount;
