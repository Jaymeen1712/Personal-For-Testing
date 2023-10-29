import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IChangePassword,
  ICreateGroupRequest,
  ICreateGroupResponse,
} from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const changePassword = async (value: IChangePassword) => {
  await apiClient.put<
    ICreateGroupRequest,
    IAxiosResponse<ICreateGroupResponse>
  >(
    APIS_ROUTES.CHANGE_PASSWORD,
    shapeCollection(value, false, 'camelToSnackCase')
  );
};

const useChangePassword = () =>
  useMutation<void, IAPIError, IChangePassword>(
    API_MUTATION_KEY.CHANGE_PASSWORD,
    changePassword
  );

export default useChangePassword;
