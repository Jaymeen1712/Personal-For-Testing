import { renderHook } from '@testing-library/react-hooks';
import useReRankingController from '../re-ranking-controller';
import { wrapper } from '../../../../../../test/utills';
import { act } from '@testing-library/react';
import {
  useCostPriceAvailability,
  useUpdateUserReRankingStrategy,
  useUserReRankingStrategy,
} from '../../../services';
import { openNotificationWithIcon } from '../../../../../../utills';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const mockCostFieldsRefetch = jest.fn();
const mockGetUserStrategyRefetch = jest.fn();
const mockMutate = jest.fn();
const mockParams = { workspaceId: 'workspaceId' };
const mockHistoryPush = jest.fn();
const mockUseUserStrategySuccess = {
  strategy: 'default',
  properties: null,
};
const mockFailure = {
  response: {
    Error: {
      errorCode: 'errorCode',
      message: 'Something went wrong',
    },
  },
};
const mockUseUserStrategy: {
  isSuccess: boolean;
  isError: boolean;
  data: {
    strategy: string;
    properties: null;
  } | null;
  error: {
    response: {
      Error: {
        errorCode: string;
        message: string;
      };
    };
  } | null;
  refetch: () => void;
} = {
  isSuccess: false,
  isError: false,
  data: null,
  error: null,
  refetch: mockGetUserStrategyRefetch,
};
const mockUseUpdateUserStrategy: {
  isSuccess: boolean;
  isError: boolean;
  data: null;
  error: {
    response: {
      Error: {
        errorCode: string;
        message: string;
      };
    };
  } | null;
  // eslint-disable-next-line
  mutate: (value: any) => void;
} = {
  isSuccess: false,
  isError: false,
  data: null,
  error: null,
  mutate: mockMutate,
};

const mockUseCostPriceAvailability = {
  isSuccess: false,
  isError: false,
  data: {
    isRevenueEfi: true,
    isConversionRateEfi: true,
    isProfitPercentageEfi: true,
  },
  error: null,
  refetch: mockCostFieldsRefetch,
};
const mockOpenNotificationWithIcon = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn(),
    useHistory: jest.fn(),
  };
});
jest.mock('../../../services', () => ({
  useUserReRankingStrategy: jest.fn(),
  useUpdateUserReRankingStrategy: jest.fn(),
  useCostPriceAvailability: jest.fn(),
}));
jest.mock('../../../../../../utills', () => ({
  openNotificationWithIcon: jest.fn(),
}));
jest.mock('antd/lib/radio/interface');

