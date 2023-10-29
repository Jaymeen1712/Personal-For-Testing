import { useMutation } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  IListPreviewProductDynamicFieldRequest,
  IListProductItems,
} from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';
import shapeCollection from '../../../../../../utills/convert-request-response';

interface IListPreviewProductRequest {
  environmentsId?: string;
  categories?: string | string[];
  categoryId?: string | string[];
  searchTerms?: string | string[];
  globalTermsEslai?: string | string[];
  siteRules?: { id?: string; enabled?: boolean; default?: boolean }[];
  categoryRules?: { id?: string; enabled?: boolean; default?: boolean }[];
  searchRules?: { id?: string; enabled?: boolean; default?: boolean }[];
}

interface IRules {
  description?: string[];
  keywords?: string[];
  pin?: number;
  ruleTypeEsi?: string;
  ruleTitleEti?: string;
  enabled?: boolean;
  rules?: number;
  slot?: number;
  sort?: number;
  id?: string;
  default?: boolean;
}

interface IListPreviewProductResponse {
  totalCount?: string;
  categoryRule?: IRules[];
  searchRule?: IRules[];
  sitesRule?: IRules[];
  query?: string;
  items?: IListProductItems[];
}

const countPreviewProduct = async (
  data: {
    skipCount: number;
    ruleData: IListPreviewProductDynamicFieldRequest;
    previewData?: IListPreviewProductResponse;
  },
  workspaceId: string,
  subMenu?: string
) => {
  const item: IListPreviewProductRequest = {};

  if (subMenu === 'category-rules') {
    item['environmentsId'] = data.ruleData.environmentsId;
    item['categories'] = data.ruleData.dynamicFieldsData.categories;
    item['categoryId'] = data.ruleData.dynamicFieldsData.categoryId;
    if (
      data.previewData &&
      data.previewData.sitesRule &&
      data.previewData.sitesRule.length > 0
    ) {
      item['siteRules'] = data.previewData.sitesRule.map((siteRuleData) => {
        return {
          id: siteRuleData.id,
          enabled: siteRuleData.enabled,
          default: siteRuleData.default,
        };
      });
    }
    if (
      data.previewData &&
      data.previewData.categoryRule &&
      data.previewData.categoryRule.length > 0
    ) {
      item['categoryRules'] = data.previewData.categoryRule.map(
        (categoryRuleData) => {
          return {
            id: categoryRuleData.id,
            enabled: categoryRuleData.enabled,
            default: categoryRuleData.default,
          };
        }
      );
    }
  }

  if (subMenu === 'search-rules') {
    item['environmentsId'] = data.ruleData.environmentsId;
    item['searchTerms'] = data.ruleData.dynamicFieldsData.searchTerms;
    if (
      data.previewData &&
      data.previewData.sitesRule &&
      data.previewData.sitesRule.length > 0
    ) {
      item['siteRules'] = data.previewData.sitesRule.map((siteRuleData) => {
        return {
          id: siteRuleData.id,
          enabled: siteRuleData.enabled,
          default: siteRuleData.default,
        };
      });
    }
    if (
      data.previewData &&
      data.previewData.searchRule &&
      data.previewData.searchRule.length > 0
    ) {
      item['searchRules'] = data.previewData.searchRule.map(
        (searchRuleData) => {
          return {
            id: searchRuleData.id,
            enabled: searchRuleData.enabled,
            default: searchRuleData.default,
          };
        }
      );
    }
  }

  if (subMenu === 'global-rules') {
    item['environmentsId'] = data.ruleData.environmentsId;
    item['searchTerms'] = data.ruleData.dynamicFieldsData.globalTermsEslai;
    if (
      data.previewData &&
      data.previewData.sitesRule &&
      data.previewData.sitesRule.length > 0
    ) {
      item['siteRules'] = data.previewData.sitesRule.map((siteRuleData) => {
        return {
          id: siteRuleData.id,
          enabled: siteRuleData.enabled,
          default: siteRuleData.default,
        };
      });
    }
    if (
      data.previewData &&
      data.previewData.searchRule &&
      data.previewData.searchRule.length > 0
    ) {
      item['searchRules'] = data.previewData.searchRule.map(
        (searchRuleData) => {
          return {
            id: searchRuleData.id,
            enabled: searchRuleData.enabled,
            default: searchRuleData.default,
          };
        }
      );
    }
  }

  const productCount = await apiClient.post<
    IListPreviewProductRequest,
    IAxiosResponse<{ totalCount: string }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/search/count`,
    shapeCollection(item, false, 'camelToSnackCase'),
    {
      params: {
        fieldsToQuery:
          'id,name_eti,images_ej,categories_etai,calculated_price_efi,brand_esi,is_featured_ebi,description_eti,brand_esi',
        skip: data.skipCount,
        limit: 50,
        preview: true,
      },
    }
  );

  return productCount.response.Data.totalCount;
};

const useCountPreviewProduct = (
  workspaceId: string,

  subMenu?: string
) =>
  useMutation<
    string | undefined,
    IAPIError,
    {
      skipCount: number;
      ruleData: IListPreviewProductDynamicFieldRequest;
      previewData?: IListPreviewProductResponse;
    }
  >([API_MUTATION_KEY.PREVIEW_PRODUCT_COUNT, workspaceId, subMenu], (data) =>
    countPreviewProduct(data, workspaceId, subMenu)
  );

export default useCountPreviewProduct;
