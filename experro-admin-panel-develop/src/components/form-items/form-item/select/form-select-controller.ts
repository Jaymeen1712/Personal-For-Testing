/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';

import apiClient from '../../../../apis/api-client';
import { IAxiosResponse, IFormParams } from '../../../../types';

const getSelectOptions = async (url?: string, params?: IFormParams) => {
  if (url === undefined) {
    return [];
  }

  const result = await apiClient.get<null, IAxiosResponse<any>>(url, {
    params,
  });

  return result.response.Data.items || result.response.Data;
};

const useFormSelectController = (url?: string, params?: IFormParams) =>
  useQuery(['form-select', url], () => getSelectOptions(url, params), {
    cacheTime: 0,
  });

export default useFormSelectController;
