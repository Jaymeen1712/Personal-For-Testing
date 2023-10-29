import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildWorkspaceRoleHandlers = (apiUrl: string): HandlerType => ({
  create: rest.post(generateApiUrl(apiUrl, `${APIS_ROUTES.WORKSPACE_ROLE}/:workspaceId/role`), ({ body }) => {
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
    generateApiUrl(apiUrl, `${APIS_ROUTES.WORKSPACE_ROLE}/:workspaceId/role/:roleId`),
    ({ params }) => {
      if (params.roleId === '123' && params.workspaceId === '12345') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
  get: rest.get(
    generateApiUrl(apiUrl, `${APIS_ROUTES.WORKSPACE_ROLE}/:workspaceId/role/:roleId`),
    ({ params }) => {
      if (params.roleId === '1234' && params.workspaceId === '12345') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: params.roleId,
            name: 'Rapid Admin',
            description: 'Rapid Admin',
            workspaceId: '082915b8-2858-439f-bc96-4a50e4c01bcb',
            tenantId: 'd4956fe5-dccb-4c09-ac02-44bac1042e1f',
            permissions: { },
          },
        });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(apiUrl, `${APIS_ROUTES.WORKSPACE_ROLE}/:workspaceId/role/:roleId`),
    ({ params }) => {
      if (params.roleId === '123' && params.workspaceId === '12345') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
});

export default buildWorkspaceRoleHandlers;
