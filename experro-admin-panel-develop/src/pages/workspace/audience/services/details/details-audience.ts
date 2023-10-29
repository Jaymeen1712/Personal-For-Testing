import { useQuery } from 'react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
  IAPIError,
  IAxiosResponse,
  IDetailAudienceuser,
} from '../../../../../types';
import { API_QUERY_KEY, USER_ACCESS_KEY } from '../../../../../utills';

const detailsAudience = async (
  audienceId: string,
  workspaceId: string,
  environmentId: string
) => {
  if (!workspaceId || !environmentId || !audienceId) {
    return;
  } else {
    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    const result = await apiClient.get<
      null,
      IAxiosResponse<{ item: IDetailAudienceuser }>
    >(`/analytics-service/v1/users/${audienceId}/details`, {
      headers: {
        // @ts-ignore
        'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
        'x-workspace-id': workspaceId,
        'x-env-id': environmentId,
      },
    });

    // @ts-ignore
    return result.data;
  }
};

const useDetailsAudience = (
  audienceId: string,
  workspaceId: string,
  environmentId: string
) =>
  useQuery<IDetailAudienceuser | undefined, IAPIError>(
    [API_QUERY_KEY.DETAILS_AUDIENCE, audienceId, workspaceId, environmentId],
    () => detailsAudience(audienceId, workspaceId, environmentId),
    {
      cacheTime: 0,
    }
  );

export default useDetailsAudience;
