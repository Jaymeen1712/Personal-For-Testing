import { rest } from 'msw';
import { APIS_ROUTES } from '../../utills';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildWorkspaceEmailsTemplateHandlers = (apiUrl: string): HandlerType => ({
  clone: rest.post(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/template`
    ),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: { id: 'test1' },
        });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/template/:templateId`
    ),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: { ...params },
        });
      }
    }
  ),
  patch: rest.patch(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/template/:id/active`
    ),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: 'rs1',
            masterTemplateName: 'Reset Password',
            name: 'Default - Reset Password',
            subject: 'Template',
            htmlContent: '<html><body>Test</body></html>',
            environmentIds: ['prod1', 'dev1'],
          },
        });
      }
    }
  ),
  get: rest.get(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/template/:templateId`
    ),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: 'rs1',
            masterTemplateName: 'Reset Password',
            name: 'Default - Reset Password',
            subject: 'Template',
            htmlContent: '<html><body>Test</body></html>',
            environmentIds: ['prod1', 'dev1'],
          },
        });
      }
    }
  ),
  put: rest.put(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/template/:templateId`
    ),
    ({ params }) => {
      if (params.workspaceId === '123' && params.templateId === 't123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({
          item: {
            id: 'rs1',
          },
        });
      }
    }
  ),
});

export default buildWorkspaceEmailsTemplateHandlers;
