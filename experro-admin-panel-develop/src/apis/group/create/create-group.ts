import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import {
  IAPIError,
  IAxiosResponse,
  ICreateGroupRequest,
  ICreateGroupResponse,
  IGroup,
} from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';
import shapeCollection from '../../../utills/convert-request-response';

const createGroup = async (group: IGroup) => {
  const response = await apiClient.post<
    ICreateGroupRequest,
    IAxiosResponse<ICreateGroupResponse>
  >(APIS_ROUTES.GROUP, shapeCollection(group, false, 'camelToSnackCase'));

  return response.response.Data;
};

const useCreateGroup = () =>
  useMutation<ICreateGroupResponse, IAPIError, IGroup>(
    [API_MUTATION_KEY.CREATE_GROUP],
    createGroup
  );

export default useCreateGroup;
