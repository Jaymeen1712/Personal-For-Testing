import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { message } from 'antd';

import { wrapper } from '../../../../../test/utills';
import useConnect from '../create-update-user-controller';

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

describe('create-update user controller', () => {
  it('onCancel', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ userId: '123' });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useConnect(), { wrapper });
    act(() => {
      result.current.onCancel();
    });
    expect(mockPush).toBeCalled();
    expect(mockPush).toBeCalledWith('/users');
  });

  it('create with add new with validation error', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ userId: null });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useConnect(), { wrapper });
    act(() => {
      result.current.onSaveAndAddNewClick();
    });
    expect(result.current.isAddNewEnabled).toBeTruthy();

    act(() => {
      result.current.onFinishFailed();
    });
    expect(result.current.isAddNewEnabled).toBeFalsy();
  });

  it('create with add new with success', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ userId: null });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useConnect(), {
      wrapper,
    });
    act(() => {
      result.current.onSaveAndAddNewClick();
    });
    expect(result.current.isAddNewEnabled).toBeTruthy();

    act(() => {
      result.current.onFinish({
        firstName: 'John11',
        lastName: 'Smith',
        email: 'john@gmail.com',
        roles: ['4', '5'],
        groups: ['2', '3'],
      });
    });
  });

  it('create with success', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ userId: null });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useConnect(), {
      wrapper,
    });

    act(() => {
      result.current.setRoles([
        {
          title: '5',
          value: '5',
          children: [
            { title: '12', value: '11' },
            { title: '12', value: '12' },
          ],
        },
      ]);
    });

    act(() => {
      result.current.onFinish({
        firstName: 'John11',
        lastName: 'Smith',
        email: 'john@gmail.com',
        roles: ['4', '5'],
        groups: ['2', '3'],
      });
    });
  });

  it('update with success', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ userId: '12' });
    mockHistory.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() => useConnect(), {
      wrapper,
    });

    act(() => {
      result.current.setRoles([
        {
          title: '5',
          value: '5',
          children: [
            { title: '12', value: '11' },
            { title: '12', value: '12' },
          ],
        },
      ]);
    });

    await waitFor(() => {
      expect(result.current.getUser.data).toStrictEqual({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@gmail.com',
        roles: [{ id: '4' }, { id: '5' }],
        groups: [{ id: '2' }, { id: '3' }],
      });
    });

    act(() => {
      result.current.onFinish({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@gmail.com',
        roles: ['4', '5'],
        groups: ['2', '3'],
      });
    });
    await waitFor(() => undefined);
    await waitFor(() => {
      expect(mockPush).toBeCalled();
    });
    expect(mockPush).toBeCalledWith('/users');
  });

  it('create with error', async () => {
    const mockErrorMessage = jest.fn();
    mockParams.mockReturnValue({ userId: null });
    message.error = mockErrorMessage;

    const { result } = renderHook(() => useConnect(), {
      wrapper,
    });

    act(() => {
      result.current.onFinish({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@gmail.com',
        roles: ['4', '5'],
        groups: ['2', '3'],
      });
    });
    await waitFor(() => undefined);
    await waitFor(() => undefined);
  });

  it('update with invalid user id', async () => {
    const mockPush = jest.fn();
    mockParams.mockReturnValue({ userId: '1234' });
    mockHistory.mockReturnValue({ push: mockPush });

    renderHook(() => useConnect(), {
      wrapper,
    });

    // await waitForNextUpdate();

    await waitFor(() => {
      expect(mockPush).toBeCalled();
    });
    expect(mockPush).toBeCalledWith('/users');
  });
});
