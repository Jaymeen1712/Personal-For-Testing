import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills/enums';
// import shapeCollection from '../../../utills/convert-request-response';

interface Itheme {
  envId: string;
  themeId: string;
}

const publishTheme = async (themeData: Itheme, workspaceId: string) => {
  const result = await apiClient.put<Itheme, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.THEME_SERVICE}/${workspaceId}/theme-versions/${themeData.themeId}/publish`,
    {
      environment_id: themeData.envId,
    }
  );
  return result.response.Data.item;
};

const usePublishTheme = (workspaceId: string) =>
  useMutation<string | undefined, IAPIError, Itheme>(
    [API_MUTATION_KEY.PUBLISH_THEME],
    (themeData) => publishTheme(themeData, workspaceId)
  );

export default usePublishTheme;
