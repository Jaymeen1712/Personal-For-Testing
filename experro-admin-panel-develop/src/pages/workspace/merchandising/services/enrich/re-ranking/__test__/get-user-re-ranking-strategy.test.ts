import { renderHook } from '@testing-library/react-hooks';
import { wrapper } from '../../../../../../../test/utills';
import apiClient from '../../../../../../../apis/api-client';
import useUserReRankingStrategy from '../get/get-user-re-ranking-strategy';
import { waitFor } from '@testing-library/react';

const mockApiResolvedValue = {
  response: {
    Data:  {properties: 'properties', strategy: 'strategy'},
  },
};

const mockApiRejectedValue = {
  error: {
    message:'error message',
  },
};
jest.mock('../../../../../../../apis/api-client');

describe('get-user-re-ranking-strategy', () => {

  it('Given parameter When api success Then return api data', async () => {
    // @ts-ignore
    apiClient.get = jest.fn().mockResolvedValue(mockApiResolvedValue);
    const { result } = renderHook(() => useUserReRankingStrategy('workspaceId', 'environmentId'), {
      wrapper,
    });
    expect(result.current.isLoading).toEqual(true)
    await waitFor(() =>
      expect(result.current.isLoading).toEqual(false)
    );
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toStrictEqual(mockApiResolvedValue.response.Data)
  });

  it('Given parameter When api failure Then return api error', async () => {
    // @ts-ignore
    apiClient.get = jest.fn().mockRejectedValue(mockApiRejectedValue);
    const { result } = renderHook(() => useUserReRankingStrategy('workspaceId', 'environmentId'), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(true)
    await waitFor(() =>
      expect(result.current.isLoading).toBe(false)
    );
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockApiRejectedValue)
  });
});
