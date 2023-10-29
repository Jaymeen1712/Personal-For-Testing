import { QueryClient } from 'react-query';

import { IAPIError } from './types';

const onError = (error: unknown) => {
  const status = (error as IAPIError).status;
  const response = (error as IAPIError).response;
  if (
    response &&
    status === 403 &&
    response.Error &&
    response.Error.errorCode === 'EX-00024' &&
    window.location.pathname.split('/')[1] === 'workspaces' &&
    [
      '/media-manager',
      '/discovery',
      '/cms-tokens',
      '/internationalization',
      '/301-redirects',
      '/emails',
      '/edge-caching',
      '/platforms/bigcommerce',
      '/users',
      '/roles',
    ].some((path) => window.location.pathname.includes(path))
  ) {
    window.location.href = `/workspaces/${
      window.location.pathname.split('/')[2]
    }/dashboard/traffic`;
  } else if (
    response &&
    status === 403 &&
    response.Error &&
    (response.Error.errorCode === 'EX-00024' ||
      response.Error.errorCode === 'EX-00006') &&
    window.location.pathname.split('/')[1] === 'workspaces' &&
    ['/content-library', '/content-model'].some((path) =>
      window.location.pathname.includes(path)
    )
  ) {
  } else if (status === 403 || status === 401) {
    if (
      ![
        '/login',
        '/forgot-password',
        '/set-password',
        '/reset-password',
      ].includes(window.location.pathname)
    ) {
      window.location.href = '/login';
    }
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      onError,
    },
    mutations: {
      onError,
    },
  },
});

export default queryClient;
