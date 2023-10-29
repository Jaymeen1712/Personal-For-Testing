import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildFolderHandlers = (apiUrl: string): HandlerType => ({
  create: rest.post(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.MEDIA_MANAGER}/:workspaceId/folders/:parentFolderId/sub-folders`
    ),
    ({ params }) => {
      if (
        params.name === 'Folder 1' &&
        params.workspaceId === '12345' &&
        params.parentFolderId === '123'
      ) {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: 'folderId' });
      }
    }
  ),
  update: rest.put(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.MEDIA_MANAGER}/:workspaceId/folders/:parentFolderId/sub-folders/:folderId`
    ),
    ({ params }) => {
      if (
        params.name === 'Folder 1' &&
        params.workspaceId === '12345' &&
        params.parentFolderId === '123' &&
        params.folderId === '12'
      ) {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: 'folderId' });
      }
    }
  ),
  get: rest.get(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.MEDIA_MANAGER}/:workspaceId/folders/:folderId/sub-folders`
    ),
    ({ params }) => {
      if (params.workspaceId === '12345' && params.folderId === '12') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            count: 0,
            createdAt: '2022-08-25T14:24:41.736Z',
            createdBy: 'f84e4642-c290-42f2-a0cd-ea053bb7dc33',
            id: '9081507d-3003-4287-8d2c-caaae5a41a6c',
            modifiedAt: '2022-08-25T14:24:41.736Z',
            name: 'Products',
          },
        });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.MEDIA_MANAGER}/:workspaceId/folders/:folderId`
    ),
    ({ params }) => {
      if (params.workspaceId === '12345' && params.folderId === '12') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
});

export default buildFolderHandlers;
