import { rest } from 'msw';
import { APIS_ROUTES } from '../../utills';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildWorkspaceEmailsPhraseHandlers = (apiUrl: string): HandlerType => ({
  get: rest.get(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/phrase`
    ),
    ({ params }) => {
      if (params.workspaceId === '12345') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          items: [
            {
              id: 'p1',
              name: 'Experiment',
              value: 'Have you ever tried {{experro}}?',
              shortCode: '{{experiment}}',
            },	
            {
              id: 'p2',
              name: 'Experro',
              value: 'e-commerce platform',
              shortCode: '{{experro}}',
            },
          ],
        });
      }
    }
  ),
  add: rest.post(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/phrase`
    ),
    ({ params }) => {
      if (params.workspaceId === '12345') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: 'p1',
          },
        });
      }
    }
  ),
  update: rest.put(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/phrase/:values`
    ),
    ({ params }) => {
      if (params.workspaceId === '12345') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: 'p1',
          },
        });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/phrase/:phraseId`
    ),
    ({ params }) => {
      if (params.workspaceId === '12345') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: 'p1',
        });
      }
    }
  ),
});

export default buildWorkspaceEmailsPhraseHandlers;
