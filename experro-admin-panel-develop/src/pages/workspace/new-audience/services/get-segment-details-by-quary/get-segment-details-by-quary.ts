import { useMutation } from 'react-query';

import {
  IAPIError,
  FormFieldValues,
  IAxiosResponse,
  IAudienceDetailsList,
} from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const getSegmentDetailsByQuery = async (
  values: {
    environmentId: string;
    query: object;
    skip: number;
    skipLimit: number;
    columnSortOrder: { sortBy: string; orderBy: string };
    searchData: string;
  },
  workspaceId: string
) => {
  const { skip, skipLimit, searchData, ...rest } = values;
  const result = await apiClient.post<
    FormFieldValues,
    IAxiosResponse<{
      items: IAudienceDetailsList[];
      totalCount: number;
      count: number;
    }>
  >(
    `${APIS_ROUTES.AUDIENCE_SERVICE}/${workspaceId}/get-visitors-by-query`,
    shapeCollection(rest, false, 'camelToSnackCase'),
    {
      params: {
        skip: `${skip * skipLimit - skipLimit}`,
        limit: skipLimit,
        name: searchData,
      },
    }
  );

  return result.response.Data;
};
const useGetSegmentDetailsByQuery = (workspaceId: string) =>
  useMutation<
    {
      items: IAudienceDetailsList[];
      totalCount: number;
      count: number;
    },
    IAPIError,
    {
      environmentId: string;
      query: object;
      skip: number;
      skipLimit: number;
      columnSortOrder: { sortBy: string; orderBy: string };
      searchData: string;
    }
  >([API_MUTATION_KEY.GET_SEGMENT_DETAILS_BY_QUERY], (values) =>
    getSegmentDetailsByQuery(values, workspaceId)
  );

export default useGetSegmentDetailsByQuery;
