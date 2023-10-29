import { act, renderHook } from '@testing-library/react-hooks';
import { wrapper } from '../../../../../test/utills';

import useForgotPasswordEmailController from '../forgot-password-email-controller';

const mockHistory = jest.fn();
const mockParams = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useHistory: jest.fn().mockReturnValue(() => mockHistory())(),
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
  };
});

describe('forgot password to forgot password email', () => {
  it('render properly', () => {
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useForgotPasswordEmailController(), {
      wrapper,
    });

    act(() => {
      result.current.redirectToLogin();
    });

    expect(mockPush).toBeCalled();
    expect(mockPush).toBeCalledWith('/login');
  });
});
