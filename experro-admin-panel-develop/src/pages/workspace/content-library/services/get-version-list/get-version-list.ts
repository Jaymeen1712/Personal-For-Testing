import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface VersionListData {
  id: string;
  versionName: string;
  versionNo: number;
}

const getVersionList = async (
  workspaceId: string,
  contentId: string,
  contentModelDataId: string
) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: VersionListData[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}/${contentId}/${APIS_ROUTES.CONTENT_MODAL_DATA}/${contentModelDataId}/versions`,
    {
      params: {
        fieldsToQuery: 'version_no,version_name,id,*_status',
      },
    }
  );
  return result.response.Data.items;
};

const useGetVersionList = (
  workspaceId: string,
  contentId: string,
  contentModelDataId: string,
  versionId: string
) =>
  useQuery<VersionListData[], IAPIError>(
    [API_QUERY_KEY.GET_VERSION_LIST, contentModelDataId, 'us-en', versionId],
    () => getVersionList(workspaceId, contentId, contentModelDataId),
    {
      cacheTime: 0,
    }
  );

export default useGetVersionList;
