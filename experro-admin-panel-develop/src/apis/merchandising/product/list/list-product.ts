import { useQuery } from 'react-query';

import apiClient from '../../../../apis/api-client';
import {
  IAxiosResponse,
  IListProductResponse,
  IPinDataResponse,
} from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';

const listProduct = async (
  workspaceId: string,
  search: string,
  environmentId?: string
) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: IPinDataResponse[] }>
  >(`${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/search-products`, {
    params: {
      fieldsToQuery: 'id,name_eti,images_ej,sku_esi',
      environments_id: environmentId,
      skip: 0,
      limit: 100,
      search: search,
    },
  });

  const pinedData: IListProductResponse[] = [];

  if (response.response.Data.items.length > 0) {
    response.response.Data.items.map((pinItem) => {
      //creating a json object of the data which is required to show the products inside a dropdown.
      const pinData = {
        id: pinItem.id,
        nameEti: pinItem.nameEti,
        skuEsi: pinItem.skuEsi,
        imagesEj:
          JSON.parse(pinItem.imagesEj) &&
          JSON.parse(pinItem.imagesEj).length &&
          JSON.parse(pinItem.imagesEj)[0].url_standard
            ? JSON.parse(pinItem.imagesEj)[0].url_standard
            : '',
      };
      pinedData.push(pinData);
      return true;
    });
  }

  return pinedData;
};

const useListProduct = (
  workspaceId: string,
  search: string,
  environmentId?: string
) =>
  useQuery(
    [API_QUERY_KEY.MERCHANDISING_PRODUCT, workspaceId, search, environmentId],
    () => listProduct(workspaceId, search, environmentId)
  );

export default useListProduct;
