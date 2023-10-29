import apiClient from '../../api-client';
import { useMutation } from 'react-query';
import {
  IAxiosResponse,
  ICreateGroupRequest,
  ICreateGroupResponse,
  IChangePassword,
  IAPIError,
} from '../../../types';

import shapeCollection from '../../../utills/convert-request-response';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';

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
