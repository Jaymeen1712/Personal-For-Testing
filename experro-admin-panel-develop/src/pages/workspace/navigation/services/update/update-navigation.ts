import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse, INavigation } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills/enums';
import shapeCollection from '../../../../../utills/convert-request-response';

const updateNavigation = async (
  navigation: INavigation,
  workspaceId: string,
  menuId?: string,
  contentModelId?: string
) => {
  if (!navigation) return;
  const result = await apiClient.put<
    INavigation,
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.NAVIGATION}/${workspaceId}/menu/${contentModelId}/menu-items/${menuId}/update-record`,
    shapeCollection(navigation, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useUpdateNavigation = (
  workspaceId: string,
  menuId?: string,
  contentModelId?: string
) =>
  useMutation<string | undefined, IAPIError, INavigation>(
    [API_MUTATION_KEY.UPDATE_NAVIGATION],
    (navigation) =>
      updateNavigation(navigation, workspaceId, menuId, contentModelId)
  );

export default useUpdateNavigation;
