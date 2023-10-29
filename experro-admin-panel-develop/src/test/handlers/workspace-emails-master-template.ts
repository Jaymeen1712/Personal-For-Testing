import { rest } from 'msw';
import { APIS_ROUTES } from '../../utills';
import { buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildWorkspaceEmailsMasterTemplateHandlers = (apiUrl: string): HandlerType => ({
  get: rest.get(
    generateApiUrl(
      apiUrl,
      `${APIS_ROUTES.WORKSPACES}/:workspaceId/email-templates/master-template`
    ),
    () => {
      return buildSuccessResponse({
        items: [
          { id: 'rs1', name: 'Reset Password' },
          { id: 'su1', name: 'Sign Up' },
          { id: 'fp1', name: 'Forgot Password' },
        ],
      });
    }
  ),
});

export default buildWorkspaceEmailsMasterTemplateHandlers;
