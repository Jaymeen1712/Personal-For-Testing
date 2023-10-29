import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildContentModalHandlers = (apiUrl: string): HandlerType => ({
  get: rest.get(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.CONTENT_SERVICE}/:workspaceId${APIS_ROUTES.CONTENTS}`
    ),
    (req, res, context) => {
      const { params, url } = req;
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        if (url.searchParams.get('type') === 'collection') {
          return buildSuccessResponse({
            items: [
              {
                name: 'header',
                id: '5a6144ad-1dcb-402f-8489-7f4d79484d74',
              },
              {
                name: 'Tirthak',
                id: '4b9e4ba9-37e2-4bb0-88b3-f51c9fee15a5',
              },
            ],
          });
        }
      }
    }
  ),
});

export default buildContentModalHandlers;
