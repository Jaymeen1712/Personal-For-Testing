import MediaManager from '../media-manager';
import { renderWithClient } from '../../../../test';

const mockWorkpaceId = jest.fn().mockReturnValue('1234567890');
const mockFileCount = jest.fn().mockReturnValue(0);
const mockOnCreateClick = jest.fn();
const mockOnSubSidebarMenuItemClick = jest.fn();
const mockHideCreateUpdateFolderModal = jest.fn();
const mockHideDeleteModal = jest.fn();
const mockUpdateFilesEmpty = jest.fn();
const mockOnSubSidebarOpenChange = jest.fn();
const mockSetFileCount = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('../media-manager-controller', () => () => ({
  t: (name: string) => name,
  workspaceId: mockWorkpaceId,
  folderId: 'ea305449-4919-4880-b477-cc7f23c92de3',
  fileLoading: false,
  fileCount: mockFileCount,
  setFileCountState: mockSetFileCount,
  menuItems: [],
  onCreateClick: mockOnCreateClick,
  hideCreateUpdateFolderModal: mockHideCreateUpdateFolderModal,
  isCreateUpdateFolderModalVisible: false,
  selectedFolder: [],
  onSubSidebarMenuItemClick: mockOnSubSidebarMenuItemClick,
  onSubSidebarOpenChange: mockOnSubSidebarOpenChange,
  breadcrumbItems: [],
  isDeleteModalVisible: false,
  hideDeleteModal: mockHideDeleteModal,
  openFolderIds: [],
  setFilesEmpty: mockUpdateFilesEmpty,
}));

describe('media-manager-render', () => {
  it('component render check', () => {
    renderWithClient(<MediaManager />);
  });
});
