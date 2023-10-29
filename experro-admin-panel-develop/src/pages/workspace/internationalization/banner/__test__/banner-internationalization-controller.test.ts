import { act, renderHook } from '@testing-library/react-hooks';
import { wrapper } from '../../../../../test/utills';

import useBannerInternationalization from '../banner-internationalization-controller';
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

describe('internationalization list-rules-banner to internationalization travel', () => {
  it('component render properly', async () => {
    mockParams.mockReturnValue({ workspaceId: '123' });
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });
    const { result } = renderHook(() => useBannerInternationalization(), {
      wrapper,
    });
    act(() => {
      result.current.onAddLanguage();
    });

    expect(mockPush).toBeCalled();
    expect(mockPush).toBeCalledWith('/workspaces/123/internationalization');
  });
});
