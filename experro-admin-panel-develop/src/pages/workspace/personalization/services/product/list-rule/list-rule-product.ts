import { useMutation } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  IListProductItems,
  IListProductsResponseToOut,
  IListRuleProductDynamicFieldRequest,
} from '../../../../../../types';
import shapeCollection from '../../../../../../utills/convert-request-response';
import apiClient from '../../../../../../apis/api-client';
import {
  API_MUTATION_KEY,
  APIS_ROUTES,
  currencyFormatter,
} from '../../../../../../utills';

interface IListProductResponse {
  id?: string;
  nameEti?: string;
  skuEsi?: string;
  descriptionEti?: string;
  categoriesEtai: string[];
  imagesEj: string;
  providerIdEsi: number;
  isFeaturedEbi: boolean;
  pin: boolean;
  calculatedPriceEfi: number;
  slot: boolean;
  brandEsi: string;
  pageSlugEsi?: string;
  productAppearedInSearchEii: number;
  viewsEii: number;
  ordersEii: number;
  revenueEfi: number;
  clickRateEfi: number;
  conversionRateEfi: number;
}

interface IDetailsWorkspace {
  id: string;
  description: string;
  name: string;
  timezone: string;
  currency: string;
}

const listRuleProduct = async (
  data: IListRuleProductDynamicFieldRequest,
  workspaceId: string,
  skipCount: number,
  subMenu?: string
) => {
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

  if (JSON.stringify(data.dynamicFieldsData) === '{}') {
    return;
  }
  if (
    (data.dynamicFieldsData.searchTermsEslai === undefined ||
      data.dynamicFieldsData.searchTermsEslai.length === 0) &&
    (data.dynamicFieldsData.searchTerms === undefined ||
      data.dynamicFieldsData.searchTerms === '' ||
      (data.dynamicFieldsData.searchTerms.length === 1 &&
        data.dynamicFieldsData.searchTerms[0] === '')) &&
    (data.dynamicFieldsData.globalTermsEslai === undefined ||
      data.dynamicFieldsData.globalTermsEslai.length === 0 ||
      (data.dynamicFieldsData.globalTermsEslai.length === 1 &&
        data.dynamicFieldsData.globalTermsEslai[0] === '')) &&
    (data.dynamicFieldsData.categoriesEslai === undefined ||
      data.dynamicFieldsData.categoriesEslai.length === 0) &&
    (data.dynamicFieldsData.categories === undefined ||
      data.dynamicFieldsData.categories === '')
  ) {
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

  const response = await apiClient.post<
    IListRuleProductDynamicFieldRequest,
    IAxiosResponse<{ items: IListProductResponse[] }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/search`,
    convertedData,
    {
      params: {
        fieldsToQuery:
          'id,name_eti,images_ej,categories_etai,calculated_price_efi,brand_esi,is_featured_ebi,description_eti,brand_esi,page_slug_esi,product_appeared_in_search_eii,views_eii,orders_eii,revenue_efi,click_rate_efi,conversion_rate_efi',
        skip: skipCount,
        limit: 50,
      },
    }
  );

  const workspaceDetail = await apiClient.get<
    string,
    IAxiosResponse<{ item: IDetailsWorkspace }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}`, {
    params: { fields_to_query: 'description,name,timezone,currency' },
  });

  const products: IListProductItems[] = [];

  response.response.Data.items.map((product) => {
    const productInfo = {
      id: product.id ? product.id : '',
      nameEti: product.nameEti ? product.nameEti : '',
      descriptionEti: product.descriptionEti ? product.descriptionEti : '',
      skuEsi: product.skuEsi ? product.skuEsi : '',
      categoriesEtai: product.categoriesEtai
        ? product.categoriesEtai.join(',')
        : '',
      providerIdEsi: product.providerIdEsi ? product.providerIdEsi : 0,
      pin: product.pin ? product.pin : false,
      urlThumbnail:
        product.imagesEj &&
        JSON.parse(product.imagesEj) &&
        JSON.parse(product.imagesEj).length &&
        JSON.parse(product.imagesEj)[0].url_standard
          ? JSON.parse(product.imagesEj)[0].url_standard
          : '',
      isFeaturedEbi: product.isFeaturedEbi
        ? JSON.stringify(product.isFeaturedEbi)
        : '',
      calculatedPriceEfi: product.calculatedPriceEfi
        ? currencyFormatter(
            workspaceDetail.response.Data.item.currency,
            product.calculatedPriceEfi
          )
        : currencyFormatter(workspaceDetail.response.Data.item.currency, 0),
      slot: product.slot ? product.slot : false,
      brandEsi: product.brandEsi ? product.brandEsi : '',
      pageSlugEsi: product.pageSlugEsi ? product.pageSlugEsi : '',
      productAppearedInSearchEii: product.productAppearedInSearchEii
        ? product.productAppearedInSearchEii
        : 0,
      viewsEii: product.viewsEii ? product.viewsEii : 0,
      ordersEii: product.ordersEii ? product.ordersEii : 0,
      revenueEfi: product.revenueEfi
        ? currencyFormatter(
            workspaceDetail.response.Data.item.currency,
            product.revenueEfi
          )
        : currencyFormatter(workspaceDetail.response.Data.item.currency, 0),
      clickRateEfi: product.clickRateEfi ? `${product.clickRateEfi}%` : '0%',
      conversionRateEfi: product.conversionRateEfi
        ? `${product.conversionRateEfi}%`
        : '0%',
    };

    products.push(productInfo);
    return true;
  });

  return { items: products };
};

const useListRuleProduct = (
  workspaceId: string,
  skipCount: number,
  subMenu?: string
) =>
  useMutation<
    IListProductsResponseToOut | undefined,
    IAPIError,
    IListRuleProductDynamicFieldRequest
  >([API_MUTATION_KEY.RULE_LIST_PRODUCT, workspaceId, subMenu], (data) =>
    listRuleProduct(data, workspaceId, skipCount, subMenu)
  );

export default useListRuleProduct;
