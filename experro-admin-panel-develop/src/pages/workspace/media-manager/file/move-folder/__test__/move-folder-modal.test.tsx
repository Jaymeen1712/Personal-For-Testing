import { fireEvent, screen } from '@testing-library/react';

import MoveFolderModal from '../move-folder-modal';
import { renderWithClient } from '../../../../../../test';

const mockFolderId = 'ea305449-4919-4880-b477-cc7f23c92de3';

const mockParams = jest.fn();
const mockHideModal = jest.fn();
const mockMoveFile = jest.fn();
const mockListFolder = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
  };
});

jest.mock('../move-folder-modal-controller', () => () => ({
  t: (name: string) => name,
  isModalVisible: false,
  hideModal: mockHideModal,
  onMoveFile: mockMoveFile,
  targetFolderId: '',
  folderId: mockFolderId,
  listFolder: mockListFolder,
}));

describe('move-folder-modal-render', () => {
  it('modal render check', () => {
    renderWithClient(
      <MoveFolderModal
        isModalVisible={true}
        folderId={mockFolderId}
        onMoveFile={mockMoveFile}
        hideModal={mockHideModal}
      />
    );
    const textBoxElement = screen.getAllByRole('textbox');
    expect(textBoxElement.length).toBe(1);

    // const headerTextElement = screen.getByText('common.labels.all_folder');
    // expect(headerTextElement).toBeInTheDocument();

    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(3);

    const headerElement = screen.getAllByText('common.labels.move_items_to');
    expect(headerElement[0]).toBeInTheDocument();
  });

  it('move form save', async () => {
    renderWithClient(
      <MoveFolderModal
        isModalVisible={true}
        folderId={mockFolderId}
        onMoveFile={mockMoveFile}
        hideModal={mockHideModal}
      />
    );
    const moveButtonElement = screen.getByRole('button', {
      name: 'common.labels.move',
    });
    expect(moveButtonElement).toBeInTheDocument();
    fireEvent.submit(moveButtonElement);
    await new Promise((r) => setTimeout(r, 50));
  });

  it('move form cancel', async () => {
    renderWithClient(
      <MoveFolderModal
        isModalVisible={true}
        folderId={mockFolderId}
        onMoveFile={mockMoveFile}
        hideModal={mockHideModal}
      />
    );
    const cancelButtonElement = screen.getByRole('button', {
      name: 'common.labels.cancel',
    });
    expect(cancelButtonElement).toBeInTheDocument();
    fireEvent.click(cancelButtonElement);
    await new Promise((r) => setTimeout(r, 50));
    expect(mockHideModal).toBeCalled();
  });
});
