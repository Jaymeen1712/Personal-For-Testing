import { context, response } from 'msw';

export const buildSuccessResponse = (data?: unknown) => {
  return response(
    context.json({
      Data: data,
      status: 'success',
    }),
    context.delay()
  );
};

export const buildErrorResponse = (error?: unknown) => {
  return response(
    context.status(400),
    context.json({
      status: 'failure',
      error,
    }),
    context.delay()
  );
};
