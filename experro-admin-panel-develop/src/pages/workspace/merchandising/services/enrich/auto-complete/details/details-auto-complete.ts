import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';
import { IListAutoComplete } from '../../../../../../../types';

const detailsAutoComplete = async (
  autoCompleteId: string,
  workspaceId: string
) => {
  if (!autoCompleteId.length) return undefined;

  const response = await apiClient.get<
    string,
    IAxiosResponse<IListAutoComplete>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/auto-suggester/${autoCompleteId}`,
    {
      params: {
        fieldsToQuery:
          'search_term,id,type,modified_by,modified_on,created_by,created_at',
      },
    }
  );

  return response.response.Data;
};

const useDetailsAutoComplete = (autoCompleteId: string, workspaceId: string) =>
  useQuery<IListAutoComplete | undefined, IAPIError>(
    [API_QUERY_KEY.AUTO_COMPLETE_DETAIL, autoCompleteId],
    () => detailsAutoComplete(autoCompleteId, workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useDetailsAutoComplete;
