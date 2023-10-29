import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';

import {
  API_QUERY_KEY,
  APIS_ROUTES,
  USER_ACCESS_KEY,
} from '../../../../../utills';

interface IImageArray {
  id: string;
  name: string;
  price: number;
  sku: string;
  pageSlug: string;
  urlThumbnail: string;
}

const userEvents = async (
  deviceId: string,
  event: string,
  workspaceId: string,
  environmentId: string,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !deviceId || !startDate || !endDate) {
    return;
  } else {
    const imageArray: IImageArray[] = [];
    const skuIds: string[] = [];

    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    const result = await apiClient.get(
      `${APIS_ROUTES.ANALYTICS_AUDIENCE}/${deviceId}/events`,
      {
        headers: {
          // @ts-ignore
          'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
          'x-workspace-id': workspaceId,
          'x-env-id': environmentId,
        },
        params: {
          event: event,
          date_range: 'CUSTOM',
          start_date: startDate,
          end_date: endDate,
        },
      }
    );

    // @ts-ignore
    result.data.forEach((event) => {
      if (event.segmentation.variant_sku) {
        if (
          !skuIds.some((id: string) => id === event.segmentation.variant_sku)
        ) {
          if (skuIds.length < 8) {
            skuIds.push(event.segmentation.variant_sku);
          }
        }
      } else {
        if (!skuIds.some((id: string) => id === event.segmentation.sku)) {
          if (skuIds.length < 8) {
            skuIds.push(event.segmentation.sku);
          }
        }
      }
    });

    if (skuIds.length) {
      const response = await apiClient.post(
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
            fieldsToQuery: 'images_ej,calculated_price_efi,page_slug_esi',
            by_pass_inventory: true,
            environmentId: environmentId,
          },
        }
      );

      if (response.data.Data.items.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.data.Data.items.forEach((image: any) => {
          const items = {
            id: image.id,
            name: image.menu_title_es,
            price: image.calculated_price_efi,
            sku: image.sku_esi,
            pageSlug: image.page_slug_esi,
            urlThumbnail:
              JSON.parse(image.images_ej) &&
              JSON.parse(image.images_ej).length &&
              JSON.parse(image.images_ej)[0].url_standard
                ? JSON.parse(image.images_ej)[0].url_standard
                : '',
          };
          imageArray.push(items);
        });
      }
    }

    return imageArray;
  }
};

const useUserEvents = (
  deviceId: string,
  event: string,
  workspaceId: string,
  environmentId: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.USER_EVENTS,
      deviceId,
      workspaceId,
      environmentId,
      startDate,
      endDate,
      event,
    ],
    () =>
      userEvents(
        deviceId,
        event,
        workspaceId,
        environmentId,
        startDate,
        endDate
      ),
    {
      cacheTime: 0,
    }
  );

export default useUserEvents;
