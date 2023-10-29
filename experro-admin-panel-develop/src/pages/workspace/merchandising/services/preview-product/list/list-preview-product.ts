import { useMutation } from 'react-query';

import {
  allowSpecificDomain,
  API_MUTATION_KEY,
  APIS_ROUTES,
  currencyFormatter,
} from '../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IGetProfileResponse,
  IListPreviewProductDynamicFieldRequest,
  IListProductItems,
} from '../../../../../../types';
import apiClient from '../../../../../../apis/api-client';
import shapeCollection from '../../../../../../utills/convert-request-response';

interface IListPreviewProductRequest {
  environmentsId?: string;
  categories?: string | string[];
  categoryId?: string | string[];
  searchTerms?: string | string[];
  siteRules?: { id?: string; enabled?: boolean; default?: boolean }[];
  categoryRules?: { id?: string; enabled?: boolean; default?: boolean }[];
  searchRules?: { id?: string; enabled?: boolean; default?: boolean }[];
}

interface IDetailsWorkspace {
  id: string;
  description: string;
  name: string;
  timezone: string;
  currency: string;
}

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
  profitPercentageEfi?: number;
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
  isAllRuleEnabled?: boolean;
  enabledRuleCount?: number;
  allRuleCount?: number;
}

const listPreviewProduct = async (
  data: {
    skipCount: number;
    ruleData: IListPreviewProductDynamicFieldRequest;
    previewData?: IListPreviewProductResponse;
  },
  workspaceId: string,
  versionId: string,
  subMenu?: string
) => {
  const item: IListPreviewProductRequest = {};
  const products: IListProductItems[] = [];
  let isAllRuleEnabled = false;
  let enabledRuleCount = 0;
  let allRuleCount = 0;

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

  const response = await apiClient.post<
    IListPreviewProductRequest,
    IAxiosResponse<{
      totalCount: string;
      categoryRule: IRules[];
      searchRule: IRules[];
      sitesRule: IRules[];
      items: IListProductResponse[];
      query: string;
    }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/search`,
    shapeCollection(item, false, 'camelToSnackCase'),
    {
      params: {
        fieldsToQuery:
          'id,name_eti,images_ej,categories_etai,calculated_price_efi,brand_esi,is_featured_ebi,description_eti,brand_esi,page_slug_esi,product_appeared_in_search_eii,views_eii,orders_eii,revenue_efi,click_rate_efi,conversion_rate_efi,profit_percentage_efi',
        skip: data.skipCount,
        limit: 50,
        preview: true,
      },
    }
  );

  const workspaceDetail = await apiClient.get<
    string,
    IAxiosResponse<{ item: IDetailsWorkspace }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}`, {
    params: { fields_to_query: 'description,name,timezone,currency' },
  });

  const userDetail = await apiClient.get<
    null,
    IAxiosResponse<{ item: IGetProfileResponse }>
  >(APIS_ROUTES.PROFILE);

  response.response.Data.items.map((product) => {
    const productInfo: IListProductItems = {
      id: product.id ? product.id : '',
      nameEti: product.nameEti ? product.nameEti : '',
      descriptionEti: product.descriptionEti ? product.descriptionEti : '',
      skuEsi: product.skuEsi ? product.skuEsi : '',
      categoriesEtai: product.categoriesEtai
        ? product.categoriesEtai.join(',')
        : '',
      providerIdEsi: product.providerIdEsi ? `#${product.providerIdEsi}` : `#0`,
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
    };

    if (allowSpecificDomain(userDetail.response.Data.item.email)) {
      Object.assign(productInfo, {
        productAppearedInSearchEii: product.productAppearedInSearchEii
          ? `#${product.productAppearedInSearchEii}`
          : '#0',
        viewsEii: product.viewsEii ? `#${product.viewsEii}` : '#0',
        ordersEii: product.ordersEii ? `#${product.ordersEii}` : '#0',
        revenueEfi: product.revenueEfi
          ? currencyFormatter(
              workspaceDetail.response.Data.item.currency,
              product.revenueEfi
            )
          : currencyFormatter(workspaceDetail.response.Data.item.currency, 0),
        clickRateEfi: product.clickRateEfi
          ? `${product.clickRateEfi.toFixed(2)}%`
          : '0%',
        conversionRateEfi: product.conversionRateEfi
          ? `${product.conversionRateEfi.toFixed(2)}%`
          : '0%',
        profitPercentageEfi: product.profitPercentageEfi
          ? product.profitPercentageEfi.toFixed(2)
          : 0,
      });
    }

    products.push(productInfo);
    return true;
  });

  if (response) {
    if (subMenu === 'category-rules') {
      const tempCategorySite = response.response.Data.sitesRule.concat(
        response.response.Data.categoryRule
      );
      allRuleCount = tempCategorySite.length;

      if (tempCategorySite.length > 0) {
        for (let i = 0; i <= tempCategorySite.length - 1; i++) {
          if (tempCategorySite[i].enabled) {
            isAllRuleEnabled = true;
          } else {
            isAllRuleEnabled = false;
            break;
          }
        }

        for (let i = 0; i <= tempCategorySite.length - 1; i++) {
          if (tempCategorySite[i].enabled) {
            enabledRuleCount = enabledRuleCount + 1;
          }
        }
      } else {
        isAllRuleEnabled = false;
      }
    }

    if (subMenu === 'search-rules') {
      const tempSearchSite = response.response.Data.sitesRule.concat(
        response.response.Data.searchRule
      );
      allRuleCount = tempSearchSite.length;

      if (tempSearchSite.length > 0) {
        for (let i = 0; i <= tempSearchSite.length - 1; i++) {
          if (tempSearchSite[i].enabled) {
            isAllRuleEnabled = true;
          } else {
            isAllRuleEnabled = false;
            break;
          }
        }

        for (let i = 0; i <= tempSearchSite.length - 1; i++) {
          if (tempSearchSite[i].enabled) {
            enabledRuleCount = enabledRuleCount + 1;
          }
        }
      } else {
        isAllRuleEnabled = false;
      }
    }

    if (subMenu === 'global-rules') {
      const tempSite = response.response.Data.sitesRule.concat(
        response.response.Data.searchRule
      );

      allRuleCount = tempSite.length;

      if (tempSite.length > 0) {
        for (let i = 0; i <= tempSite.length - 1; i++) {
          if (tempSite[i].enabled) {
            isAllRuleEnabled = true;
          } else {
            isAllRuleEnabled = false;
            break;
          }
        }

        for (let i = 0; i <= tempSite.length - 1; i++) {
          if (tempSite[i].enabled) {
            enabledRuleCount = enabledRuleCount + 1;
          }
        }
      } else {
        isAllRuleEnabled = false;
      }
    }

    if (
      subMenu === 'global-rules' &&
      response.response.Data.sitesRule.length > 0
    ) {
      if (
        response.response.Data.sitesRule.findIndex(
          (siteRule) => siteRule.id === versionId
        ) > -1
      ) {
        response.response.Data.sitesRule = response.response.Data.sitesRule
          .splice(
            response.response.Data.sitesRule.findIndex(
              (siteRule) => siteRule.id === versionId
            ),
            1
          )
          .concat([...response.response.Data.sitesRule]);
      }
    }

    if (
      subMenu === 'category-rules' &&
      response.response.Data.categoryRule.length > 0
    ) {
      if (
        response.response.Data.categoryRule.findIndex(
          (categoryRule) => categoryRule.id === versionId
        ) > -1
      ) {
        response.response.Data.categoryRule =
          response.response.Data.categoryRule
            .splice(
              response.response.Data.categoryRule.findIndex(
                (categoryRule) => categoryRule.id === versionId
              ),
              1
            )
            .concat([...response.response.Data.categoryRule]);
      }
    }

    if (
      subMenu === 'search-rules' &&
      response.response.Data.searchRule.length > 0
    ) {
      if (
        response.response.Data.searchRule.findIndex(
          (searchRule) => searchRule.id === versionId
        ) > -1
      ) {
        response.response.Data.searchRule = response.response.Data.searchRule
          .splice(
            response.response.Data.categoryRule.findIndex(
              (searchRule) => searchRule.id === versionId
            ),
            1
          )
          .concat([...response.response.Data.searchRule]);
      }
    }
  }

  return {
    totalCount: response.response.Data.totalCount,
    categoryRule: response.response.Data.categoryRule,
    searchRule: response.response.Data.searchRule,
    sitesRule: response.response.Data.sitesRule,
    query: response.response.Data.query,
    items: products,
    isAllRuleEnabled: isAllRuleEnabled,
    enabledRuleCount: enabledRuleCount,
    allRuleCount: allRuleCount,
  };
};

const useListPreviewProduct = (
  workspaceId: string,
  versionId: string,
  subMenu?: string
) =>
  useMutation<
    IListPreviewProductResponse | undefined,
    IAPIError,
    {
      skipCount: number;
      ruleData: IListPreviewProductDynamicFieldRequest;
      previewData?: IListPreviewProductResponse;
    }
  >(
    [API_MUTATION_KEY.PREVIEW_PRODUCT_LIST, workspaceId, subMenu, versionId],
    (data) => listPreviewProduct(data, workspaceId, versionId, subMenu)
  );

export default useListPreviewProduct;
