import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import { IAPIError, IAxiosResponse } from '../../../types';
import shapeCollection from '../../../utills/convert-request-response';
import apiClient from '../../api-client';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

const updateUserPreference = async (
  workspaceId: string,
  values: {
    preferenceName: string;
    preferenceValue: CheckboxValueType[];
    preferenceId?: string;
  }
) => {
  const result = await apiClient.post<string, IAxiosResponse<{ id: string }>>(
    `${APIS_ROUTES.USER_PREFERENCE}/${workspaceId}/preferences`,
    shapeCollection(values, false, 'camelToSnackCase'),
    {
      params: {
        preference_name: 'record-list',
      },
    }
  );
  return result.response.Data.id;
};

const useUpdateUserPreference = (workspaceId: string) =>
  useMutation<
    string,
    IAPIError,
    {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    }
  >([API_MUTATION_KEY.UPDATE_USER_PREFERENCE], (values) =>
    updateUserPreference(workspaceId, values)
  );

export default useUpdateUserPreference;
