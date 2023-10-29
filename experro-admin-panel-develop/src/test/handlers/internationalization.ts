import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills/enums';
import { buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildInternationalizationHandler = (apiUrl: string): HandlerType => ({
  get: rest.get(generateApiUrl(apiUrl, `${APIS_ROUTES.LANGUAGES}`), () => {
    return buildSuccessResponse({
      items: [
        {
          id: 'a4d53ad8-ba8e-478a-aba7-9dccc5f2ddc7',
          locale: 'Gu',
          display_name: 'Gujarati',
        },
        {
          id: 'e46e5ec5-3330-4bc9-ad9f-b5412d1e32ec',
          locale: 'Hi',
          display_name: 'Hindi',
        },
        {
          id: 'ed9db0af-f653-4856-82c9-97acc43fa949',
          locale: 'Eng',
          display_name: 'English',
        },
      ],
    });
  }),
});

export default buildInternationalizationHandler;
