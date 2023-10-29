// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { initServer } from './test/server';
import { useTranslation } from 'react-i18next';

const server = initServer();
jest.mock('react-i18next');
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    };
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
beforeEach(() => {
  // @ts-ignore
  useTranslation.mockImplementation(() => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () =>
          new Promise(() => {
            console.log('change Language');
          }),
      },
    };
  });
});
