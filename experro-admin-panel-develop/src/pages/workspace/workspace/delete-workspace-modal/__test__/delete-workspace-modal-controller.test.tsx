import { renderHook, act } from '@testing-library/react-hooks';
import { message } from 'antd';
import useDeleteWorkspaceModalController from '../delete-workspace-modal-controller';
import { wrapper } from '../../../../../test/utills';

const mockHistory = jest.fn();
const mockParams = jest.fn();
const mockValidateFields = jest.fn();

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
      useForm: () => [{ validateFields: mockValidateFields }],
    },
  };
});

describe('useWorkspaceController', () => {
  it('Delete success', async () => {
    const mockSuccessMessage = jest.fn();
    mockParams.mockReturnValue({ workspaceId: '12' });
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });
    mockValidateFields.mockReturnValue({ name: 'workspace1' });
    message.success = mockSuccessMessage;

    const { result } = renderHook(
      () =>
        useDeleteWorkspaceModalController({ id: '123', name: 'workspace1' }),
      {
        wrapper,
      }
    );
    expect(result.current.isButtonDisable).toBeTruthy();
    act(() =>
      result.current.onFieldChange([
        {
          value: 'workspa',
        },
      ])
    );
    expect(result.current.isButtonDisable).toBeTruthy();
    act(() =>
      result.current.onFieldChange([
        {
          value: 'workspace1',
        },
      ])
    );
    expect(result.current.isButtonDisable).toBeFalsy();

    act(() => {
      result.current.onSave();
    });

    await new Promise((r) => setTimeout(r, 500));
    expect(mockValidateFields).toBeCalled();

    expect(mockPush).toBeCalled();
    expect(mockPush).toBeCalledWith('/workspaces');
  });

  it('Delete Error', async () => {
    const mockErrorMessage = jest.fn();
    mockParams.mockReturnValue({ workspaceId: '123' });
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });
    mockValidateFields.mockReturnValue({ name: 'workspace1' });
    message.error = mockErrorMessage;

    const { result, waitFor } = renderHook(
      () =>
        useDeleteWorkspaceModalController({ id: '123', name: 'workspace1' }),
      {
        wrapper,
      }
    );
    expect(result.current.isButtonDisable).toBeTruthy();
    act(() =>
      result.current.onFieldChange([
        {
          value: 'workspace1',
        },
      ])
    );

    act(() => {
      result.current.onSave();
    });

    // await waitForNextUpdate();
    // await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.isButtonDisable).toBeFalsy();
    });
    expect(mockValidateFields).toBeCalled();
  });
});
