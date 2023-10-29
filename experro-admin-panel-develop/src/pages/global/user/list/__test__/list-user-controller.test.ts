import { act, renderHook } from '@testing-library/react-hooks';
import { message } from 'antd';

import { wrapper } from '../../../../../test/utills';
import useConnect from '../list-user-controller';
import { GridColumnType, RowRecord } from '../../../../../types';

const mockHistory = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useHistory: jest.fn().mockReturnValue(() => mockHistory())(),
  };
});

describe('create-update user controller', () => {
  it('columns', async () => {
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useConnect(), {
      wrapper,
    });

    const userObj: RowRecord = {
      id: '123',
      firstName: 'John',
      email: 'john@gmail.com',
      status: 'active',
      // @ts-ignore
      workspaces: [
        {
          id: '111',
          name: 'workspace1',
          storeLink: 'https://demo.experro.com/workspace1',
        },
        {
          id: '112',
          name: 'workspace2',
          storeLink: 'https://demo.experro.com/workspace2',
        },
      ],
    };

    expect(result.current.columns.length).toBe(6);
    // expect(result.current.columns[0].title).toBe('common.labels.name');
    expect(result.current.columns[0].dataIndex).toBe('name');
    expect(result.current.columns[0].key).toBe('name');

    expect(mockPush).not.toBeCalled();
    act(() => {
      // @ts-ignore
      (
        result.current.columns[0] as GridColumnType
      ).rendererProps?.menuList?.[0].onClick('123', {});
    });

    expect(result.current.user).toBeUndefined();
    expect(result.current.isDeleteModalVisible).toBeFalsy();
    act(() => {
      (
        result.current.columns[0] as GridColumnType
      ).rendererProps?.menuList?.[2]?.onClick('123', userObj);
    });

    expect(result.current.isDeleteModalVisible).toBeFalsy();

    // expect(result.current.columns[1]).toStrictEqual({
    //   title: 'common.labels.email',
    //   dataIndex: 'email',
    //   key: 'email',
    //   width: '20%',
    // });

    expect(result.current.columns[2].title).toBe('common.labels.workspace');
    expect(result.current.columns[2].dataIndex).toBe('workspaces');
    expect(result.current.columns[2].key).toBe('workspace');

    expect(result.current.columns[3].title).toBe('common.labels.roles');
    expect(result.current.columns[3].dataIndex).toBe('rolesCount');
    expect(result.current.columns[3].key).toBe('roles');

    expect(result.current.columns[4].title).toBe('common.labels.groups');
    expect(result.current.columns[4].dataIndex).toBe('groupsCount');
    expect(result.current.columns[4].key).toBe('groups');

    // expect(result.current.columns[5].title).toBe('common.labels.status');
    expect(result.current.columns[5].dataIndex).toBe('status');
    expect(result.current.columns[5].key).toBe('status');

    // expect(
    //   // @ts-ignore
    //   (result.current.columns[3] as GridColumnType).rendererProps?.getColor({
    //     ...userObj,
    //     status: 'inactive',
    //   })
    // ).toBe('default');
  });

  it('onAddUserClick', async () => {
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useConnect(), {
      wrapper,
    });

    expect(mockPush).not.toBeCalled();
    act(() => {
      result.current.onAddUserClick();
    });
    expect(mockPush).toBeCalled();
    expect(mockPush).toBeCalledWith('/users/create');
  });

  it('Delete success', async () => {
    const mockSuccessMessage = jest.fn();
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });
    message.success = mockSuccessMessage;

    const { result } = renderHook(() => useConnect(), {
      wrapper,
    });

    act(() => {
      (
        result.current.columns[0] as GridColumnType
      ).rendererProps?.menuList?.[2]?.onClick('12', {
        id: '12',
      });
    });
    expect(result.current.isDeleteModalVisible).toBeFalsy();

    act(() => {
      result.current.onDeleteModalSubmit();
    });
  });

  it('Delete with error', async () => {
    const mockErrorMessage = jest.fn();
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });
    message.error = mockErrorMessage;

    const { result } = renderHook(() => useConnect(), {
      wrapper,
    });

    act(() => {
      (
        result.current.columns[0] as GridColumnType
      ).rendererProps?.menuList?.[2]?.onClick('123', {
        id: '123',
      });
    });
    expect(result.current.isDeleteModalVisible).toBeFalsy();

    act(() => {
      result.current.onDeleteModalSubmit();
    });
  });
});
