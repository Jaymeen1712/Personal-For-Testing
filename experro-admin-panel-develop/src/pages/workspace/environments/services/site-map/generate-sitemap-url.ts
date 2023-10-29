import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

const generateSiteMapUrl = async (
  workspaceId?: string,
  generateSiteMap?: boolean
) => {
  if (!workspaceId || !generateSiteMap) return;

  const response = await apiClient.get(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/site-map`
  );

  return response;
};

const useGenerateSitemapUrl = (
  workspaceId?: string,
  generateSiteMap?: boolean
) =>
  useQuery([API_QUERY_KEY.GENERATE_URL, workspaceId, generateSiteMap], () =>
    generateSiteMapUrl(workspaceId, generateSiteMap)
  );

export default useGenerateSitemapUrl;
