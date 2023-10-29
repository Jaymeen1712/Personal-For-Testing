import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { message } from 'antd';

import { wrapper } from '../../../../../test/utills';
import useCreateUpdateGroup from '../create-update-group-controller';

const mockHistory = jest.fn();
const mockParams = jest.fn();
const mockLocation = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
    useHistory: jest.fn().mockReturnValue(() => mockHistory())(),
    useLocation: () => jest.fn().mockReturnValue(() => mockLocation())(),
  };
});

describe('create-update group controller', () => {
  it('onCancel', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({
      groupId: '16f7d6df-ce2a-4bdd-9ff7-7ab95a7d5ae7',
    });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useCreateUpdateGroup(), { wrapper });
    act(() => {
      result.current.onCancel();
    });
    expect(mockPush).toBeCalled();
    expect(mockPush).toBeCalledWith('/groups');
  });

  it('create with add new with success', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ groupId: null });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useCreateUpdateGroup(), {
      wrapper,
    });

    act(() => {
      result.current.onFinish({
        name: 'Group 1',
        description: 'Kem Cho Majama ?',
        roleIds: [
          '8efd08d7-591e-4c39-be19-1c4dc440e9a3',
          'ff1b14ec-f26c-4e73-9c9b-38ebec3383b9',
        ],
        userIds: [
          '9646c3ca-816b-41cd-8dc7-b9ed4c53b19c',
          '98d9d0b4-c35e-4461-b34e-5f05489cdc6b',
        ],
      });
    });
  });

  it('create  with success', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ groupId: null });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useCreateUpdateGroup(), {
      wrapper,
    });

    // act(() => {
    //   result.current.setRoles([
    //     {
    //       title: '5',
    //       value: '5',
    //       children: [
    //         { title: '12', value: '11' },
    //         { title: '12', value: '12' },
    //       ],
    //     },
    //   ]);
    // });

    act(() => {
      result.current.onFinish({
        name: 'Group 1',
        description: 'Kem Cho Majama ?',
        roleIds: [
          '8efd08d7-591e-4c39-be19-1c4dc440e9a3',
          'ff1b14ec-f26c-4e73-9c9b-38ebec3383b9',
        ],
        userIds: [
          '9646c3ca-816b-41cd-8dc7-b9ed4c53b19c',
          '98d9d0b4-c35e-4461-b34e-5f05489cdc6b',
        ],
      });
    });
  });

  it('update with success', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ groupId: '12' });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useCreateUpdateGroup(), {
      wrapper,
    });

    // act(() => {
    //   result.current.setRoles([
    //     {
    //       title: '5',
    //       value: '5',
    //       children: [
    //         { title: '12', value: '11' },
    //         { title: '12', value: '12' },
    //       ],
    //     },
    //   ]);
    // });

    await waitFor(() => {
      expect(result.current.detailsGroup.data).toStrictEqual({
        description: 'Hello ?',
        groupId: '12',
        name: 'Hello World',
        roles: [
          '8efd08d7-591e-4c39-be19-1c4dc440e9a3',
          'ff1b14ec-f26c-4e73-9c9b-38ebec3383b9',
        ],
        roleIds: [
          '8efd08d7-591e-4c39-be19-1c4dc440e9a3',
          'ff1b14ec-f26c-4e73-9c9b-38ebec3383b9',
        ],
        users: [
          '9646c3ca-816b-41cd-8dc7-b9ed4c53b19c',
          '98d9d0b4-c35e-4461-b34e-5f05489cdc6b',
        ],
        userIds: [
          '9646c3ca-816b-41cd-8dc7-b9ed4c53b19c',
          '98d9d0b4-c35e-4461-b34e-5f05489cdc6b',
        ],
      });
    });

    act(() => {
      result.current.onFinish({
        name: 'Hello World',
        description: 'Kem Cho Majama ?',
        roleIds: [
          '8efd08d7-591e-4c39-be19-1c4dc440e9a3',
          'ff1b14ec-f26c-4e73-9c9b-38ebec3383b9',
        ],
        userIds: [
          '9646c3ca-816b-41cd-8dc7-b9ed4c53b19c',
          '98d9d0b4-c35e-4461-b34e-5f05489cdc6b',
        ],
      });
    });
  });

  it('create with error', async () => {
    const mockErrorMessage = jest.fn();
    mockParams.mockReturnValue({ groupId: null });
    message.error = mockErrorMessage;

    const { result } = renderHook(() => useCreateUpdateGroup(), {
      wrapper,
    });

    act(() => {
      result.current.onFinish({
        name: 'Hello World',
        description: 'Kem Cho Majama ?',
        roleIds: ['4', '5'],
        userIds: ['11', '12'],
      });
    });
    await waitFor(() => undefined);
  });

  it('Update with Error', async () => {
    const mockErrorMessage = jest.fn();
    mockParams.mockReturnValue({ groupId: '123' });
    message.error = mockErrorMessage;

    const { result } = renderHook(() => useCreateUpdateGroup(), {
      wrapper,
    });

    act(() => {
      result.current.onFinish({
        name: 'Hello World',
        description: 'Kem Cho Majama ?',
        roleIds: [
          '8efd08d7-591e-4c39-be19-1c4dc440e9a3',
          'ff1b14ec-f26c-4e73-9c9b-38ebec3383b9',
        ],
        userIds: [
          '9646c3ca-816b-41cd-8dc7-b9ed4c53b19c',
          '98d9d0b4-c35e-4461-b34e-5f05489cdc6b',
        ],
      });
    });
    await waitFor(() => undefined);
  });
});
