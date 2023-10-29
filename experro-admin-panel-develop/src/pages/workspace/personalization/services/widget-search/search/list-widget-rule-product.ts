import { useMutation } from 'react-query';
import {
  API_MUTATION_KEY,
  APIS_ROUTES,
  currencyFormatter,
} from '../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IListProductItems,
} from '../../../../../../types';
import apiClient from '../../../../../../apis/api-client';
import shapeCollection from '../../../../../../utills/convert-request-response';

interface IDetailsWorkspace {
  id: string;
  description: string;
  name: string;
  timezone: string;
  currency: string;
}

const listWidgetRuleProduct = async (
  // eslint-disable-next-line
  data: any,
  workspaceId: string,
  skipCount: number
) => {
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

  // eslint-disable-next-line
  const response = await apiClient.post<any, IAxiosResponse<any>>(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/widget-search`,
    convertedData,
    {
      params: {
        fieldsToQuery:
          'id,name_eti,images_ej,sku_esi,categories_etai,calculated_price_efi,brand_esi,is_featured_ebi,description_eti,brand_esi',
        skip: 0,
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
  // eslint-disable-next-line
  response.response.Data.items.map((product: any) => {
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

  return { totalCount: response.response.Data.totalCount, items: products };
};

const useListWidgetRuleProduct = (workspaceId: string, skipCount: number) =>
  // eslint-disable-next-line
  useMutation<any, IAPIError, any>(
    [API_MUTATION_KEY.WIDGET_RULE_LIST_PRODUCT, workspaceId],
    (data) => listWidgetRuleProduct(data, workspaceId, skipCount)
  );

export default useListWidgetRuleProduct;
