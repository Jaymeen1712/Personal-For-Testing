import { rest } from 'msw';

import { APIS_ROUTES } from '../../utills';
import { buildErrorResponse, buildSuccessResponse } from '../response';
import { generateApiUrl } from '../utills';
import { HandlerType } from '../../types';

const buildWorkspaceHandlers = (apiUrl: string): HandlerType => ({
  update: rest.put(
    generateApiUrl(apiUrl, `${APIS_ROUTES.WORKSPACE_LANGUAGES}/:workspaceId`),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
  delete: rest.delete(
    generateApiUrl(apiUrl, `${APIS_ROUTES.WORKSPACE_LANGUAGES}/:workspaceId`),
    ({ params }) => {
      if (params.workspaceId === '123') {
        return buildErrorResponse({});
      } else {
        return buildSuccessResponse({ item: params.id });
      }
    }
  ),
  get: rest.get(generateApiUrl(apiUrl, `${APIS_ROUTES.TIME_ZONE}`), () => {
    return buildSuccessResponse({
      items: [
        'DST',
        'U',
        'HST',
        'AKDT',
        'PDT',
        'PDT',
        'PST',
        'UMST',
        'MDT',
        'MDT',
        'CAST',
        'CDT',
        'CDT',
        'CCST',
        'SPST',
        'EST',
        'EDT',
        'UEDT',
        'VST',
        'PYT',
        'ADT',
        'CBST',
        'SWST',
        'PSST',
        'NDT',
        'ESAST',
        'AST',
        'SEST',
        'GDT',
        'MST',
        'BST',
        'U',
        'MDT',
        'ADT',
        'CVST',
        'MDT',
        'UTC',
        'GMT',
        'BST',
        'GDT',
        'GST',
        'WEDT',
        'CEDT',
        'RDT',
        'CEDT',
        'WCAST',
        'NST',
        'GDT',
        'MEDT',
        'EST',
        'SDT',
        'EEDT',
        'SAST',
        'FDT',
        'TDT',
        'JDT',
        'LST',
        'JST',
        'AST',
        'KST',
        'AST',
        'EAST',
        'MSK',
        'SAMT',
        'IDT',
        'AST',
        'ADT',
        'MST',
        'GET',
        'CST',
        'AST',
        'WAST',
        'YEKT',
        'PKT',
        'IST',
        'SLST',
        'NST',
        'CAST',
        'BST',
        'MST',
        'SAST',
        'NCAST',
        'CST',
        'NAST',
        'MPST',
        'WAST',
        'TST',
        'UST',
        'NAEST',
        'JST',
        'KST',
        'CAST',
        'ACST',
        'EAST',
        'AEST',
        'WPST',
        'TST',
        'YST',
        'CPST',
        'VST',
        'NZST',
        'U',
        'FST',
        'MST',
        'KDT',
        'TST',
        'SST',
      ],
    });
  }),
});

export default buildWorkspaceHandlers;
