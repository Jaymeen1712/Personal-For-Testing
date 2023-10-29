import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  ICreateTitle,
  ListRecordResponse,
} from '../../../../../../types';
import shapeCollection from '../../../../../../utills/convert-request-response';
import apiClient from '../../../../../../apis/api-client';

const getContentModelData = async (
  workspaceId: string,
  values: {
    contentModelData: {
      contentModalId: string;
      contentModelDataId: string[];
    }[];
  }
) => {
  if (values.contentModelData.length === 0)
    return {} as { items: ListRecordResponse[]; totalCount: number };
  const result = await apiClient.post<
    ICreateTitle,
    IAxiosResponse<{ items: ListRecordResponse[]; totalCount: number }>
  >(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/content-model-data`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data;
};

const useGetContentModelData = (workspaceId: string) =>
  useMutation<
    { items: ListRecordResponse[]; totalCount: number },
    IAPIError,
    {
      contentModelData: {
        contentModalId: string;
        contentModelDataId: string[];
      }[];
    }
  >([API_MUTATION_KEY.CREATE_TITLE], (values) =>
    getContentModelData(workspaceId, values)
  );

export default useGetContentModelData;
