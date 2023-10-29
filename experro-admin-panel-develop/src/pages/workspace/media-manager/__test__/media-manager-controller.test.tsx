import { renderHook, act } from '@testing-library/react-hooks';

import { wrapper } from '../../../../test/utills';
import useMediaManagerController from '../media-manager-controller';

const mockHistory = jest.fn();
const mockParams = jest.fn();
const mockLocation = jest.fn();
const mockPush = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
    useHistory: jest.fn().mockReturnValue(() => ({ push: mockPush }))(),
    useLocation: () => jest.fn().mockReturnValue(() => mockLocation())(),
  };
});

describe('media manager controller', () => {
  it('hideCreateUpdateFolderModal', async () => {
    mockParams.mockReturnValue({
      workspaceId: '123',
    });
    const { result } = renderHook(() => useMediaManagerController(), {
      wrapper,
    });
    act(() => {
      result.current.hideCreateUpdateFolderModal();
    });
    expect(result.current.isCreateUpdateFolderModalVisible).toBeFalsy();
  });

  it('hideDeleteModal', async () => {
    mockParams.mockReturnValue({
      workspaceId: '123',
    });
    const { result } = renderHook(() => useMediaManagerController(), {
      wrapper,
    });
    act(() => {
      result.current.hideDeleteModal();
    });
    expect(result.current.isDeleteModalVisible).toBeFalsy();
  });

  it('OnCreateClick', async () => {
    mockParams.mockReturnValue({
      workspaceId: '123',
    });
    const { result } = renderHook(() => useMediaManagerController(), {
      wrapper,
    });
    act(() => {
      result.current.onCreateClick();
    });
    expect(result.current.isCreateUpdateFolderModalVisible).toBeTruthy();
  });

  it('onSubSidebarMenuItemClick', async () => {
    mockParams.mockReturnValue({
      workspaceId: '123',
    });

    mockHistory.mockReturnValue({
      push: mockPush.mockReturnValue({ historyPush: jest.fn() }),
    });
    const { result } = renderHook(() => useMediaManagerController(), {
      wrapper,
    });
    act(() => {
      // @ts-ignore
      result.current.onSubSidebarMenuItemClick({
        key: 'Folder 1',
        keyPath: ['', 'ea305449-4919-4880-b477-cc7f23c92de3'],
      });
    });
    expect(mockPush).toBeCalledWith(
      `/workspaces/123/media-manager?folder=Folder 1`
    );
  });
});
