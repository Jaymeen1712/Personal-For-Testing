import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildUserFilterHandlers = (apiUrl: string): HandlerType => ({
  get: rest.get(
    generateApiUrl(apiUrl, `${APIS_ROUTES.USER_FILTER}`),
    ({ params }) => {
      return buildSuccessResponse({
        item: [
          {
            id: '0349e2ea-b331-46bc-9eb4-8943797bd17a',
            email: 'tirthak.shah@rapidops.com',
            first_name: 'tirthak',
            last_name: 'Shah',
          },
          {
            id: '143948cc-76e2-4fcc-b9f4-ed624659b354',
            email: 'tirthak.shah@rapidops.com',
            first_name: 'tirthak',
            last_name: null,
          },
          {
            id: '5cddf532-8091-4952-b93e-37f4f35306ed',
            email: 'tirthak.shah1@rapidops.com',
            first_name: 'tirthak',
            last_name: null,
          },
          {
            id: '801ac226-a06a-4ec2-81a3-c1e4569dc770',
            email: 'heena.shah@rapidops.com',
            first_name: 'Heena',
            last_name: 'shah',
          },
          {
            id: '9646c3ca-816b-41cd-8dc7-b9ed4c53b19c',
            email: 'panthak.shah@rapidops.com',
            first_name: 'Panthak',
            last_name: 'shah',
          },
          {
            id: '98d9d0b4-c35e-4461-b34e-5f05489cdc6b',
            email: 'palak.shah@rapidops.com',
            first_name: 'Palak',
            last_name: 'shah',
          },
          {
            id: 'aa6192ba-3af5-40e8-9b7e-4db3662004b7',
            email: 'tirthak.shah11@gmail.com',
            first_name: 'tirthak',
            last_name: 'shah',
          },
          {
            id: 'd28fd25e-a7bb-4fa0-a60f-e8a68795887a',
            email: 'heena@gmail.com',
            first_name: 'Heena',
            last_name: 'shah',
          },
        ],
      });
    }
  ),
});

export default buildUserFilterHandlers;
