import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../../../utills/enums';
import {
  IAPIError,
  IAxiosResponse,
  ISelectUser,
  ISelectUserResponse,
  IWorkspaceUser,
} from '../../../../../types';
import shapeCollection from '../../../../../utills/convert-request-response';

const addWorkspaceUser = async (
  user: IWorkspaceUser,
  workspaceId: string,
  isEdit: boolean
) => {
  const result = await apiClient.put<null, IAxiosResponse<ISelectUserResponse>>(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/users`,
    shapeCollection(user, false, 'camelToSnackCase'),
    {
      params: {
        isEdit: isEdit,
      },
    }
  );

  return result.response.Data.items;
};

const useAddWorkspaceUser = (workspaceId: string, isEdit: boolean) =>
  useMutation<ISelectUserResponse | ISelectUser[], IAPIError, IWorkspaceUser>(
    API_QUERY_KEY.WORKSPACE_USERS,
    (user: IWorkspaceUser) => addWorkspaceUser(user, workspaceId, isEdit)
  );

export default useAddWorkspaceUser;
