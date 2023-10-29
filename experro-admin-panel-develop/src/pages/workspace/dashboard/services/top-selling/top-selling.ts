import { useQuery } from 'react-query';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  USER_ACCESS_KEY,
} from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse } from '../../../../../types';
import Cookies from 'js-cookie';

interface ITopSellingResponse {
  sku: string;
  soldQty: number;
}

interface ITopSellingProducts {
  id: string;
  name: string;
  price: number;
  sku: string;
  pageSlug: string;
  urlThumbnail: string;
  soldQty: number;
}

const topSelling = async (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const topSellingProducts: ITopSellingProducts[] = [];
    const skuIds: string[] = [];
    const soldQty: number[] = [];

    const response = await apiClient.get<
      string,
      { response: ITopSellingResponse[] }
    >(`${APIS_ROUTES.TOP_SELLING_PRODUCTS}`, {
      params: {
        date_range: 'CUSTOM',
        start_date: startDate,
        end_date: endDate,
        start: 0,
        rows: 5,
      },
      headers: {
        'x-env-id': environmentId,
        'x-workspace-id': workspaceId,
      },
    });

    if (response && response.response && response.response.length > 0) {
      for (let i = 0; i <= response.response.length - 1; i++) {
        skuIds.push(response.response[i].sku);
        soldQty.push(response.response[i].soldQty);
      }
    }

    if (skuIds.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.post<string, IAxiosResponse<any>>(
        `${APIS_ROUTES.GET_ALL_ECOMMERCE_PRODUCTS}/${workspaceId}/admin-search`,
        {
          filter: {
            sku_esi: skuIds,
          },
        },
        {
          headers: {
            accesstoke: `Bearer ${Cookies.get(USER_ACCESS_KEY.TOKEN)}`,
            // @ts-ignore
            'x-workspace-hash': Cookies.get(USER_ACCESS_KEY.STORE_LINK),
            // @ts-ignore
            'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
            'x-env-id': environmentId,
            'x-workspace-id': workspaceId,
          },
          params: {
            fieldsToQuery: 'images_ej,calculated_price_efi,,page_slug_esi',
            by_pass_inventory: true,
            environmentId: environmentId,
          },
        }
      );

      if (response.response.Data.items.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.response.Data.items.forEach((image: any, index: number) => {
          const items = {
            id: image.id ? image.id : '',
            name: image.nameEti ? image.nameEti : '',
            price: image.calculatedPriceEfi ? image.calculatedPriceEfi : 0,
            sku: image.skuEsi ? image.skuEsi : '',
            pageSlug: image.pageSlugEsi ? image.pageSlugEsi : '',
            urlThumbnail:
              JSON.parse(image.imagesEj) &&
              JSON.parse(image.imagesEj).length &&
              JSON.parse(image.imagesEj)[0].url_standard
                ? JSON.parse(image.imagesEj)[0].url_standard
                : '',
            soldQty: soldQty[index] ? soldQty[index] : 0,
          };
          topSellingProducts.push(items);
        });
      }
    }

    return topSellingProducts;
  }
};

const useTopSelling = (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [API_QUERY_KEY.TOP_SELLING, workspaceId, environmentId, startDate, endDate],
    () => topSelling(workspaceId, environmentId, startDate, endDate)
  );

export default useTopSelling;
