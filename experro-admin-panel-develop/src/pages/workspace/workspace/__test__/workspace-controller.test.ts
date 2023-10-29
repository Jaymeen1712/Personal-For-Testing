import { renderHook, act } from '@testing-library/react-hooks';
import { wrapper } from '../../../../test/utills';
import useWorkspaceController from '../workspace-controller';
import { message } from 'antd';
import { waitFor } from '@testing-library/react';

const mockHistory = jest.fn();
const mockParams = jest.fn();
const onMainSidebarActiveItem = jest.fn();
const mockSetFields = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
    useHistory: jest.fn().mockReturnValue(() => mockHistory())(),
  };
});

jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');

  return {
    __esModule: true,
    ...originalModule,
    Form: {
      useForm: () => [{ setFields: mockSetFields }],
    },
  };
});

describe('useWorkspaceController', () => {
  it('update successfully', async () => {
    const mockErrorMessage = jest.fn();
    mockParams.mockReturnValue({ workspaceId: '765' });
    message.error = mockErrorMessage;

    const { result } = renderHook(
      () => useWorkspaceController({ onMainSidebarActiveItem }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFinish({
        description: 'Testing workspace 1',
        id: '123',
        name: 'Workspace 1',
        storeLink: 'https://store1.experro.com',
        timezone: 'UTC',
      });
    });
    await waitFor(() =>
      expect(result.current.updateWorkspace.isSuccess).toBeTruthy()
    );
  });
  it('update with error', async () => {
    const mockErrorMessage = jest.fn();
    mockParams.mockReturnValue({ workspaceId: '123' });
    message.error = mockErrorMessage;

    const { result } = renderHook(
      () => useWorkspaceController({ onMainSidebarActiveItem }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFinish({
        description: 'Testing workspace 1',
        id: '123',
        name: 'Workspace 1',
        storeLink: 'https://store1.experro.com',
        timezone: 'UTC',
      });
    });
    await waitFor(() =>
      expect(result.current.updateWorkspace.isError).toBeFalsy()
    );
  });
  it('should be invoked properly', async () => {
    mockParams.mockReturnValue({ workspaceId: '123' });
    const { result } = renderHook(
      () => useWorkspaceController({ onMainSidebarActiveItem }),
      { wrapper }
    );
    expect(result.current.isButtonDisable).toBeTruthy();
    expect(result.current.isModalVisible).toBeFalsy();
    act(() => {
      result.current.onFieldChange();
    });
    expect(result.current.isButtonDisable).toBeFalsy();
    act(() => {
      result.current.OnDeleteWorkspace();
    });
    expect(result.current.isModalVisible).toBeTruthy();
    act(() => {
      result.current.hideModal();
    });
    expect(result.current.isModalVisible).toBeFalsy();
  });

  it('should throw validation error', () => {
    mockParams.mockReturnValue({ workspaceId: '123' });
    const { result } = renderHook(
      () => useWorkspaceController({ onMainSidebarActiveItem }),
      { wrapper }
    );
    act(() => {
      result.current.onFinish({
        description: 'Testing workspace 1',
        name: 'w',
      });
    });
    expect(mockSetFields).toHaveBeenCalledTimes(1);
    act(() => {
      result.current.onFinish({
        description: ' ',
        name: 'workspace 1',
      });
    });
    expect(mockSetFields).toHaveBeenCalledTimes(2);
    act(() => {
      result.current.onFinish({
        description: 'Test',
        name: '',
      });
    });
    expect(mockSetFields).toHaveBeenCalledTimes(3);
    act(() => {
      result.current.onFinish({
        description: 'Test*',
        name: 'Test',
      });
    });
    expect(mockSetFields).toHaveBeenCalledTimes(4);
    act(() => {
      result.current.onFinish({
        description:
          'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest',
        name: 'Test',
      });
    });
    expect(mockSetFields).toHaveBeenCalledTimes(5);
    act(() => {
      result.current.onFinish({
        description: 'Test',
        name: 'Test*',
      });
    });
    expect(mockSetFields).toHaveBeenCalledTimes(6);
    act(() => {
      result.current.onFinish({
        description: 'Test',
        name: 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest',
      });
    });
    expect(mockSetFields).toHaveBeenCalledTimes(7);
  });
  it('should render without calling onMainSidebarActiveItem', () => {
    mockParams.mockReturnValue({ workspaceId: '123' });
    renderHook(() => useWorkspaceController({}), {
      wrapper,
    });
    expect(onMainSidebarActiveItem).not.toHaveBeenCalled();
  });
});
