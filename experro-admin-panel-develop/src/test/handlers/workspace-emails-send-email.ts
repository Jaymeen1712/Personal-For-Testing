import { rest } from 'msw';
import { APIS_ROUTES } from '../../utills';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildWorkspaceEmailsSendEmailHandlers = (
  apiUrl: string
): HandlerType => ({
  post: rest.post(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/send-email`,
    ),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: true,
        });
      }
    }
  ),
});

export default buildWorkspaceEmailsSendEmailHandlers;
