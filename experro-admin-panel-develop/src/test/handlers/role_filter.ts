import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildRoleFilterHandlers = (apiUrl: string): HandlerType => ({
  get: rest.get(
    generateApiUrl(apiUrl, `${APIS_ROUTES.SETTING_FILTER}`),
    ({ params }) => {
      return buildSuccessResponse({
        item: [
          {
            role_id: '17bd5af7-8ca2-4948-839d-ada6a79869fe',
            role_name: 'Role 3',
            workspace_id: '27ef240d-19c7-4e84-a0e8-3b29aa3f5bab',
            workspace_name: 'meesho 2',
          },
          {
            role_id: 'b6d8f2f9-9c3f-4489-9d39-16e663ee1cdc',
            role_name: 'admin',
            workspace_id: '27ef240d-19c7-4e84-a0e8-3b29aa3f5bab',
            workspace_name: 'meesho 2',
          },
          {
            role_id: '0b87646f-33b1-43a6-81c1-29d162c69ecc',
            role_name: 'Role 2',
            workspace_id: 'aec12aa9-8352-4ed3-8b05-01b991d885f6',
            workspace_name: 'Workspace 1',
          },
          {
            role_id: '8efd08d7-591e-4c39-be19-1c4dc440e9a3',
            role_name: 'Super admin',
            workspace_id: 'aec12aa9-8352-4ed3-8b05-01b991d885f6',
            workspace_name: 'Workspace 1',
          },
          {
            role_id: 'ff1b14ec-f26c-4e73-9c9b-38ebec3383b9',
            role_name: 'manager',
            workspace_id: 'fd031aa5-8846-4852-a9cb-2e2a94cfc3fa',
            workspace_name: 'hello shoping',
          },
          {
            role_id: '460848b8-c473-4eda-9c3f-c36f70703ec6',
            role_name: 'Global Super Admin',
            workspace_id: null,
            workspace_name: null,
          },
        ],
      });
    }
  ),
});

export default buildRoleFilterHandlers;
