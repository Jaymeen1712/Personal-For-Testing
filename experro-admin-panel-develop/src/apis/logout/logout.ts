import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../utills';
import apiClient from '../api-client';

const logout = async (isLogout: boolean) => {
  if (!isLogout) return;

  const response = await apiClient.get<void, { response: { Data: string } }>(
    `${APIS_ROUTES.LOGOUT}`
  );

  return response.response.Data;
};

const useLogout = (isLogout: boolean) =>
  useQuery([API_QUERY_KEY.LOGOUT, isLogout], () => logout(isLogout));

export default useLogout;
