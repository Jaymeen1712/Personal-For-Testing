import { useQuery } from 'react-query';
import { customAlphabet } from 'nanoid';

import apiClient from '../../../../../../apis/api-client';
import { IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

interface IListProductResponse {
  title: string;
  fieldName: string;
  type: string;
  id: string;
  isSearchable?: boolean;
}

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 12);

const listProductField = async (
  workspaceId: string,
  type: string,
  environmentId?: string
) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListProductResponse[] }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/content-fields`,
    {
      params: {
        environments_id: environmentId,
      },
    }
  );

  if (
    response &&
    response.response.Data.items &&
    response.response.Data.items.length > 0
  ) {
    response.response.Data.items.push({
      id: nanoid(),
      fieldName: 'score',
      type: 'string',
      isSearchable: false,
      title: 'Score',
    });
  }

  const productFields: IListProductResponse[] = [];

  response.response.Data.items.map((item) => {
    //It is a logic for the list of product fields.
    //but here we are not supposed to include the name_esi field and added a isSearchable in object to identify that the field is in the form of a drop-down to show its values.
    if (item.fieldName !== 'name_esi' && (type === 'slot' || type === 'rule')) {
      if (
        item.fieldName.endsWith('_eslai') ||
        item.fieldName.endsWith('_esi') ||
        item.fieldName.endsWith('_esli') ||
        item.fieldName.endsWith('_esai')
      ) {
        item.isSearchable = true;
        item.type = 'string';
      } else if (item.fieldName.endsWith('_ebi')) {
        item.isSearchable = true;
      }
      item.title = item.title
        .replaceAll('_', ' ')
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      productFields.push(item);
    } else {
      if (item.fieldName !== 'name_eti' && type === 'sort') {
        if (
          item.fieldName.endsWith('_eslai') ||
          item.fieldName.endsWith('_esi') ||
          item.fieldName.endsWith('_esli') ||
          item.fieldName.endsWith('_esai')
        ) {
          item.isSearchable = true;
          item.type = 'string';
        } else if (item.fieldName.endsWith('_ebi')) {
          item.isSearchable = true;
        }
        item.title = item.title
          .replaceAll('_', ' ')
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        productFields.push(item);
      }
    }
    return true;
  });

  return productFields;
};

const useListProductField = (
  workspaceId: string,
  type: string,
  environmentId?: string
) =>
  useQuery(
    [API_QUERY_KEY.PRODUCT_FIELDS, workspaceId, type, environmentId],
    () => listProductField(workspaceId, type, environmentId),
    { cacheTime: 0 }
  );

export default useListProductField;
