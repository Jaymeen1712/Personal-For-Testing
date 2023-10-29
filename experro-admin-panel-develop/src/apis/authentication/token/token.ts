import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse, ISignIn } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';

interface TokenRequest extends ISignIn {
  linkName: string;
}

interface TokenResponse {
  item: {
    accesstoken: string;
    email: string;
    id: string;
    isMfa: boolean;
    isMfaAuthApp: boolean;
    isMfaEnable: boolean;
    isMfaMail: boolean;
    isRecoveryKeyGenerated: boolean;
    mfaPreference: string;
    tenantId: string;
    workspaceId: string;
  };
}

export const token = async (signIn: TokenRequest) => {
  const { linkName, ...rest } = signIn;
  const result = await apiClient.post<ISignIn, IAxiosResponse<TokenResponse>>(
    APIS_ROUTES.TOKEN,
    rest,
    {
      headers: {
        'x-link-name': linkName,
        'x-client-id': '46a3c8c3-cb5c-49b2-8bd7-801382f26345',
        'x-client-secret': 'Smq7Q~PT1pgY96UTUS4xsQv.wQuKBikvNh23j',
        'x-grant-type': 'password',
      },
    }
  );

  return result.response.Data;
};

const useToken = () =>
  useMutation<TokenResponse, IAPIError, TokenRequest>(
    [API_MUTATION_KEY.TOKEN],
    token
  );

export default useToken;