describe('re-ranking-controller', () => {
  beforeAll(() => {
    jest.spyOn(localStorage, 'getItem');
    localStorage.getItem = jest.fn().mockReturnValue('environmentId');
  });
  beforeEach(() => {
    // @ts-ignore
    useTranslation.mockReturnValue({ t: (name: string) => name });
    // @ts-ignore
    useHistory.mockReturnValue({ push: mockHistoryPush });
    // @ts-ignore
    useParams.mockReturnValue(mockParams);
    // @ts-ignore
    useUserReRankingStrategy.mockReturnValue(mockUseUserStrategy);
    // @ts-ignore
    useUpdateUserReRankingStrategy.mockReturnValue(mockUseUpdateUserStrategy);
    // @ts-ignore
    useCostPriceAvailability.mockReturnValue(mockUseCostPriceAvailability);
    // @ts-ignore
    openNotificationWithIcon.mockReturnValue(mockOpenNotificationWithIcon);
  });

  it('Given When get strategy api success Then select strategy from api', async () => {
    mockUseUserStrategy.isSuccess = true;
    mockUseUserStrategy.data = mockUseUserStrategySuccess;
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    await waitFor(() => undefined);
    expect(result.current.newSelectedStrategy).toStrictEqual({
      strategy: 'default',
      properties: null,
    });
    expect(result.current.isStoreFound).toBe(true);
    expect(result.current.isSavedAction).toBe(false);
    expect(result.current.isActionEnabled).toBe(false);
  });
  it('Given When get strategy api fail Then show error', async () => {
    mockUseUserStrategy.data = null;
    mockUseUserStrategy.error = mockFailure;
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    await waitFor(() => undefined);
    expect(result.current.newSelectedStrategy).toStrictEqual({
      strategy: '',
      properties: null,
    });
  });

  it('Given When get strategy api fail with error no selected strategy Then select default', async () => {
    mockUseUserStrategy.isError = true;
    mockFailure.response.Error.errorCode = 'EX-00213';
    mockUseUserStrategy.data = null;
    mockUseUserStrategy.error = mockFailure;
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    await waitFor(() => undefined);
    expect(result.current.newSelectedStrategy).toStrictEqual({
      strategy: 'default',
      properties: null,
    });
  });

  it('Given When get strategy api fail with no store found error Then set no store found', async () => {
    mockUseUserStrategy.isError = true;
    mockFailure.response.Error.errorCode = 'EX-00047';
    mockUseUserStrategy.data = null;
    mockUseUserStrategy.error = mockFailure;
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    await waitFor(() => undefined);
    expect(result.current.isStoreFound).toBe(false);
  });

  it('Given When get strategy api fail with unknown error Then show unknown error msg', async () => {
    mockUseUserStrategy.isError = true;
    mockFailure.response.Error.errorCode = 'EX-00000';
    mockUseUserStrategy.data = null;
    mockUseUserStrategy.error = mockFailure;
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    await waitFor(() => undefined);
    expect(result.current.isUnknownError).toBe(true);
    expect(openNotificationWithIcon).toBeCalledWith(
      'error',
      'common.messages.unknown_error'
    );
  });

  it('Given When update strategy api success with error no selected strategy Then show strategy updated', async () => {
    mockUseUpdateUserStrategy.isSuccess = true;
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    await waitFor(() => undefined);
    expect(result.current.isActionEnabled).toBe(false);
    expect(openNotificationWithIcon).toBeCalledWith(
      'success',
      'common.messages.updated_successfully'
    );
    expect(mockGetUserStrategyRefetch).toBeCalled();
  });

  it('Given When update strategy api fail with error no selected strategy Then show strategy not selected', async () => {
    mockUseUpdateUserStrategy.isError = true;
    mockFailure.response.Error.errorCode = 'EX-00213';
    mockUseUpdateUserStrategy.data = null;
    mockUseUpdateUserStrategy.error = mockFailure;
    const { waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    await waitFor(() => undefined);
    expect(openNotificationWithIcon).toBeCalledWith(
      'error',
      'common.messages.re_ranking_algo_not_found'
    );
  });

  it('Given When update strategy api fail with unknown error Then show unknown error msg', async () => {
    mockUseUpdateUserStrategy.isError = true;
    mockFailure.response.Error.errorCode = 'EX-00000';
    mockUseUpdateUserStrategy.data = null;
    mockUseUpdateUserStrategy.error = mockFailure;
    const { waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    await waitFor(() => undefined);
    expect(openNotificationWithIcon).toBeCalledWith(
      'error',
      'common.messages.unknown_error'
    );
  });

  it('Given When onStrategySelectionChange call Then change strategy', async () => {
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    await waitFor(() => undefined);
    act(() => {
      // @ts-ignore
      result.current.onStrategySelectionChange({
        target: { checked: true, value: 'revenue' },
      });
    });
    expect(result.current.newSelectedStrategy).toStrictEqual({
      strategy: 'revenue',
      properties: null,
    });
    expect(result.current.isActionEnabled).toBe(true);
  });
  it('Given When onSave call with custom strategy Then set action to save', async () => {
    mockUseUserStrategy.data = {
      strategy: 'custom',
      properties: null,
    };
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    act(() => {
      result.current.onSaveStrategy();
    });
    await waitFor(() => undefined);
    expect(result.current.isSavedAction).toBe(true);
  });
  it('Given When onSave call with other strategy Then call update strategy api', async () => {
    mockUseUserStrategy.data = {
      strategy: 'default',
      properties: null,
    };
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    act(() => {
      result.current.onSaveStrategy();
    });
    await waitFor(() => undefined);
    expect(mockMutate).toBeCalled();
  });
  it('Given When onCancel Then reset to previous saved strategy', async () => {
    mockUseUserStrategy.data = {
      strategy: 'default',
      properties: null,
    };
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    act(() => {
      // @ts-ignore
      result.current.onStrategySelectionChange({
        target: { checked: true, value: 'revenue' },
      });
      result.current.onCancel();
    });
    await waitFor(() => undefined);
    expect(result.current.newSelectedStrategy).toStrictEqual({
      strategy: 'default',
      properties: null,
    });
  });

  it('Given When updateSavedAction with false Then saved action false', async () => {
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    act(() => {
      // @ts-ignore
      result.current.updateSavedAction(false);
    });
    await waitFor(() => undefined);
    expect(result.current.isSavedAction).toBe(false);
  });

  it('Given When updateActionEnabled with true Then action enabled true', async () => {
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    act(() => {
      // @ts-ignore
      result.current.updateActionEnabled(true);
    });
    await waitFor(() => undefined);
    expect(result.current.isActionEnabled).toBe(true);
  });

  it('Given When onAddStore Then push big-commerce url', async () => {
    const { result, waitFor } = renderHook(() => useReRankingController(), {
      wrapper,
    });
    act(() => {
      // @ts-ignore
      result.current.onAddStore();
    });
    await waitFor(() => undefined);
    expect(mockHistoryPush).toBeCalledWith('/workspaces/workspaceId/platforms');
  });
});
