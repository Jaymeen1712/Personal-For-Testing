import { useQuery } from 'react-query';
import apiClient from '../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  MasterFacetList,
} from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const getMasterFacetsList = async (
  workspaceId: string,
  environmentId: string
) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: MasterFacetList[] }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/content-fields/facet-fields`,
    {
      params: {
        environments_id: environmentId,
        getCount: true,
      },
    }
  );
  return result.response.Data.items;
};

const useMasterFacetsRecordList = (
  workspaceId: string,
  environmentId: string
) =>
  useQuery<MasterFacetList[], IAPIError>(
    [API_QUERY_KEY.MASTER_FACET_LIST],
    () => getMasterFacetsList(workspaceId, environmentId),
    {
      cacheTime: 0,
    }
  );

export default useMasterFacetsRecordList;
