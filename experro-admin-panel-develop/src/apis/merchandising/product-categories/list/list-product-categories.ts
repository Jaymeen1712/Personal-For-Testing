import { useQuery } from 'react-query';

import apiClient from '../../../../apis/api-client';
import { IAxiosResponse } from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';

interface IListProductCategoriesRequest {
  workspaceId: string;
  subMenu?: string;
  environmentId?: string;
}

interface IListProductCategoriesResponse {
  id: string;
  currentVersionId: string;
  title: string;
}

const listProductCategories = async (
  productCategory: IListProductCategoriesRequest
) => {
  if (productCategory.subMenu !== 'category-rules') return undefined;
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IListProductCategoriesResponse[] }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${productCategory.workspaceId}/contents/content-data/category-list`,
    {
      params: {
        environments_id: productCategory.environmentId,
        fieldsToQuery: 'title',
      },
    }
  );

  const productCategories: { label: string; value: string; id: string }[] = [];

  response.response.Data.items.map((productCategory) =>
    productCategories.push({
      label: productCategory.title,
      value: productCategory.title,
      id: productCategory.id,
    })
  );

  return productCategories;
};

const useListProductCategories = (
  productCategory: IListProductCategoriesRequest
) =>
  useQuery(
    [API_QUERY_KEY.MERCHANDISING_PRODUCT_CATEGORIES, productCategory],
    () => listProductCategories(productCategory)
  );

export default useListProductCategories;
