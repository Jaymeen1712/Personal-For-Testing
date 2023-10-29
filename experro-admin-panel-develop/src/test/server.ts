import { setupServer } from 'msw/node';

import { getHandlers } from './handlers';

export const initServer = () => setupServer(...getHandlers('http://localhost'));
