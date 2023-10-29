import React, { useRef } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithClient } from '../../../../../test';
import PhrasesEmails from '../phrases-emails';

const mockGetPhraseEmails = jest.fn().mockReturnValue(null);
const mockColumns = jest.fn().mockReturnValue(null);
const mockPagination = jest.fn().mockReturnValue(null);
const mockAddPhrase = jest.fn();
const mockIsCreateUpdatePhrasesModalVisible = jest.fn().mockReturnValue(null);
const mockOnHideCreateUpdatePhraseModal = jest.fn();
const mockOnNameChange = jest.fn();
const mockOnAddPhrase = jest.fn();
const mockDeletePhraseValue = jest.fn().mockReturnValue(null);
const mockIsDeleteModalVisible = jest.fn().mockReturnValue(null);
const mockOnHideDeleteModalVisible = jest.fn();
const mockOnDeletePhrase = jest.fn();
const mockEditRecordId = jest.fn().mockReturnValue(null);
const mockShortCode = jest.fn().mockReturnValue(null);
const mockPermission = jest.fn().mockReturnValue(null);
const mockFilter = jest.fn().mockReturnValue(null);
const mockOnFilterChange = jest.fn();
const mockOnPhrasesSelectChange = jest.fn();
const mockOnClearAllPhrases = jest.fn();
const mockOnSelectAllPhrases = jest.fn();
const mockOnDeleteMultipleData = jest.fn();

jest.mock('../phrases-controller', () => () => ({
  t: (name: string) => name,
  getPhraseEmails: mockGetPhraseEmails(),
  columns: mockColumns(),
  pagination: mockPagination(),
  addPhrase: mockAddPhrase,
  isCreateUpdatePhrasesModalVisible: mockIsCreateUpdatePhrasesModalVisible(),
  onHideCreateUpdatePhraseModal: mockOnHideCreateUpdatePhraseModal,
  onNameChange: mockOnNameChange,
  onAddPhrase: mockOnAddPhrase,
  deletePhraseValue: mockDeletePhraseValue(),
  isDeleteModalVisible: mockIsDeleteModalVisible(),
  onHideDeleteModalVisible: mockOnHideDeleteModalVisible,
  onDeletePhrase: mockOnDeletePhrase,
  editRecordId: mockEditRecordId(),
  shortCode: mockShortCode(),
  canCreateEmailTemplate: true,
  filter: mockFilter(),
  onFilterChange: mockOnFilterChange,
  onPhrasesSelectChange: mockOnPhrasesSelectChange,
  isAllPhrasesSelected: false,
  onClearAllPhrases: mockOnClearAllPhrases,
  onSelectAllPhrases: mockOnSelectAllPhrases,
  deletePhrasesIds: [],
  onDeleteMultipleData: mockOnDeleteMultipleData,
  deleteSinglePhrases: '',
}));

describe('phrases emails', () => {
  beforeEach(() => {
    mockGetPhraseEmails.mockReturnValue({
      isSuccess: true,
      data: {
        items: [
          {
            id: 'p1',
            name: 'Experiment',
            value: 'Have you ever tried {{experro}}?',
            shortCode: '{{experiment}}',
          },
          {
            id: 'p2',
            name: 'Experro',
            value: 'e-commerce platform',
            shortCode: '{{experro}}',
          },
        ],
      },
    });

    mockColumns.mockReturnValue([
      {
        title: 'common.labels.name',
      },
      {
        title: 'common.labels.value',
      },
      {
        title: 'common.labels.shortCode',
      },
    ]);

    mockPagination.mockReturnValue({
      total: 1,
      pageSize: 20,
      showSizeChanger: true,
      current: 1,
      hideOnSinglePage: true,
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: {
        items_per_page: ' per page',
      },
    });

    mockIsCreateUpdatePhrasesModalVisible.mockReturnValue(false);
    mockDeletePhraseValue.mockReturnValue({ name: 'Experro' });

    mockEditRecordId.mockReturnValue('');
    mockShortCode.mockReturnValue('');
    mockFilter.mockReturnValue('');

    mockPermission.mockReturnValue({
      canCreateEmailTemplatesTemplate: jest.fn().mockReturnValue(true),
    });
  });

  it.skip('render properly', () => {
    const emailRef = useRef(null);
    mockIsDeleteModalVisible.mockReturnValue(false);

    renderWithClient(
      <PhrasesEmails defaultActiveKey="phrases" emailRef={emailRef} />
    );

    const filterTextbox = screen.getByPlaceholderText('common.labels.search');
    expect(filterTextbox).toBeInTheDocument();

    const addPhraseButton = screen.getByRole('button', {
      name: 'common.labels.add_phrase',
    });
    expect(addPhraseButton).toBeInTheDocument();

    const phraseEmailsTable = screen.getByRole('table');
    expect(phraseEmailsTable).toBeInTheDocument();
  });

  it.skip('delete phrase dialog render properly', () => {
    const emailRef = useRef(null);
    mockIsDeleteModalVisible.mockReturnValue(true);

    renderWithClient(
      <PhrasesEmails defaultActiveKey="phrases" emailRef={emailRef} />
    );

    const deletePhraseDialog = screen.getByRole('dialog');
    expect(deletePhraseDialog).toBeInTheDocument();

    const dialogTitle = screen.getByText('common.messages.delete_entity');
    expect(dialogTitle).toBeInTheDocument();

    const dialogDescription = screen.getByText(
      'common.messages.delete_phrase_modal_message'
    );
    expect(dialogDescription).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const deleteButton = screen.getByText('common.labels.delete');
    expect(deleteButton).toBeInTheDocument();
  });

  it.skip('filter phrase emails', () => {
    const emailRef = useRef(null);
    mockIsDeleteModalVisible.mockReturnValue(false);

    renderWithClient(
      <PhrasesEmails defaultActiveKey="phrases" emailRef={emailRef} />
    );

    const filterTextbox = screen.getByPlaceholderText('common.labels.search');

    userEvent.type(filterTextbox, 'Exper');

    expect(mockOnFilterChange).toBeCalled();
  });

  it.skip('add phrase', () => {
    mockIsDeleteModalVisible.mockReturnValue(false);
    const emailRef = useRef(null);

    renderWithClient(
      <PhrasesEmails defaultActiveKey="phrases" emailRef={emailRef} />
    );

    const addPhraseButton = screen.getByRole('button', {
      name: 'common.labels.add_phrase',
    });

    fireEvent.click(addPhraseButton);

    expect(mockAddPhrase).toBeCalled();
  });

  it.skip('delete phrase button working properly', () => {
    const emailRef = useRef(null);
    mockIsDeleteModalVisible.mockReturnValue(true);

    renderWithClient(
      <PhrasesEmails defaultActiveKey="phrases" emailRef={emailRef} />
    );

    const deleteButton = screen.getByText('common.labels.delete');

    fireEvent.click(deleteButton);

    expect(mockOnDeletePhrase).toBeCalled();
  });
});
