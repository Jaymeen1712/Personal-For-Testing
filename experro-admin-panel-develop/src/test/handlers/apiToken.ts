import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';
import moment from 'moment';

const buildAPITokenHandlers = (apiUrl: string): HandlerType => ({
  create: rest.post(
    generateApiUrl(apiUrl, `${APIS_ROUTES.TOKENS}/:workspaceId/api-tokens`),
    ({ body }) => {
      if (body && typeof body === 'object' && body['name'] === 'temp') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: 'id' });
      }
    }
  ),
  update: rest.put(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.TOKENS}/:workspaceId/api-tokens/:tokenId`
    ),
    ({ params }) => {
      if (params.tokenId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
  get: rest.get(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.TOKENS}/:workspaceId/api-tokens/:tokenId`
    ),
    ({ params }) => {
      if (params.tokenId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            name: 'token 1',
            description: 'token description',
            type: 'Read Only',
            validTill: moment('2022-06-09'),
          },
        });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.TOKENS}/:workspaceId/api-tokens/:tokenId`
    ),
    ({ params }) => {
      if (params.tokenId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
});

export default buildAPITokenHandlers;
