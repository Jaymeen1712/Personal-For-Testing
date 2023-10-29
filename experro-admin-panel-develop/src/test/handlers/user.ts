import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildUserHandlers = (apiUrl: string): HandlerType => ({
  create: rest.post(generateApiUrl(apiUrl, APIS_ROUTES.USERS), ({ body }) => {
    if (body && typeof body === 'object' && body['first_name'] === 'John') {
      return buildErrorResponse({});
    } else {
      return buildSuccessResponse({ item: 'id' });
    }
  }),
  update: rest.put(
    generateApiUrl(apiUrl, `${APIS_ROUTES.USERS}/:userId`),
    ({ params }) => {
      if (params.userId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
  get: rest.get(
    generateApiUrl(apiUrl, `${APIS_ROUTES.USERS}/:userId`),
    ({ params }) => {
      if (params.userId === '1234') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john@gmail.com',
            roles: [{ id: '4' }, { id: '5' }],
            groups: [{ id: '2' }, { id: '3' }],
          },
        });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(apiUrl, `${APIS_ROUTES.USERS}/:userId`),
    ({ params }) => {
      if (params.userId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
  get_workspace: rest.get(
    generateApiUrl(apiUrl, APIS_ROUTES.USER_WORKSPACES),
    ({ params }) => {
      return buildSuccessResponse({
        items: [
          {
            id: '123',
            name: 'Workspace 1',
            description: 'Testing workspace 1',
            storeLink: 'https://store1.experro.com',
            timezone: 'UTC',
          },
        ],
      });
    }
  ),
});

export default buildUserHandlers;
