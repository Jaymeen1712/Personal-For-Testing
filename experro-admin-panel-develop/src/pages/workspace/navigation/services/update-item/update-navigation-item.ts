import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  INavigationTreeItem,
} from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills/enums';
import shapeCollection from '../../../../../utills/convert-request-response';

const updateNavigationItem = async (
  navigation: INavigationTreeItem[],
  workspaceId: string,
  menuId: string,
  versionId?: string,
  contentModelId?: string
) => {
  const result = await apiClient.put<
    INavigationTreeItem[],
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.NAVIGATION}/${workspaceId}/menu/${contentModelId}/menu-items/${menuId}`,
    shapeCollection({ content_ej: navigation }, false, 'camelToSnackCase'),
    {
      params: {
        version_id: `${versionId}`,
      },
    }
  );
  return result.response.Data.item;
};

const useUpdateNavigationItem = (
  workspaceId: string,
  menuId: string,
  versionId?: string,
  contentModelId?: string
) =>
  useMutation<string | undefined, IAPIError, INavigationTreeItem[]>(
    [API_MUTATION_KEY.UPDATE_NAVIGATION_ITEM],
    (navigation) =>
      updateNavigationItem(
        navigation,
        workspaceId,
        menuId,
        versionId,
        contentModelId
      )
  );

export default useUpdateNavigationItem;
