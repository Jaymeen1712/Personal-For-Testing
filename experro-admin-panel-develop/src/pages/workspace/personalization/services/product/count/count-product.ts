import { useMutation } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  IListRuleProductDynamicFieldRequest,
} from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';
import apiClient from '../../../../../../apis/api-client';

const countProduct = async (
  data: IListRuleProductDynamicFieldRequest,
  workspaceId: string,
  skipCount: number,
  subMenu?: string
) => {
  if (JSON.stringify(data.dynamicFieldsData) === '{}') {
    return;
  }

  const convertedData = shapeCollection(data, false, 'camelToSnackCase');

  if (convertedData) {
    // @ts-ignore
    Object.keys(convertedData.dynamic_fields_data).map((key) => {
      if (
        key.startsWith('_d_e_v') ||
        key.startsWith('_p_r_o_d_u_c_t_i_o_n') ||
        key.startsWith('_c_u_s_t_o_m')
      ) {
        const newKey = key
          .replace('_d_e_v', 'DEV')
          .replace('_p_r_o_d_u_c_t_i_o_n', 'PRODUCTION')
          .replace('_c_u_s_t_o_m', 'CUSTOM');
        // @ts-ignore
        convertedData.dynamic_fields_data[newKey] =
          // @ts-ignore
          convertedData.dynamic_fields_data[key];

        // @ts-ignore
        delete convertedData.dynamic_fields_data[key];
      }
      return true;
    });
  }

  const productCount = await apiClient.post<
    IListRuleProductDynamicFieldRequest,
    IAxiosResponse<{ totalCount: string }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/search/count`,
    convertedData,
    {
      params: {
        fieldsToQuery:
          'id,name_eti,images_ej,categories_etai,calculated_price_efi,brand_esi,is_featured_ebi,description_eti,brand_esi',
        skip: skipCount,
        limit: 50,
      },
    }
  );

  return productCount.response.Data.totalCount;
};

const useCountProduct = (
  workspaceId: string,
  skipCount: number,
  subMenu?: string
) =>
  useMutation<
    string | undefined,
    IAPIError,
    IListRuleProductDynamicFieldRequest
  >([API_MUTATION_KEY.RULE_LIST_PRODUCT, workspaceId, subMenu], (data) =>
    countProduct(data, workspaceId, skipCount, subMenu)
  );

export default useCountProduct;
