import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import { IAPIError, IAxiosResponse } from '../../../types';
import shapeCollection from '../../../utills/convert-request-response';
import apiClient from '../../api-client';

const scheduleVersionUnPublish = async (
  workspaceId: string,
  contentModalId: string,
  contentModalDataId: string,
  versionId: string,
  values: { unpublishAt: string; environmentsId: string }
) => {
  const result = await apiClient.post<string, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/${contentModalDataId}/schedule-version-unpublish/${versionId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useScheduleVersionUnPublish = (
  workspaceId: string,
  contentModalId: string,
  contentModalDataId: string,
  versionId: string
) =>
  useMutation<
    string,
    IAPIError,
    { unpublishAt: string; environmentsId: string }
  >([API_MUTATION_KEY.SCHEDULE_VERSION_UNPUBLISH], (values) =>
    scheduleVersionUnPublish(
      workspaceId,
      contentModalId,
      contentModalDataId,
      versionId,
      values
    )
  );

export default useScheduleVersionUnPublish;
