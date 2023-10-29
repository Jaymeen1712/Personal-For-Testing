import { renderHook } from '@testing-library/react-hooks';
import { wrapper } from '../../../../test/utills';
import useEmailsController from '../emails-controller';

const mockRouteMatch = jest.fn();
const mockOnMainSidebarActiveItem = jest.fn();
const mockParams = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useRouteMatch: jest.fn().mockReturnValue(() => mockRouteMatch())(),
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
  };
});

describe('useEmailsController', () => {
  beforeEach(() => {
    mockRouteMatch.mockReturnValue({
      path: '/',
    });
    mockParams.mockReturnValue({ wokspaceId: '123' });
  });

  it('working properly without onMainSidebarActiveItem', () => {
    renderHook(() => useEmailsController({}), {
      wrapper,
    });

    expect(mockOnMainSidebarActiveItem).not.toBeCalled();
  });

  it('working properly with onMainSidebarActiveItem', () => {
    renderHook(
      () =>
        useEmailsController({
          onMainSidebarActiveItem: mockOnMainSidebarActiveItem,
        }),
      {
        wrapper,
      }
    );

    expect(mockOnMainSidebarActiveItem).toBeCalled();
  });
});
