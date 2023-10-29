import { rest } from 'msw';
import { APIS_ROUTES } from '../../utills';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildWorkspaceEmailsSmtpHandlers = (apiUrl: string): HandlerType => ({
  get: rest.get(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/smtp`
    ),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: 'test1',
            isSmtpEnable: true,
            fromName: 'Testing',
            fromEmail: 'testing@test.com',
            smtpHost: 'testing.host.com',
            smtpPort: '80',
            isAuthenticationEnable: true,
            encryptionType: 'SSL',
            smtpUsername: 'testing',
            smtpPassword: 'test@1234',
          },
        });
      }
    }
  ),
  add: rest.post(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/smtp`
    ),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: 'test1',
          },
        });
      }
    }
  ),
  update: rest.put(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/smtp`
    ),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: 'test1',
          },
        });
      }
    }
  ),
});

export default buildWorkspaceEmailsSmtpHandlers;
