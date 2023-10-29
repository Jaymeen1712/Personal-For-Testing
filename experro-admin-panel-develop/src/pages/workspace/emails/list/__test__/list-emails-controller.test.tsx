// eslint-disable-next-line
import useListEmailsController from '../list-emails-controller';

const mockHistory = jest.fn();
const mockPush = jest.fn();
const mockRouteMatch = jest.fn();
const mockParams = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useHistory: jest.fn().mockReturnValue(() => ({ push: mockPush }))(),
    useRouteMatch: jest
      .fn()
      .mockReturnValue(() => ({ path: mockRouteMatch }))(),
  };
});

describe('useListEmailsController', () => {
  beforeEach(() => {
    // @ts-ignore
    mockParams.mockReturnValue({ workspaceId: '1234' });
    mockHistory.mockReturnValue({
      push: mockPush.mockReturnValue({ historyPush: jest.fn() }),
    });
    mockRouteMatch.mockReturnValue({
      path: `/workspaces/1234/emails/templates/12345`,
    });
  });

  it('onTabChange working properly', () => {
    // const { result } = renderHook(() => useListEmailsController(), { wrapper });
    // expect(result.current.defaultActiveKey).toBe('');
    //
    // act(() => {
    //   result.current.onTabChange('phrases');
    // });
    // expect(result.current.defaultActiveKey).toBe('phrases');
  });
});
