import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildWorkspaceUserHandlers = (apiUrl: string): HandlerType => ({
  create: rest.post(
    generateApiUrl(apiUrl, `${APIS_ROUTES.WORKSPACES}/:workspaceId/users`),
    ({ body }) => {
      if (body && typeof body === 'object' && body['first_name'] === 'John') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: 'id' });
      }
    }
  ),
  // update: rest.put(
  //   generateApiUrl(apiUrl, `${APIS_ROUTES.WORKSPACES}/:workspaceId/users`),
  //   ({ params }) => {
  //     if (params.userId === '123') {
  //       return buildErrorResponse({});
  //     } else {
  //       return buildSuccessResponse({ item: params.id });
  //     }
  //   }
  // ),
  get: rest.get(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/users/:userId`
    ),
    ({ params }) => {
      if (params.userId === '12345' && params.workspaceId === '12345') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: '589818e0-bc2b-4e5c-a30f-90ce2359bfa9',
            first_name: 'HKHJK',
            last_name: 'LKHJ',
            email: 'hk@gmail.com',
            status: 'invited',
            is_mfa_enable: false,
            timezone: null,
            language_id: null,
            created_at: '2022-08-17T11:00:44.032Z',
            groups: [],
            roles: ['52cab1d2-15c7-45e0-868e-fb421cf72ed3'],
          },
        });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/users/:userId`
    ),
    ({ params }) => {
      if (params.userId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
  // get_workspace: rest.delete(
  //   generateApiUrl(apiUrl, APIS_ROUTES.USER_WORKSPACES),
  //   ({ params }) => {
  //     return buildSuccessResponse({
  //       items: [
  //         { id: '123', name: 'Workspace 1' },
  //         { id: '456', name: 'Workspace 2' },
  //       ],
  //     });
  //   }
  // ),
});

export default buildWorkspaceUserHandlers;
