import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildGlobalRoleHandlers = (apiUrl: string): HandlerType => ({
  create: rest.post(generateApiUrl(apiUrl, APIS_ROUTES.ROLES), ({ body }) => {
    if (
      body &&
      typeof body === 'object' &&
      body['role_name'] === 'Hello World'
    ) {
      return buildErrorResponse({});
    } else {
      return buildSuccessResponse({ item: 'id' });
    }
  }),
  update: rest.put(
    generateApiUrl(apiUrl, `${APIS_ROUTES.ROLES}/:roleId`),
    ({ params }) => {
      if (params.roleId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
  get: rest.get(
    generateApiUrl(apiUrl, `${APIS_ROUTES.ROLES}/:roleId`),
    ({ params }) => {
      if (params.roleId === '1234') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            isSuccess:true,
            isFetched:true,
            id: params.roleId,
            name: 'Rapid Admin',
            description: 'Rapid Admin',
            workspaceId: null,
            tenantId: 'd4956fe5-dccb-4c09-ac02-44bac1042e1f',
            permissions: {
              global: {
                permission: {
                  canManageWorkspace: true,
                  canManageUserAndSecurity: true,
                },
              },
            },
          },
        });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(apiUrl, `${APIS_ROUTES.ROLES}/:roleId`),
    ({ params }) => {
      if (params.roleId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
});

export default buildGlobalRoleHandlers;
