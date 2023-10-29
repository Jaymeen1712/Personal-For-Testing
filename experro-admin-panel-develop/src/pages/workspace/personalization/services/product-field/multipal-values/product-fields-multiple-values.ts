import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const productFieldsMultipleValues = async (
  workspaceId: string,
  selectedFieldsEditDuplicate?: string[],
  environmentId?: string
) => {
  if (!environmentId || !workspaceId || !selectedFieldsEditDuplicate) {
    return;
  } else {
    const productFieldValues: { items: string[] | [] }[] = [];

    await Promise.all(
      selectedFieldsEditDuplicate.map(async (productName, index) => {
        if (productName !== '') {
          const result = await apiClient.get<
            null,
            IAxiosResponse<{ items: string[] }>
          >(
            `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/content-fields/${productName}/values`,
            {
              params: { environments_id: environmentId },
            }
          );
          productFieldValues[index] = result.response.Data;
        } else {
          productFieldValues[index] = { items: [] };
        }
      })
    );

    return productFieldValues;
  }
};

const useProductFieldsMultipleValues = (
  workspaceId: string,
  selectedFieldsEditDuplicate?: string[],
  environmentId?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.MULTIPLE_PRODUCT_FIELDS_VALUE,
      workspaceId,
      selectedFieldsEditDuplicate,
      environmentId,
    ],
    () =>
      productFieldsMultipleValues(
        workspaceId,
        selectedFieldsEditDuplicate,
        environmentId
      ),
    {
      cacheTime: 0,
    }
  );

export default useProductFieldsMultipleValues;
