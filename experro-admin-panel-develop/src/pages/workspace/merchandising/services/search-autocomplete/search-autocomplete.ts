import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse } from '../../../../../types';

const searchAutocomplete = async (workspaceId: string, searchTerm: string) => {
  if (!workspaceId) {
    return;
  } else {
    const searchValue: { id: string; text: string }[] = [];

    const response = await apiClient.post<
      string,
      IAxiosResponse<{ items: string[] }>
    >(
      `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/search-autocomplete`,
      {
        search_term: searchTerm,
      }
    );

    if (
      response &&
      response.response.Data &&
      response.response.Data.items &&
      response.response.Data.items.length > 0
    ) {
      for (let i = 0; i <= response.response.Data.items.length - 1; i++) {
        searchValue.push({
          id: response.response.Data.items[i].replace(/<\/?[^>]+(>|$)/g, ''),
          text: response.response.Data.items[i].replace(/<\/?[^>]+(>|$)/g, ''),
        });
      }

      return searchValue;
    }
  }
};

const useSearchAutocomplete = (workspaceId: string) =>
  useMutation(
    [API_MUTATION_KEY.SEARCH_AUTOCOMPLETE, workspaceId],
    (searchTerm: string) => searchAutocomplete(workspaceId, searchTerm)
  );

export default useSearchAutocomplete;
