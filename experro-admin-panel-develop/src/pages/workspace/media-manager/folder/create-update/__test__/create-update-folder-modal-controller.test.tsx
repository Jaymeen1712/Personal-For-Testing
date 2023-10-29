import { renderHook, act } from '@testing-library/react-hooks';

import { wrapper } from '../../../../../../test/utills';
import useCreateUpdateFolderController from '../create-update-folder-modal-controller';

const mockParams = jest.fn();
const mockHideModal = jest.fn();
const mockRemoveQueries = jest.fn();
const mockPush = jest.fn();
const mockSelectedFolder = {
  id: 'ae657d4b-2a3e-4e35-bfef-a91316f4318a',
  name: 'folder 1',
  parentFolderId: 'fa0c950b-1a5d-4049-87c3-64932fc37006',
  isAllMedia: false,
};
const mockFolderDepth = 2;

jest.mock('../../../../../../query-client', () => {
  return {
    removeQueries: () => mockRemoveQueries(),
  };
});

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useHistory: jest.fn().mockReturnValue(() => ({ push: mockPush }))(),
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
  };
});

describe('create-update folder controller', () => {
  it('On Save', async () => {
    mockParams.mockReturnValue({ workspaceId: '123' });
    const { result } = renderHook(
      () =>
        useCreateUpdateFolderController(
          'fa0c950b-1a5d-4049-87c3-64932fc37006',
          mockHideModal,
          mockFolderDepth
        ),
      {
        wrapper,
      }
    );
    act(() => {
      result.current.onSave();
    });
  });

  it('On Rename', async () => {
    mockParams.mockReturnValue({ workspaceId: '123' });
    const { result } = renderHook(
      () =>
        useCreateUpdateFolderController(
          'fa0c950b-1a5d-4049-87c3-64932fc37006',
          mockHideModal,
          mockFolderDepth,
          mockSelectedFolder
        ),
      {
        wrapper,
      }
    );
    act(() => {
      result.current.onSave();
    });
  });
});
