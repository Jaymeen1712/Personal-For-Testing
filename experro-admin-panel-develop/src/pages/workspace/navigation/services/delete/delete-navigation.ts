import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills/enums';

type DeleteNavigationParameter = {
  workspaceId: string;
  menuId?: string;
  contentModelId?: string;
};

const deleteNavigation = async (menuInfo: DeleteNavigationParameter) => {
  await apiClient.post(
    `${APIS_ROUTES.NAVIGATION}/${menuInfo.workspaceId}/menu/${menuInfo.contentModelId}/menu-items-ids`,
    {
      menu_item_ids: [`${menuInfo.menuId}`],
    }
  );
};

const useDeleteNavigation = () =>
  useMutation<void, IAPIError, DeleteNavigationParameter, string>(
    [API_MUTATION_KEY.DELETE_NAVIGATION],
    deleteNavigation
  );

export default useDeleteNavigation;
