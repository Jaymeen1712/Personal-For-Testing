import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../utills/enums';
import apiClient from '../../api-client';
import shapeCollection from '../../../utills/convert-request-response';

const delete301Redirect = async (
  workspaceId: string,
  data: { redirectIds: string[] | React.Key[] }
) => {
  await apiClient.post<string[], IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/redirects/redirectIds`,
    shapeCollection(data, false, 'camelToSnackCase')
  );
};

const useDelete301Redirect = (workspaceId: string) =>
  useMutation<void, IAPIError, { redirectIds: string[] | React.Key[] }>(
    [API_MUTATION_KEY.DELETE_301_REDIRECT],
    (data: { redirectIds: string[] | React.Key[] }) =>
      delete301Redirect(workspaceId, data)
  );

export default useDelete301Redirect;
