import axios from 'axios';
import get from 'lodash.get';

import shapeCollection from '../utills/convert-request-response';
import { USER_ACCESS_KEY } from '../utills/enums';
import Cookies from 'js-cookie';

const apiClient = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// request interceptor to add token to request headers
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get(USER_ACCESS_KEY.TOKEN);
    const tenantId = Cookies.get(USER_ACCESS_KEY.TENANT_ID);
    const storeLink = Cookies.get(USER_ACCESS_KEY.STORE_LINK);

    if (!config.headers) {
      config.headers = {};
    }

    if (storeLink) {
      config.headers['x-workspace-hash'] = `${storeLink}`;
    }

    if (accessToken) {
      config.headers['accesstoken'] = `Bearer ${accessToken}`;
      config.headers['content-type'] = 'application/json';
      // config.headers['Connection'] = 'Close';
      config.headers['x-tenant-id'] = `${tenantId}`;
    } else {
      // config.headers['Connection'] = 'Close';
    }
    return config;
  },
  (error) => Promise.reject(new Error(error.response.data))
);

// response interceptor intercepting 401 responses, refreshing token and retrying the request
apiClient.interceptors.response.use(
  (response) => ({
    statusCode: response && response.status,
    response: ['/user-service/v1/permissions'].includes(
      response.config.url || ''
    )
      ? response.data
      : shapeCollection(response.data, false, 'snackCaseToCamel'),
  }),
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      typeof window !== 'undefined'
    ) {
      // Cookies.remove(USER_ACCESS_KEY.TOKEN);
      // Cookies.remove(USER_ACCESS_KEY.TENANT_ID);
      // const url = window.location.pathname;
      // window.location.href = '/page-not-found';
    } else if (
      error.response &&
      (error.response.status === 400 || error.response.status === 404) &&
      (error.response.data.Error.code === 'EX-00081' ||
        error.response.data.Error.errorCode === 'EX-00089')
    ) {
      window.location.href = '/not-access';
    } else if (error.response.status === 500 || error.response.status === 503) {
      alert('Server under maintenance');
    }

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      status: get(error, 'response.status'),
      response: get(error, 'response.data'),
      message: get(error, 'response.data.Error.message'),
    });
  }
);

export default apiClient;
