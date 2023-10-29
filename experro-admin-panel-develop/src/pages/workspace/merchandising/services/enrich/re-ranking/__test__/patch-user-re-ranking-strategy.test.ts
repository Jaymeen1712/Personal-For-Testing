import { act, renderHook } from '@testing-library/react-hooks';
import { wrapper } from '../../../../../../../test/utills';
import apiClient from '../../../../../../../apis/api-client';
import useUpdateUserReRankingStrategy from '../save/patch-user-re-ranking-strategy';

const mockApiResolvedValue = {
  response: {
    Data: {
      message: 'message',
    },
  },
};

const mockApiRejectedValue = {
  error: {
    message: 'error message',
  },
};
jest.mock('../../../../../../../apis/api-client');
jest.mock('../../../../../../../utills/convert-request-response', () => {
  return jest.fn();
});

describe('patch-user-re-ranking-strategy', () => {

  it('Given parameter When api success Then return api data', async () => {
    // @ts-ignore
    apiClient.patch = jest.fn().mockResolvedValue(mockApiResolvedValue);
    const { result } = renderHook(() => useUpdateUserReRankingStrategy('workspaceId', 'environmentId'), {
      wrapper,
    });
    expect(result.current.isIdle).toBe(true);
    act(() => {
      result.current.mutate({
        strategy: 'strategy',
        properties: null,
      });
    });
  });

  it('Given parameter When api failure Then return api error', async () => {
    // @ts-ignore
    apiClient.patch = jest.fn().mockRejectedValue(mockApiRejectedValue);
    const { result } = renderHook(() => useUpdateUserReRankingStrategy('workspaceId', 'environmentId'), {
      wrapper,
    });
    expect(result.current.isIdle).toBe(true);
    act(() => {
      result.current.mutate({
        strategy: 'strategy',
        properties: null,
      });
    });
  });
});
