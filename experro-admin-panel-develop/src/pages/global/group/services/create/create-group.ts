import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  ICreateGroupRequest,
  IGroup,
} from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

interface ICreateGroupResponse {
  id: string;
}

const createGroup = async (group: IGroup) => {
  const response = await apiClient.post<
    ICreateGroupRequest,
    IAxiosResponse<{ item: ICreateGroupResponse }>
  >(APIS_ROUTES.GROUP, shapeCollection(group, false, 'camelToSnackCase'));

  return response.response.Data.item;
};

const useCreateGroup = () =>
  useMutation<ICreateGroupResponse, IAPIError, IGroup>(
    [API_MUTATION_KEY.CREATE_GROUP],
    createGroup
  );

export default useCreateGroup;
