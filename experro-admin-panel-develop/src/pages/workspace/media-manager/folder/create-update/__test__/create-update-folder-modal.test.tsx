import { fireEvent, screen } from '@testing-library/react';

import CreateUpdateFolderModal from '../create-update-folder-modal';
import { renderWithClient } from '../../../../../../test';

const mockFolderId = 'ea305449-4919-4880-b477-cc7f23c92de3';
const mockWorkspaceId = '123';
const mockFolderDepth = 4;
const mockSelectedFolder = {
  id: 'ae657d4b-2a3e-4e35-bfef-a91316f4318a',
  name: 'folder 1',
  parentFolderId: 'fa0c950b-1a5d-4049-87c3-64932fc37006',
  isAllMedia: false,
};
const mockCreateFolder = jest.fn();
const mockUpdateFolder = jest.fn();
const mockBreadcrumbItems = [
  {
    key: 'folder 1',
    label: 'folder 1',
  },
];

const mockHideCreateUpdateFolderModal = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => ({ workspaceId: '123' }))(),
  };
});

jest.mock('../create-update-folder-modal-controller', () => () => ({
  t: (name: string) => name,
  isCreateUpdateFolderModalVisible: false,
  hideCreateUpdateFolderModal: mockHideCreateUpdateFolderModal,
  selectedFolder: mockSelectedFolder,
  breadcrumbItems: mockBreadcrumbItems,
  folderId: mockFolderId,
  workspaceId: mockWorkspaceId,
  createFolder: mockCreateFolder,
  updateFolder: mockUpdateFolder,
}));

describe('create-update-folder-modal-render', () => {
  it('modal render check', () => {
    renderWithClient(
      <CreateUpdateFolderModal
        hideCreateUpdateFolderModal={mockHideCreateUpdateFolderModal}
        isCreateUpdateFolderModalVisible={true}
        breadcrumbItems={[]}
        folderId={mockFolderId}
        folderDepth={mockFolderDepth}
      />
    );
    const textElement = screen.getAllByRole('textbox');
    expect(textElement.length).toBe(1);

    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(3);

    const headerElement = screen.getAllByText(
      'common.labels.create_folder_title'
    );
    expect(headerElement[0]).toBeInTheDocument();
  });

  it('modal for Rename', () => {
    renderWithClient(
      <CreateUpdateFolderModal
        hideCreateUpdateFolderModal={mockHideCreateUpdateFolderModal}
        isCreateUpdateFolderModalVisible={true}
        selectedFolder={mockSelectedFolder}
        breadcrumbItems={[]}
        folderId={mockFolderId}
        folderDepth={mockFolderDepth}
      />
    );
    expect(mockHideCreateUpdateFolderModal).not.toBeCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(mockHideCreateUpdateFolderModal).toBeCalled();

    const headerElement = screen.getAllByText(
      'common.labels.rename_folder_title'
    );
    expect(headerElement[0]).toBeInTheDocument();

    const textElement = screen.getAllByRole('textbox');
    expect(textElement.length).toBe(1);

    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(3);
  });

  it('create-update validation', async () => {
    renderWithClient(
      <CreateUpdateFolderModal
        hideCreateUpdateFolderModal={mockHideCreateUpdateFolderModal}
        isCreateUpdateFolderModalVisible={true}
        selectedFolder={mockSelectedFolder}
        breadcrumbItems={[]}
        folderId={mockFolderId}
        folderDepth={mockFolderDepth}
      />
    );
    const saveButtonElement = screen.getByRole('button', {
      name: 'common.labels.save',
    });
    expect(saveButtonElement).toBeInTheDocument();
    fireEvent.submit(saveButtonElement);
    await new Promise((r) => setTimeout(r, 50));
  });

  it('create-update from cancel', async () => {
    renderWithClient(
      <CreateUpdateFolderModal
        hideCreateUpdateFolderModal={mockHideCreateUpdateFolderModal}
        isCreateUpdateFolderModalVisible={true}
        selectedFolder={mockSelectedFolder}
        breadcrumbItems={[]}
        folderId={mockFolderId}
        folderDepth={mockFolderDepth}
      />
    );
    const cancelButtonElement = screen.getByRole('button', {
      name: 'common.labels.cancel',
    });
    expect(cancelButtonElement).toBeInTheDocument();
    fireEvent.click(cancelButtonElement);
    await new Promise((r) => setTimeout(r, 50));
    expect(mockHideCreateUpdateFolderModal).toBeCalled();
  });
});
