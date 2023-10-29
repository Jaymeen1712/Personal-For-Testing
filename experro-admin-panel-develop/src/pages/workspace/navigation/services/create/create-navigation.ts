import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  ICreateNavigationResponse,
  INavigation,
} from '../../../../../types';
import shapeCollection from '../../../../../utills/convert-request-response';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills/enums';

const createNavigation = async (
  navigation: INavigation,
  workspaceId: string,
  contentModelId?: string
) => {
  const result = await apiClient.post<
    INavigation,
    IAxiosResponse<{ item: ICreateNavigationResponse }>
  >(
    `${APIS_ROUTES.NAVIGATION}/${workspaceId}/menu/${contentModelId}/menu-items`,
    shapeCollection(navigation, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useCreateNavigation = (workspaceId: string, contentModelId?: string) =>
  useMutation<ICreateNavigationResponse, IAPIError, INavigation>(
    [API_MUTATION_KEY.CREATE_NAVIGATION],
    (navigation) => createNavigation(navigation, workspaceId, contentModelId)
  );

export default useCreateNavigation;
