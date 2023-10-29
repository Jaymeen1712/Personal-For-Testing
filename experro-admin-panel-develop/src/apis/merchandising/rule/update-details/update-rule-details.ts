import { useMutation } from 'react-query';
import apiClient from '../../../../apis/api-client';
import shapeCollection from '../../../../utills/convert-request-response';
import { IAPIError, IRuleData } from '../../../../types';
import {
  API_MUTATION_KEY,
  APIS_ROUTES,
  API_QUERY_KEY,
} from '../../../../utills';

const updateRuleDetails = async (
  workspaceId: string,
  contentModelId: string,
  contentModelDataId: string,
  data: IRuleData,
  subMenu?: string
) => {
  if (!workspaceId && !contentModelId && !contentModelDataId) {
    return;
  } else {
    if (data.dynamicFieldsData && data.dynamicFieldsData.Version_) {
      delete data.dynamicFieldsData.Version_;
      delete data.dynamicFieldsData.modifiedAt;
      delete data.dynamicFieldsData.isLocalizationEnabled;
    }

    if (data.dynamicFieldsData.startDateEdti) {
      data.dynamicFieldsData.startDateEdti = new Date(
        data.dynamicFieldsData.startDateEdti
      ).toISOString();
    }

    if (data.dynamicFieldsData.endDateEdti) {
      data.dynamicFieldsData.endDateEdti = new Date(
        data.dynamicFieldsData.endDateEdti
      ).toISOString();
    }

    if (subMenu === 'search-rules') {
      data.dynamicFieldsData.categories = '';
      data.dynamicFieldsData.categoryId = '';
      data.dynamicFieldsData.globalTermsEslai = '';
    }
    if (subMenu === 'category-rules') {
      data.dynamicFieldsData.searchTerms = '';
      data.dynamicFieldsData.globalTermsEslai = '';
    }
    if (subMenu === 'global-rules') {
      data.dynamicFieldsData.categories = '';
      data.dynamicFieldsData.categoryId = '';
      data.dynamicFieldsData.searchTerms = '';
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

    await apiClient.put(
      `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/${API_QUERY_KEY.CONTENTS}/${contentModelId}/${APIS_ROUTES.CONTENT_MODAL_DATA}/${contentModelDataId}/rules-data`,
      convertedData
    );
  }
};

const useUpdateRuleDetails = (
  workspaceId: string,
  contentModelId: string,
  contentModelDataId: string,
  subMenu?: string
) =>
  useMutation<void, IAPIError, IRuleData>(
    [API_MUTATION_KEY.UPDATE_MERCHANDISING_RULE],
    (data) => {
      return updateRuleDetails(
        workspaceId,
        contentModelId,
        contentModelDataId,
        data,
        subMenu
      );
    }
  );

export default useUpdateRuleDetails;
