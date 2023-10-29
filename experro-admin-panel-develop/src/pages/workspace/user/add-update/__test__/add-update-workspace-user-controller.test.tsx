import { renderHook, act } from '@testing-library/react-hooks';
import { message } from 'antd';
// import { fireEvent, screen } from '@testing-library/react';

import { wrapper } from '../../../../../test/utills';
import useAddUpdateWorkspaceUser from '../add-update-workspace-user-controller';
import { waitFor } from '@testing-library/react';

const mockHistory = jest.fn();
const mockParams = jest.fn();
const mockPush = jest.fn();
const onMainSidebarActiveItem = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
    useHistory: jest.fn().mockReturnValue(() => ({
      push: mockPush,
    }))(),
  };
});

describe('add-update workspace user controller', () => {
  it('onCancel', async () => {
    // const mockPush = jest.fn().mockReturnValue({ workspaceId: '123' });
    mockParams.mockReturnValue({ userId: '123', workspaceId: '123' });
    mockHistory.mockReturnValue({
      push: mockPush.mockReturnValue({
        historyPush: jest.fn(),
      }),
    });

    const { result } = renderHook(
      () => useAddUpdateWorkspaceUser({ onMainSidebarActiveItem }),
      {
        wrapper,
      }
    );

    // @ts-ignore
    // @ts-nocheck
    act(() => {
      result.current.onCancel();
    });
    expect(mockPush).toBeCalled();
    expect(mockPush).toBeCalledWith('/workspaces/123/users');
  });

  it('add workspace user with validation error', async () => {
    // const mockPush = jest.fn();
    const mockAddUser = jest.fn().mockReturnValue({ isSuccess: true });
    mockParams.mockReturnValue({ userId: null });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(
      () => useAddUpdateWorkspaceUser({ onMainSidebarActiveItem }),
      {
        wrapper,
      }
    );
    act(() => {
      result.current.onFinish({
        userIds: ['a8ae3a67-f9a5-46c3-91c4-4b53620ec6d7'],
        roles: ['99d1caf2-8164-430a-83f5-952f67a4ecf0'],
      });
      mockAddUser();
    });
    expect(mockAddUser().isSuccess).toBeTruthy();
  });

  it('add new with workspace user success', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ userId: null });
    mockHistory.mockReturnValue({ push: mockPush });
    // const permission = true;
    // const mockAddNewUser = jest.fn().mockReturnValue({
    //   push: mockPush('/users'),
    // });

    const { waitFor } = renderHook(
      () => useAddUpdateWorkspaceUser({ onMainSidebarActiveItem }),
      {
        wrapper,
      }
    );

    // act(() => {
    //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    //   result.current.workspaceUserFormItems = [
    //     {
    //       label: 'Users',
    //       name: 'userId',
    //       type: 'select',
    //       getLabel: (user) => `${user.firstName} ${user.lastName}`,
    //       valueKey: 'id',
    //       allowClear: true,
    //       required: true,
    //       params: {
    //         workspaceId: '123',
    //         fields: 'first_name,last_name',
    //       },
    //       mode: 'single',
    //       notFoundContent: permission ? (
    //         <div>
    //           <p>No User Found</p>
    //           <Button
    //             type="link"
    //             className="text-blue"
    //             onClick={mockAddNewUser}>
    //             Add new user
    //           </Button>
    //         </div>
    //       ) : (
    //         <div>No User Found</div>
    //       ),
    //       rules: [
    //         {
    //           required: true,
    //           message: 'Users are required',
    //         },
    //       ],
    //     },
    //     {
    //       label: 'Roles',
    //       name: 'roles',
    //       type: 'select',
    //       rules: [
    //         {
    //           required: true,
    //           message: 'Roles are required',
    //         },
    //       ],
    //     },
    //   ];
    // });

    await waitFor(() => undefined);

    // @ts-ignore
    // renderWithClient(result.current.workspaceUserFormItems[0].notFoundContent);

    // await waitForNextUpdate();

    // const text = screen.getByText('No User Found');

    // const buttonElement = screen.getAllByRole('link');
    // console.log('Button Render', buttonElement);

    // expect(result.current.isAddNewEnabled).toBeFalsy();
  });

  it('add with success', async () => {
    // const mockPush = jest.fn();
    mockParams.mockReturnValue({ userId: '123', workspaceId: '123' });
    mockHistory.mockReturnValue({ push: mockPush('/workspaces/123/users') });

    const { result, waitFor } = renderHook(
      () => useAddUpdateWorkspaceUser({ onMainSidebarActiveItem }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFinish({
        userIds: ['a8ae3a67-f9a5-46c3-91c4-4b53620ec6d7'],
        roles: ['99d1caf2-8164-430a-83f5-952f67a4ecf0'],
      });
    });
    await waitFor(() => undefined);

    expect(mockPush).toBeCalled();
    expect(mockPush).toBeCalledWith('/workspaces/123/users');
  });

  it('update with success', async () => {
    // const mockPush = jest.fn();
    mockParams.mockReturnValue({ workspaceId: '123', userId: '123' });
    mockHistory.mockReturnValue({ push: mockPush('/workspaces/123/users') });

    const { result } = renderHook(
      () => useAddUpdateWorkspaceUser({ onMainSidebarActiveItem }),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.getUser.data).toStrictEqual({
        createdAt: '2022-08-17T11:00:44.032Z',
        email: 'hk@gmail.com',
        firstName: 'HKHJK',
        groups: [],
        id: '589818e0-bc2b-4e5c-a30f-90ce2359bfa9',
        isMfaEnable: false,
        languageId: null,
        lastName: 'LKHJ',
        roles: ['52cab1d2-15c7-45e0-868e-fb421cf72ed3'],
        status: 'invited',
        timezone: null,
      });
    });

    // @ts-ignore
    act(() => {
      result.current.onFinish({
        userIds: ['a8ae3a67-f9a5-46c3-91c4-4b53620ec6d7'],
        roles: ['99d1caf2-8164-430a-83f5-952f6tas5567'],
      });
    });
    await waitFor(() => {
      // await waitForNextUpdate();
      expect(mockPush).toBeCalled();
    });
    expect(mockPush).toBeCalledWith('/workspaces/123/users');
  });

  it('add with error', async () => {
    const mockErrorMessage = jest.fn();
    mockParams.mockReturnValue({ workspaceId: '123' });
    message.error = mockErrorMessage;

    const { result } = renderHook(
      () => useAddUpdateWorkspaceUser({ onMainSidebarActiveItem }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFinish({
        userIds: ['a8ae3a67-f9a5-46c3-91c4-4b53620ec6d7'],
        roles: ['99d1caf2-8164-430a-83f5-952f6tas5567'],
      });
    });
    await waitFor(() => undefined);
  });

  it('update with error', async () => {
    const mockErrorMessage = jest.fn();
    mockParams.mockReturnValue({ userId: '123' });
    message.error = mockErrorMessage;

    const { result } = renderHook(
      () => useAddUpdateWorkspaceUser({ onMainSidebarActiveItem }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFinish({
        userIds: ['a8ae3a67-f9a5-46c3-91c4-4b53620ec6d7'],
        roles: ['99d1caf2-8164-430a-83f5-952f6tas5567'],
      });
    });
    await waitFor(() => undefined);
  });

  it('update with invalid user id', async () => {
    // const mockPush = jest.fn();
    mockParams.mockReset();
    mockParams.mockReturnValue({ userId: '12345', workspaceId: '12345' });
    mockHistory.mockReturnValue({ push: mockPush });

    renderHook(() => useAddUpdateWorkspaceUser({ onMainSidebarActiveItem }), {
      wrapper,
    });

    // await waitForValueToChange(() => result.current.getUser.isSuccess);
    await waitFor(() => undefined);
    await waitFor(() => {
      expect(mockPush).toBeCalled();
    });
    expect(mockPush.mock.calls).toEqual([
      ['/workspaces/12345/users'],
      ['/workspaces/12345/users'],
    ]);
  });
});
