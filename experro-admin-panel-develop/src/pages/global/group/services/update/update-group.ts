import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IEditGroupRequest,
  IEditGroupResponse,
  IGroup,
} from '../../../../../types';
import shapeCollection from '../../../../../utills/convert-request-response';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';

const updateGroup = async (group: IGroup, groupId?: string | null) => {
  const groupData = shapeCollection(group, false, 'camelToSnackCase');
  const response = await apiClient.put<
    IEditGroupRequest,
    IAxiosResponse<IEditGroupResponse>
  >(`${APIS_ROUTES.GROUP}/${groupId}`, groupData);

  return response.response.Data;
};

const useUpdateGroup = (groupId?: string | null) =>
  useMutation<IEditGroupResponse, IAPIError, IGroup>(
    [API_MUTATION_KEY.UPDATE_GROUP],
    (group) => updateGroup(group, groupId)
  );

export default useUpdateGroup;
