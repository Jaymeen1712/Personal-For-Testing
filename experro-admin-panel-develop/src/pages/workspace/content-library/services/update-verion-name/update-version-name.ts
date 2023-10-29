import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const updateVersionName = async (
  workspaceId: string,
  contentModelId: string,
  contentModelDataId: string,
  versionId: string,
  values: { versionName: string }
) => {
  const result = await apiClient.put<
    { versionName: string },
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentModelId}/content-model-data/${contentModelDataId}/version-name/${versionId}`,
    shapeCollection(values, false, 'camelToSnackCase'),
    {
      params: {
        version_id: versionId,
      },
    }
  );

  return result.response.Data.message;
};
const useUpdateVersionName = (
  workspaceId: string,
  contentModelId: string,
  contentModelDataId: string,
  versionId: string
) =>
  useMutation<string, IAPIError, { versionName: string }>(
    [API_MUTATION_KEY.UPDATE_VERSION_NAME],
    (values) =>
      updateVersionName(
        workspaceId,
        contentModelId,
        contentModelDataId,
        versionId,
        values
      )
  );

export default useUpdateVersionName;
