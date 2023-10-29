import axios from 'axios';
import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import { IAPIError } from '../../../types';

interface IValidateInternalUsingRecoveryKeyRequest {
  recoveryCode?: string;
  accessToken: string;
}

interface IValidateInternalRecoveryKeyResponse {
  data: {
    Data: {
      item: boolean;
    };
  };
}

const validateInternalRecoveryKey = async (
  values: IValidateInternalUsingRecoveryKeyRequest
) => {
  const apiClient = await axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const response = await apiClient.post<
    IValidateInternalUsingRecoveryKeyRequest,
    IValidateInternalRecoveryKeyResponse
  >(
    `${APIS_ROUTES.VERIFY_RECOVERY_KEY}`,
    {
      recovery_code: values.recoveryCode,
    },
    {
      headers: {
        'content-type': 'application/json',
        accesstoken: `Bearer ${values.accessToken}`,
      },
    }
  );

  return response.data.Data.item;
};

const useValidateInternalRecoveryKey = () =>
  useMutation<boolean, IAPIError, IValidateInternalUsingRecoveryKeyRequest>(
    [API_MUTATION_KEY.VALIDATE_INTERNAL_RECOVERY_KEY],
    (values) => validateInternalRecoveryKey(values)
  );

export default useValidateInternalRecoveryKey;
