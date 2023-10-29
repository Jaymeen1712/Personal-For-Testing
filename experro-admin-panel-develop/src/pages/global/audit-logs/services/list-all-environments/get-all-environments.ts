import { useQuery } from 'react-query';
import {
  IAPIError,
  IAxiosResponse,
  IGetAllEnvironmentsRecordResponse,
} from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../../../utills';

const getAllEnvironments = async () => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<IGetAllEnvironmentsRecordResponse[]>
  >(`${APIS_ROUTES.ENVIRONMENTS_SERVICE}`, {
    params: {
      fieldsToQuery: 'id,workspace_id,title,type',
    },
  });

  return result.response.Data;
};

const useGetAllEnvironments = () =>
  useQuery<IGetAllEnvironmentsRecordResponse[], IAPIError>(
    API_QUERY_KEY.GET_ALL_ENVIRONMENTS,
    getAllEnvironments,
    {
      cacheTime: 0,
    }
  );

export default useGetAllEnvironments;
