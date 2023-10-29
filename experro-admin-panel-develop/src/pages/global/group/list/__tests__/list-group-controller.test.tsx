import { act, renderHook } from '@testing-library/react-hooks';
import { message } from 'antd';

import { wrapper } from '../../../../../test/utills';
import useListGroup from '../list-group-controller';
import { GridColumnType } from '../../../../../types';
import { waitFor } from '@testing-library/react';

const mockHistory = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useHistory: jest.fn().mockReturnValue(() => mockHistory())(),
  };
});

describe('list group controller', () => {
  it('columns', async () => {
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useListGroup(), {
      wrapper,
    });

    const groupObj = {
      groupId: '123',
      groupName: 'Group 1',
      id: '123',
      tenantId: '12345',
      userCount: '11',
    };

    expect(result.current.columns.length).toBe(2);
    // expect(result.current.columns[0].title).toBe('common.labels.groupName');
    expect(result.current.columns[0].dataIndex).toBe('name');
    expect(result.current.columns[0].key).toBe('name');

    expect(mockPush).not.toBeCalled();
    act(() => {
      // @ts-ignore
      (
        result.current.columns[0] as GridColumnType
      ).rendererProps?.menuList?.[0].onClick('123', {});
    });

    expect(result.current.group).toBeUndefined();
    expect(result.current.isModalVisible).toBeFalsy();
    act(() => {
      (
        result.current.columns[0] as GridColumnType
      ).rendererProps?.menuList?.[2]?.onClick('123', groupObj);
    });

    expect(result.current.isModalVisible).toBeFalsy();

    expect(result.current.columns[1].title).toBe('common.labels.users');
    expect(result.current.columns[1].dataIndex).toBe('users');
    expect(result.current.columns[1].key).toBe('users');
  });

  it('onAddGroupClick', async () => {
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useListGroup(), {
      wrapper,
    });

    expect(mockPush).not.toBeCalled();
    act(() => {
      result.current.onAddGroup();
    });
    expect(mockPush).toBeCalled();
    expect(mockPush).toBeCalledWith('/groups/create');
  });

  it('Delete success', async () => {
    const mockSuccessMessage = jest.fn();
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });
    message.success = mockSuccessMessage;

    const { result } = renderHook(() => useListGroup(), {
      wrapper,
    });

    act(() => {
      (
        result.current.columns[0] as GridColumnType
      ).rendererProps?.menuList?.[2]?.onClick('12', {
        id: '12',
      });
    });

    expect(result.current.isModalVisible).toBeFalsy();

    act(() => {
      result.current.onDeleteGroup();
    });
    await new Promise((r) => setTimeout(r, 100));
  });

  it('Delete with error', async () => {
    const mockErrorMessage = jest.fn();
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });
    message.error = mockErrorMessage;

    const { result } = renderHook(() => useListGroup(), {
      wrapper,
    });

    act(() => {
      (
        result.current.columns[0] as GridColumnType
      ).rendererProps?.menuList?.[2]?.onClick('123', {
        id: '123',
      });
    });

    expect(result.current.isModalVisible).toBeFalsy();

    act(() => {
      result.current.onDeleteGroup();
    });

    await waitFor(() => undefined);
  });
});
