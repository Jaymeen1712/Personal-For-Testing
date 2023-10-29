import { screen } from '@testing-library/react';
import { renderWithClient } from '../../../../../test';
import Templates from '../templates';

const mockOnListMasterTemplateChange = jest.fn();
const mockListMasterTemplateEmails = jest.fn().mockReturnValue(null);
const mockSelectedMasterTemplateId = jest.fn().mockReturnValue(null);
const mockListTemplates = jest.fn().mockReturnValue(null);
const mockColumns = jest.fn().mockReturnValue(null);
const mockIsDeleteModalVisible = jest.fn().mockReturnValue(null);
const mockOnHideDeleteModal = jest.fn();
const mockOnDeleteTemplateModal = jest.fn();
const mockIsLoadingDeleteButton = jest.fn().mockReturnValue(null);
const mockSelectedTemplateIdForSendEmail = jest.fn().mockReturnValue(null);
const mockIsSendEmailModalVisible = jest.fn().mockReturnValue(null);
const mockOnHideSendTestEmailModal = jest.fn();
const mockWorkspaceId = jest.fn().mockReturnValue(null);
const mockDeleteRecordName = jest.fn().mockReturnValue(null);

jest.mock('../templates-controller', () => () => ({
  t: (name: string) => name,
  onListMasterTemplateChange: mockOnListMasterTemplateChange,
  listMasterTemplateEmails: mockListMasterTemplateEmails(),
  selectedMasterTemplateId: mockSelectedMasterTemplateId(),
  listTemplates: mockListTemplates(),
  columns: mockColumns(),
  isDeleteModalVisible: mockIsDeleteModalVisible(),
  onHideDeleteModal: mockOnHideDeleteModal,
  onDeleteTemplateModal: mockOnDeleteTemplateModal,
  isLoadingDeleteButton: mockIsLoadingDeleteButton(),
  selectedTemplateIdForSendEmail: mockSelectedTemplateIdForSendEmail(),
  isSendEmailModalVisible: mockIsSendEmailModalVisible(),
  onHideSendTestEmailModal: mockOnHideSendTestEmailModal,
  workspaceId: mockWorkspaceId(),
  deleteRecordName: mockDeleteRecordName(),
}));

describe('email templates', () => {
  it('render properly', () => {
    mockWorkspaceId.mockReturnValue('123');
    mockSelectedMasterTemplateId.mockReturnValue('rp1');
    mockIsDeleteModalVisible.mockReturnValue(false);
    mockIsLoadingDeleteButton.mockReturnValue(false);
    mockIsSendEmailModalVisible.mockReturnValue(false);
    mockSelectedTemplateIdForSendEmail.mockReturnValue('');
    mockDeleteRecordName.mockReturnValue('');
    mockListMasterTemplateEmails.mockReturnValue({
      isSuccess: true,
      data: [
        { id: 'rp1', name: 'Reset Password' },
        { id: 'su1', name: 'Sign Up' },
        { id: 'fp1', name: 'Forgot Password' },
      ],
    });
    mockListTemplates.mockReturnValue({
      isSuccess: true,
      data: [
        {
          id: 'test1',
          name: 'Default - Reset Password',
          htmlContent: '',
          environmentIds: ['prod1', 'dev1'],
          isDefault: true,
          subject: 'Reset Password',
          isActive: true,
          environments: ['Production', 'Development'],
        },
      ],
    });
    mockColumns.mockReturnValue([
      {
        title: 'common.labels.name',
      },
      {
        title: 'common.labels.assigned_to',
      },
      {
        title: 'common.labels.status',
      },
    ]);

    const { container } = renderWithClient(<Templates />);

    const templateLabel = screen.getByText('common.labels.template');
    expect(templateLabel).toBeInTheDocument();

    const masterTemplateDropDown =
      container.getElementsByClassName('ant-select')[0];
    expect(masterTemplateDropDown).toBeInTheDocument();

    // const grid = container.getElementsByClassName('table-section')[0];
    // expect(grid).toBeInTheDocument();
  });
});
