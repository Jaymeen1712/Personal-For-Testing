import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse, IInsights } from '../../../../types';
import { snackCaseToCamel } from '../../../../utills/convert-request-response';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../../utills/enums';
import apiClient from '../../../../apis/api-client';

const getInsightData = async (workspaceId?: string | null) => {
  const response = await apiClient.get<IInsights, IAxiosResponse<IInsights>>(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/insights`
  );

  const insights = response.response.Data.items.insights.map((insight) => ({
    label: insight.label,
    value: snackCaseToCamel(insight.value),
  }));

  return {
    items: {
      insights: insights,
    },
  };
};

const useListInsight = (workspaceId?: string | null) =>
  useQuery<IInsights, IAPIError>(
    API_QUERY_KEY.INSIGHT_LIST,
    () => getInsightData(workspaceId),
    { cacheTime: 0 }
  );

export default useListInsight;
