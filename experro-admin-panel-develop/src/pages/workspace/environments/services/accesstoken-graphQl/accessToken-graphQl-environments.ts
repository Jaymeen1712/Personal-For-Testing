import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';

import { API_QUERY_KEY, USER_ACCESS_KEY } from '../../../../../utills';

const accessTokenGraphQlEnvironments = async (userId?: string) => {
  if (!userId) return;

  const response = await axios.get(
    'https://graphql.experro-dev.app/apis/graphql-service/accesstoken',
    {
      params: {
        userId: userId,
        workspaceHash: Cookies.get(USER_ACCESS_KEY.STORE_LINK),
        tenantId: Cookies.get(USER_ACCESS_KEY.TENANT_ID),
      },
    }
  );

  return response.data;
};

const useAccessTokenGraphQlEnvironments = (userId?: string) =>
  useQuery([API_QUERY_KEY.GRAPH_QL_ENVIRONMENT, userId], () =>
    accessTokenGraphQlEnvironments(userId)
  );

export default useAccessTokenGraphQlEnvironments;
