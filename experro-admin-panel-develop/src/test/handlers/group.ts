import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildGroupHandlers = (apiUrl: string): HandlerType => ({
  create: rest.post(generateApiUrl(apiUrl, APIS_ROUTES.GROUP), ({ body }) => {
    if (body && typeof body === 'object' && body['name'] === 'Hello World') {
      return buildErrorResponse({});
    } else {
      return buildSuccessResponse({ item: 'id' });
    }
  }),
  update: rest.put(
    generateApiUrl(apiUrl, `${APIS_ROUTES.GROUP}/:groupId`),
    ({ params }) => {
      if (params.groupId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
  get: rest.get(
    generateApiUrl(apiUrl, `${APIS_ROUTES.GROUP}/:groupId`),
    ({ params }) => {
      if (params.groupId === '1234') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            groupId: params.groupId,
            name: 'Hello World',
            description: 'Hello ?',
            roles: [
              '8efd08d7-591e-4c39-be19-1c4dc440e9a3',
              'ff1b14ec-f26c-4e73-9c9b-38ebec3383b9',
            ],
            users: [
              '9646c3ca-816b-41cd-8dc7-b9ed4c53b19c',
              '98d9d0b4-c35e-4461-b34e-5f05489cdc6b',
            ],
          },
        });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(apiUrl, `${APIS_ROUTES.GROUP}/:groupId`),
    ({ params }) => {
      if (params.groupId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
});

export default buildGroupHandlers;
