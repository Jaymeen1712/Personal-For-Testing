import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import { IAxiosResponse } from '../../../types';

const generateQrTwoFactorAuthentication = async (isGenerateQrCode: boolean) => {
  if (!isGenerateQrCode) return;

  const response = await apiClient.get<void, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.GENERATE_QR_CODE}`
  );

  return response.response.Data.item;
};

const useGenerateQrTwoFactorAuthentication = (isGenerateQrCode: boolean) =>
  useQuery([API_QUERY_KEY.GENERATE_QR, isGenerateQrCode], () =>
    generateQrTwoFactorAuthentication(isGenerateQrCode)
  );

export default useGenerateQrTwoFactorAuthentication;
