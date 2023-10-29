import { renderHook, act } from '@testing-library/react-hooks';

import { wrapper } from '../../../../../test/utills';
import useConnect from '../add-language-controller';

const mockHistory = jest.fn();
const mockParams = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
    useHistory: jest.fn().mockReturnValue(() => mockHistory())(),
  };
});

describe('Add internationalization add UseConnect', () => {
  it('add with add new with success', () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ workspaceId: '123' });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useConnect(), {
      wrapper,
    });

    act(() => {
      result.current.onFinish({
        language: 'ed9db0af-f653-4856-82c9-97acc43fa949',
      });
    });
  });
});
