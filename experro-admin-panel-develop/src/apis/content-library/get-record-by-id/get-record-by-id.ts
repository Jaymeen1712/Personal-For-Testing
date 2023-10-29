import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

interface ListRecordResponse {
  id: string;
  title?: string;
  languages?: string;
  createdBy?: string;
  Status?: string;
  contentModelData: {
    id: string;
    title: string;
    pageSlug: string;
    currentVersionId: string;
  };
  versionData: {
    id: string;
    template: string;
    versionName: string;
    versionNo: string;
    status: string;
    publishAt?: string;
    unpublishAt?: string;
  };
  contentModelFieldData: {
    id: string;
    language: string;
    contentModelId: string;
    isLocalizationEnabled: boolean;
    modifiedAt: string;
    modifiedBy: string;
    createdAt: string;
    createdBy: string;
  };
  nextVersionNo: string;
}

const getRecordById = async (
  workspaceId: string,
  contentModalId: string,
  contentModelDataId?: string,
  versionId?: string,
  languages?: string
) => {
  if (!contentModelDataId || !versionId) return;
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: ListRecordResponse }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}/${contentModalId}/${APIS_ROUTES.CONTENT_MODAL_DATA}/${contentModelDataId}`,
    {
      params: {
        language: `${languages}`,
        version_id: `${versionId}`,
        versionFieldsToQuery:
          'version_no,version_name,template,id,*_status,*_publish_at,*_unpublish_at,modified_by,*_published_by,created_by,created_at',
      },
    }
  );

  return result.response.Data.item;
};

const useGetRecordListById = (
  workspaceId: string,
  contentModalId: string,
  contentModelDataId?: string,
  versionId?: string,
  languages?: string
) =>
  useQuery<ListRecordResponse | undefined, IAPIError>(
    [
      API_QUERY_KEY.GET_RECORD_LIST,
      contentModalId,
      contentModelDataId,
      languages,
      versionId,
    ],
    () =>
      getRecordById(
        workspaceId,
        contentModalId,
        contentModelDataId,
        versionId,
        languages
      ),
    {
      cacheTime: 0,
    }
  );

export default useGetRecordListById;
