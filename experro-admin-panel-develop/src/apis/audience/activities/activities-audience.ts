import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES, USER_ACCESS_KEY } from '../../../utills';
import shapeCollection from '../../../utills/convert-request-response';

interface IAudienceActivity {
  id: string;
  device_id: string;
  timestamp: Date;
  reqts: Date;
  key: string;
  source: string;
  referer: string;
  count: number;
  sum: number;
  dur: number;
  hour: number;
  dow: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  segmentation: any;
  sdk_version: string;
  sdk_name: string;
  campaign_id: string;
  utm_campaign: string;
  utm_source: string;
  utm_medium: string;
  utm_content: string;
  utm_term: string;
  device_name: string;
  device_type: string;
  device_vendor: string;
  device_version: string;
  device_category: string;
  device_resolution: string;
  device_density: string;
  app_version: string;
  os_name: string;
  os_version: string;
  country: string;
  region: string;
  city: string;
  lat: number;
  long: number;
  locale: string;
  continent: string;
  postal_code: string;
  ip: string;
  tenant_id: string;
  workspace_id: string;
  environment_id: string;
  is_processed: boolean;
}

interface IActivityList {
  key: string;
  timestamp: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  segmentation: any;
}

const audienceActivity = async (
  deviceId: string,
  workspaceId: string,
  environmentId: string,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !deviceId || !startDate || !endDate) {
    return;
  } else {
    const audienceActivityList: IActivityList[] = [];

    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    const response = await apiClient.get(
      `${APIS_ROUTES.ANALYTICS_AUDIENCE}/${deviceId}/events`,
      {
        headers: {
          // @ts-ignore
          'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
          'x-workspace-id': workspaceId,
          'x-env-id': environmentId,
        },
        params: {
          date_range: 'CUSTOM',
          start_date: startDate,
          end_date: endDate,
          start: 0,
          rows: 20,
        },
      }
    );

    if (response.data) {
      if (response.data.length > 0) {
        response.data.map((audienceActivityLog: IAudienceActivity) => {
          const item = {
            key: audienceActivityLog.key,
            timestamp: audienceActivityLog.timestamp,
            segmentation: shapeCollection(
              audienceActivityLog.segmentation,
              false,
              'snackCaseToCamel'
            ),
          };
          audienceActivityList.push(item);
          return true;
        });
      }
    }

    return audienceActivityList.sort(function (a, b) {
      const tempStartDate = new Date(a.timestamp);
      const tempEndDate = new Date(b.timestamp);
      // @ts-ignore
      return tempEndDate - tempStartDate;
    });
  }
};

const useActivitiesAudience = (
  deviceId: string,
  workspaceId: string,
  environmentId: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.AUDIENCE_ACTIVITY,
      deviceId,
      workspaceId,
      environmentId,
      startDate,
      endDate,
    ],
    () =>
      audienceActivity(
        deviceId,
        workspaceId,
        environmentId,
        startDate,
        endDate
      ),
    { cacheTime: 0 }
  );

export default useActivitiesAudience;
