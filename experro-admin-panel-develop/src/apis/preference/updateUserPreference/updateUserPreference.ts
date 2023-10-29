import { useMutation } from 'react-query';
import { IAPIError, IAxiosResponse } from '../../../types';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import shapeCollection from '../../../utills/convert-request-response';

const updateUserPreference = async (
  workspaceId: string,
  values: {
    preferenceName: string;
    preferenceValue: CheckboxValueType[];
    preferenceId?: string;
  }
) => {
  if (!workspaceId) return;

  const result = await apiClient.post<string, IAxiosResponse<{ id: string }>>(
    `${APIS_ROUTES.USER_PREFERENCE}/${workspaceId}/preferences`,
    shapeCollection(values, false, 'camelToSnackCase'),
    {
      params: {
        preference_name: values.preferenceName,
      },
    }
  );

  return result.response.Data.id;
};

const useUpdateUserPreference = (workspaceId: string) =>
  useMutation<
    string | undefined,
    IAPIError,
    {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    }
  >([API_MUTATION_KEY.UPDATE_USER_PREFERENCE, workspaceId], (values) =>
    updateUserPreference(workspaceId, values)
  );

export default useUpdateUserPreference;
