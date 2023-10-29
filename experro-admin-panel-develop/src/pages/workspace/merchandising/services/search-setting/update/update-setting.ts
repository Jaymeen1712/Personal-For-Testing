import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IRule,
  IUpdateSetting,
} from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

const updateSetting = async (
  updatedSetting: IUpdateSetting,
  workspaceId: string,
  searchId: string
) => {
  const response = await apiClient.patch<
    IRule,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/search-setting/${searchId}`,
    shapeCollection(updatedSetting, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const useUpdateSetting = (workspaceId: string, searchId: string) =>
  useMutation<string, IAPIError, IUpdateSetting>(
    [API_MUTATION_KEY.UPDATE_SETTING, searchId],
    (updatedSetting) => updateSetting(updatedSetting, workspaceId, searchId)
  );

export default useUpdateSetting;
